"use server";

import db from "@/lib/db";
import { CreateProjectInput, createProjectSchema } from "../types/project";

import { ActionsResponse } from "@/types";
import { Project } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getUserSession } from "@/actions/auth/getUserSession";

export async function createProject(
  data: CreateProjectInput
): Promise<ActionsResponse<Project>> {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  const parsed = createProjectSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
      error: parsed.error.flatten().fieldErrors,
      data: null,
      code: 400,
    };
  }

  try {
    const result = await db.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: parsed.data.name,
          ownerId: session.user.id,
        },
      });

      const defaultColumns = ["Todo", "In progress", "Done"];

      await Promise.all(
        defaultColumns.map(async (col, idx) =>
          tx.column.create({
            data: {
              name: col,
              order: idx + 1,
              projectId: project.id,
            },
          })
        )
      );

      return project;
    });

    revalidatePath(`/project/${result.id}`);
    return {
      success: true,
      message: "Project Created successfully!",
      code: 201,
      data: result,
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
