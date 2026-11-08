"use server";

import { getUserSession } from "@/actions/auth/getUserSession";
import db from "@/lib/db";
import { ActionsResponse } from "@/types/index";
import { DateFilter, ProjectReport } from "@/features/report/types/report";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { toZonedTime, fromZonedTime, formatInTimeZone } from "date-fns-tz";

export interface HeatmapData {
  date: string; // YYYY-MM-DD
  count: number;
  duration: number; // seconds
}

export interface ChartData {
  name: string;
  duration: number;
}

export interface ReportDataPayload {
  tableData: ProjectReport[];
  heatmapData: HeatmapData[];
  chartData: ChartData[];
}

// 1. Add 'year' to the params interface
interface GetReportsParams {
  dateFilter?: DateFilter;
  timezone?: string;
  year?: number;
}

export async function getReports(
  params?: GetReportsParams,
): Promise<ActionsResponse<ReportDataPayload>> {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  try {
    // Default to current year if not provided
    const {
      dateFilter,
      timezone = "UTC",
      year = new Date().getFullYear(),
    } = params || {};
    if (
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 2100 ||
      (dateFilter && !["today", "week", "month"].includes(dateFilter))
    ) {
      return {
        success: false,
        message: "Invalid report filter",
        code: 400,
        data: null,
      };
    }
    new Intl.DateTimeFormat("en", { timeZone: timezone });
    const userNow = toZonedTime(new Date(), timezone);

    // --- Table Filter Logic (Remains unchanged) ---
    let startDate: Date | undefined;
    if (dateFilter === "today") {
      startDate = fromZonedTime(startOfDay(userNow), timezone);
    } else if (dateFilter === "week") {
      startDate = fromZonedTime(
        startOfWeek(userNow, { weekStartsOn: 1 }),
        timezone,
      );
    } else if (dateFilter === "month") {
      startDate = fromZonedTime(startOfMonth(userNow), timezone);
    }

    // --- Fetch Projects (Table & Chart) ---
    const projects = await db.project.findMany({
      where: { ownerId: session.user.id },
      include: {
        pomodoroSessions: {
          where: startDate ? { completedAt: { gte: startDate } } : undefined,
          select: { duration: true },
        },
        columns: {
          include: {
            tasks: {
              where: startDate ? { createdAt: { gte: startDate } } : undefined,
              select: { id: true, completed: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const tableData: ProjectReport[] = projects.map((project) => {
      const totalSeconds = project.pomodoroSessions.reduce(
        (sum, s) => sum + s.duration,
        0,
      );
      const allTasks = project.columns.flatMap((column) => column.tasks);
      return {
        id: project.id,
        projectName: project.name,
        totalHours: totalSeconds,
        taskCount: allTasks.length,
        completedTasks: allTasks.filter((t) => t.completed).length,
      };
    });

    // --- Chart Data ---
    const chartData = tableData
      .map((p) => ({ name: p.projectName, duration: p.totalHours }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    // --- 2. Fetch Heatmap Data (Specific Year) ---

    // Create Date objects for Jan 1 and Dec 31 of the selected year
    // We create them as strings first to avoid local timezone shifts, then convert to zoned time
    const startOfYearLocal = new Date(`${year}-01-01T00:00:00`);
    const endOfYearLocal = new Date(`${year + 1}-01-01T00:00:00`);

    const startQueryDate = fromZonedTime(startOfYearLocal, timezone);
    const endQueryDate = fromZonedTime(endOfYearLocal, timezone);

    const yearSessions = await db.pomodoroSession.findMany({
      where: {
        userId: session.user.id,
        completedAt: {
          gte: startQueryDate,
          lt: endQueryDate,
        },
      },
      select: {
        completedAt: true,
        duration: true,
      },
    });

    const heatmapMap = new Map<string, { count: number; duration: number }>();

    yearSessions.forEach((session) => {
      const dateKey = formatInTimeZone(
        session.completedAt,
        timezone,
        "yyyy-MM-dd",
      );

      const current = heatmapMap.get(dateKey) || { count: 0, duration: 0 };
      heatmapMap.set(dateKey, {
        count: current.count + 1,
        duration: current.duration + session.duration,
      });
    });

    const heatmapData: HeatmapData[] = Array.from(heatmapMap.entries()).map(
      ([date, data]) => ({
        date,
        count: data.count,
        duration: data.duration,
      }),
    );

    return {
      success: true,
      message: "Reports fetched successfully",
      code: 200,
      data: {
        tableData,
        heatmapData,
        chartData,
      },
    };
  } catch (err) {
    console.error("Error fetching reports:", err);
    return {
      success: false,
      message: "Something went wrong!",
      code: 500,
      data: null,
    };
  }
}
