"use server";

import db from "@/lib/db";

import { ActionsResponse } from "@/types";
import { Task } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getUserSession } from "@/actions/auth/getUserSession";
import { CreateTaskInput, createTaskSchema } from "../types/types";

export async function createTask(
  data: CreateTaskInput
): Promise<ActionsResponse<Task>> {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  const parsed = createTaskSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
      error: parsed.error.flatten().fieldErrors,
      data: null,
      code: 400,
    };
  }

  const { title, columnId, projectId } = parsed.data;

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

    const column = await db.column.findUnique({
      where: { id: columnId, projectId: projectId },
    });

    if (!column) {
      return {
        success: false,
        message: "Column Not Found",
        data: null,
        code: 404,
      };
    }

    const lastTask = await db.task.findFirst({
      where: { columnId },
      orderBy: {
        order: "desc",
      },
      select: { order: true },
    });

    const newOrder = lastTask ? lastTask.order + 1 : 1;

    const task = await db.task.create({
      data: {
        title,
        columnId,
        order: newOrder,
      },
    });

    revalidatePath(`/project/${projectId}`);
    return {
      success: true,
      message: "Task Created successfully!",
      code: 201,
      data: task,
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
