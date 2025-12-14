"use server";

import db from "@/lib/db";
import { getUserSession } from "@/actions/auth/getUserSession";

export async function deleteProject(projectId: string) {
  const session = await getUserSession();
  if (!session) return { success: false, message: "Unauthorized" };

  try {
    // 1. Check how many projects the user has
    const projectCount = await db.project.count({
      where: {
        ownerId: session.user.id,
      },
    });

    // 2. Prevent deletion if it's the last one
    if (projectCount <= 1) {
      return {
        success: false,
        message:
          "You cannot delete your only project. Create another one first.",
      };
    }

    // 3. Proceed with deletion
    await db.project.delete({
      where: {
        id: projectId,
        ownerId: session.user.id, // Ensure ownership
      },
    });

    return { success: true, message: "Project deleted" };
  } catch (error) {
    return { success: false, message: "Failed to delete project" };
  }
}
