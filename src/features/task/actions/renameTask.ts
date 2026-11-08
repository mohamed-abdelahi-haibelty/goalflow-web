"use server";

import db from "@/lib/db";
import { ownedTaskWhere } from "@/server/access";

import { ActionsResponse } from "@/types/index";
import { Task } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getUserSession } from "@/actions/auth/getUserSession";
import { RenameTaskInput, renameTaskSchema } from "@/features/task/types/types";

export async function renameTask(
  data: RenameTaskInput,
): Promise<ActionsResponse<Task>> {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  const parsed = renameTaskSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
      error: parsed.error.flatten().fieldErrors,
      data: null,
      code: 400,
    };
  }

  const { projectId, title, id } = parsed.data;

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

    const task = await db.task.update({
      where: { id, ...ownedTaskWhere(session.user.id, projectId) },
      data: {
        title,
      },
    });

    revalidatePath(`/project/${projectId}`);

    return {
      success: true,
      message: "Task renamed successfully!",
      code: 201,
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
