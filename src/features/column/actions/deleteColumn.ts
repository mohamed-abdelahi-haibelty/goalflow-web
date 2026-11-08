"use server";

import db from "@/lib/db";

import { ActionsResponse } from "@/types/index";
import { Column } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getUserSession } from "@/actions/auth/getUserSession";
import {
  DeleteColumnInput,
  deleteColumnSchema,
} from "@/features/column/types/types";

export async function deleteColumn(
  data: DeleteColumnInput,
): Promise<ActionsResponse<Column>> {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  const parsed = deleteColumnSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
      error: parsed.error.flatten().fieldErrors,
      data: null,
      code: 400,
    };
  }

  const { projectId, id } = parsed.data;

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
      where: { id },
    });

    if (!column) {
      return {
        success: false,
        message: "Column Not Found",
        data: null,
        code: 404,
      };
    }

    await db.column.delete({
      where: { id, projectId },
    });

    revalidatePath(`/project/${projectId}`);
    return {
      success: true,
      message: "Column deleted successfully!",
      code: 201,
      data: null,
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
