"use server";

import db from "@/lib/db";

import { ActionsResponse } from "@/types/index";
import { Column } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getUserSession } from "@/actions/auth/getUserSession";
import {
  UpdateColumnOrderInput,
  updateColumnOrderSchema,
} from "@/features/column/types/types";

export async function updateColumnOrder(
  data: UpdateColumnOrderInput,
): Promise<ActionsResponse<Column[]>> {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  const parsed = updateColumnOrderSchema.safeParse(data);

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

    const transaction = items.map((column) =>
      db.column.update({
        where: { id: column.id, projectId },
        data: {
          order: column.order,
        },
      }),
    );

    const columns = await db.$transaction(transaction);

    revalidatePath(`/project/${projectId}`);

    return {
      success: true,
      message: "Columns reordered successfully!",
      code: 201,
      data: columns,
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
