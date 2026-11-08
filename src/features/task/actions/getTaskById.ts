"use server";

import db from "@/lib/db";
import { ownedTaskWhere } from "@/server/access";

import { ActionsResponse } from "@/types/index";
import { Task } from "@/generated/prisma/client";
import { getUserSession } from "@/actions/auth/getUserSession";

export async function getTaskById(data: {
  taskId: string;
  projectId: string;
}): Promise<ActionsResponse<Task>> {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  const { projectId, taskId } = data;

  try {
    const project = await db.project.findUnique({
      where: { id: projectId, ownerId: session.user.id },
    });

    if (!project) {
      return {
        success: false,
        message: "Project Not Found",
        data: null,
        code: 404,
      };
    }

    const task = await db.task.findUnique({
      where: { id: taskId, ...ownedTaskWhere(session.user.id, projectId) },
    });

    if (!task) {
      return {
        success: false,
        message: "Task Not Found",
        data: null,
        code: 404,
      };
    }

    return {
      success: true,
      message: "ok!",
      code: 200,
      data: task,
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
