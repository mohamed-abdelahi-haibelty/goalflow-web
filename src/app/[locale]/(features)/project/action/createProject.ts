"use server";

import db from "@/lib/db";
import { CreateProjectInput, createProjectSchema } from "../types/project";

import { ActionsResponse } from "@/types";
import { Project } from "@/generated/prisma/client";
import { getUserSession } from "@/actions/auth/getUserSession";

export async function createProject(
  data: CreateProjectInput,
  shouldRevalidate: boolean = true
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

  console.log("the parsed data", parsed);

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

    // Only revalidate when called from client components or form actions
    // Skip revalidation when called during server component render
    if (shouldRevalidate) {
      const { revalidatePath } = await import("next/cache");
      revalidatePath(`/project/${result.id}`);
    }

    return {
      success: true,
      message: "Project Created successfully!",
      code: 201,
      data: result,
    };
  } catch (err) {
    console.log("database error", err);
    return {
      success: false,
      message: "Something went wrong!",
      code: 500,
      data: null,
    };
  }
}
