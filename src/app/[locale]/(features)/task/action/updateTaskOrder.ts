"use server";

import db from "@/lib/db";

import { ActionsResponse } from "@/types";
import { Task } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getUserSession } from "@/actions/auth/getUserSession";
import { UpdateTaskOrderInput, updateTaskOrderSchema } from "../types/types";

export async function updateTaskOrder(
  data: UpdateTaskOrderInput
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

    const transation = items.map((task) =>
      db.task.update({
        where: { id: task.id },
        data: {
          order: task.order,
          columnId: task.columnId,
        },
      })
    );

    const tasks = await db.$transaction(transation);

    revalidatePath(`/project/${projectId}`);

    return {
      success: true,
      message: "Tasks reordered successfully!",
      code: 201,
      data: tasks,
    };
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong!",
      code: 500,
      data: null,
    };
  }
}
