"use server";
import { Plan } from "@/generated/prisma/enums";
import db from "@/lib/db";

/**
 * Downgrades a user to FREE and locks projects exceeding the limit.
 */
export async function handleDowngrade(userId: string) {
  // 1. Set user to FREE
  await db.user.update({
    where: { id: userId },
    data: { plan: Plan.FREE },
  });

  // 2. Fetch all projects ordered by creation date (Oldest first)
  const projects = await db.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "asc" },
  });

  // 3. Logic: Keep first 2 active, lock the rest
  const FREE_LIMIT = 2;

  if (projects.length > FREE_LIMIT) {
    // Slice logic: The first 2 are safe. The rest get locked.
    const projectsToLock = projects.slice(FREE_LIMIT);
    const idsToLock = projectsToLock.map((p) => p.id);

    await db.project.updateMany({
      where: { id: { in: idsToLock } },
      data: { isLocked: true },
    });

    console.log(`Locked ${idsToLock.length} projects for user ${userId}`);
  }
}

/**
 * Upgrades a user to PRO and unlocks ALL projects.
 */
export async function handleUpgrade(
  userId: string,
  subscriptionId: string,
  priceId: string
) {
  // 1. Set user to PRO
  await db.user.update({
    where: { id: userId },
    data: { plan: Plan.PRO },
  });

  // 2. Unlock all projects
  await db.project.updateMany({
    where: { ownerId: userId },
    data: { isLocked: false },
  });
}
