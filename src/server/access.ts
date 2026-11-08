import "server-only";
import { getUserSession } from "@/actions/auth/getUserSession";
import db from "@/lib/db";

export function ownedTaskWhere(userId: string, projectId?: string) {
  return {
    column: {
      project: { ownerId: userId, ...(projectId ? { id: projectId } : {}) },
    },
  };
}

export async function requireOwnedTask(taskId: string, projectId?: string) {
  const session = await getUserSession();
  if (!session) throw new Error("Unauthorized");
  const task = await db.task.findFirst({
    where: { id: taskId, ...ownedTaskWhere(session.user.id, projectId) },
    include: { column: { select: { projectId: true } } },
  });
  if (!task) throw new Error("Task not found");
  return { task, userId: session.user.id };
}
