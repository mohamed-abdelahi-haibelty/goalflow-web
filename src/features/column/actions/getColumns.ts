"use server";

import { getUserSession } from "@/actions/auth/getUserSession";
import db from "@/lib/db";
import { ActionsResponse } from "@/types/index";
import { ColumnWithTasks } from "@/features/column/types/types";

export async function getColumns(
  projectId: string,
): Promise<ActionsResponse<ColumnWithTasks[]>> {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  try {
    // Validate that the project belongs to the user
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    });

    if (!project || project.ownerId !== session.user.id) {
      return {
        message: "Forbidden",
        success: false,
        code: 403,
        data: null,
      };
    }

    const columns = await db.column.findMany({
      where: { projectId },
      include: {
        tasks: {
          orderBy: {
            order: "asc",
          },
          include: {
            _count: {
              select: { pomodoroSessions: true },
            },
          },
        },
      },
      orderBy: { order: "asc" },
    });

    const columnWithTasks = columns.map((column) => ({
      ...column,
      tasks: column.tasks.map((task) => {
        const { _count, ...rest } = task;
        return {
          ...rest,
          sessionCount: _count.pomodoroSessions,
        };
      }),
    }));

    return {
      success: true,
      message: "Columns fetched",
      code: 200,
      data: columnWithTasks,
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong!",
      code: 500,
      data: null,
    };
  }
}
