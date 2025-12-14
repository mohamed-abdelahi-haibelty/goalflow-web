"use server";
import { getUserSession } from "@/actions/auth/getUserSession";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function renameProject(projectId: string, newName: string) {
  const session = await getUserSession();
  if (!session) return { success: false, message: "Unauthorized" };

  try {
    await db.project.update({
      where: { id: projectId, ownerId: session.user.id },
      data: { name: newName },
    });
    revalidatePath(`/project/${projectId}`);
    return { success: true, message: "Project renamed" };
  } catch (error) {
    return { success: false, message: "Failed to rename project" };
  }
}
