"use server";

import db from "@/lib/db";

import { ActionsResponse } from "@/types/index";
import { Column } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getUserSession } from "@/actions/auth/getUserSession";
import {
  CreateColumnInput,
  createColumnSchema,
} from "@/features/column/types/types";

export async function createColumn(
  data: CreateColumnInput,
): Promise<ActionsResponse<Column>> {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  const parsed = createColumnSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
      error: parsed.error.flatten().fieldErrors,
      data: null,
      code: 400,
    };
  }

  const { name, projectId } = parsed.data;

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

    const lastColumn = await db.column.findFirst({
      where: { projectId },
      orderBy: {
        order: "desc",
      },
      select: { order: true },
    });

    const newOrder = lastColumn ? lastColumn.order + 1 : 1;

    const column = await db.column.create({
      data: {
        name: name,
        projectId: projectId,
        order: newOrder,
      },
    });

    revalidatePath(`/project/${projectId}`);
    return {
      success: true,
      message: "Column Created successfully!",
      code: 201,
      data: column,
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
