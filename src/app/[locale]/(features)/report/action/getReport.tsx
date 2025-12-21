"use server";

import { getUserSession } from "@/actions/auth/getUserSession";
import db from "@/lib/db";
import { ActionsResponse } from "@/types";
import { DateFilter, ProjectReport } from "../types/report";
import {
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  format,
} from "date-fns";
import { toDate, fromZonedTime } from "date-fns-tz";

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

interface GetReportsParams {
  dateFilter?: DateFilter;
  timezone?: string;
}

export async function getReports(
  params?: GetReportsParams
): Promise<ActionsResponse<ReportDataPayload>> {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  try {
    const { dateFilter, timezone = "UTC" } = params || {};
    const userNow = toDate(new Date(), { timeZone: timezone });

    // 1. Calculate Table Filter Date
    let startDate: Date | undefined;
    if (dateFilter === "today") {
      startDate = fromZonedTime(startOfDay(userNow), timezone);
    } else if (dateFilter === "week") {
      startDate = fromZonedTime(
        startOfWeek(userNow, { weekStartsOn: 1 }),
        timezone
      );
    } else if (dateFilter === "month") {
      startDate = fromZonedTime(startOfMonth(userNow), timezone);
    }

    // 2. Fetch Projects (Table & Comparison Chart)
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
        0
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

    // 3. Chart Data
    const chartData = tableData
      .map((p) => ({ name: p.projectName, duration: p.totalHours }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    // 4. Fetch Heatmap Data (Last 365 Days)
    // We go back 365 days to ensure a full year view
    const oneYearAgoLocal = subDays(startOfDay(userNow), 365);
    const oneYearAgoUtc = fromZonedTime(oneYearAgoLocal, timezone);

    const recentSessions = await db.pomodoroSession.findMany({
      where: {
        userId: session.user.id,
        completedAt: { gte: oneYearAgoUtc },
      },
      select: {
        completedAt: true,
        duration: true,
      },
    });

    const heatmapMap = new Map<string, { count: number; duration: number }>();

    recentSessions.forEach((session) => {
      const zonedDate = toDate(session.completedAt, { timeZone: timezone });
      const dateKey = format(zonedDate, "yyyy-MM-dd");

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
      })
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
