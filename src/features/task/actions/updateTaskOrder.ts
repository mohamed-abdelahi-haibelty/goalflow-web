"use server";

import db from "@/lib/db";
import { ownedTaskWhere } from "@/server/access";

import { ActionsResponse } from "@/types/index";
import { Task } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getUserSession } from "@/actions/auth/getUserSession";
import {
  UpdateTaskOrderInput,
  updateTaskOrderSchema,
} from "@/features/task/types/types";

export async function updateTaskOrder(
  data: UpdateTaskOrderInput,
): Promise<ActionsResponse<Task[]>> {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  const parsed = updateTaskOrderSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
      error: parsed.error.flatten().fieldErrors,
      data: null,
      code: 400,
    };
  }

  const { projectId, items } = parsed.data;

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

    const targetColumns = await db.column.count({
      where: {
        id: { in: [...new Set(items.map((item) => item.columnId))] },
        projectId,
      },
    });
    if (targetColumns !== new Set(items.map((item) => item.columnId)).size) {
      return {
        success: false,
        message: "Invalid destination column",
        code: 404,
        data: null,
      };
    }
    const transaction = items.map((task) =>
      db.task.update({
        where: { id: task.id, ...ownedTaskWhere(session.user.id, projectId) },
        data: {
          order: task.order,
          columnId: task.columnId,
        },
      }),
    );

    const tasks = await db.$transaction(transaction);

    revalidatePath(`/project/${projectId}`);

    return {
      success: true,
      message: "Tasks reordered successfully!",
      code: 201,
      data: tasks,
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
