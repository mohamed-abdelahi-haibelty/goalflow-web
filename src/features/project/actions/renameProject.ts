"use server";
import { getUserSession } from "@/actions/auth/getUserSession";
import { createProjectSchema } from "@/features/project/types/project";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function renameProject(projectId: string, newName: string) {
  const session = await getUserSession();
  if (!session) return { success: false, message: "Unauthorized" };

  const parsed = createProjectSchema.safeParse({ name: newName });
  if (!parsed.success)
    return { success: false, message: "Invalid project name" };

  try {
    await db.project.update({
      where: { id: projectId, ownerId: session.user.id },
      data: { name: parsed.data.name },
    });
    revalidatePath(`/project/${projectId}`);
    return { success: true, message: "Project renamed" };
  } catch {
    return { success: false, message: "Failed to rename project" };
  }
}
