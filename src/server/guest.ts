import "server-only";
import db from "@/lib/db";

export async function transferGuestWorkspace(guestId: string, userId: string) {
  await db.$transaction(async (tx) => {
    const guest = await tx.user.findUnique({ where: { id: guestId } });
    if (!guest?.isAnonymous || guest.id === userId) return;
    await tx.project.updateMany({
      where: { ownerId: guest.id },
      data: { ownerId: userId },
    });
    await tx.pomodoroSession.updateMany({
      where: { userId: guest.id },
      data: { userId },
    });
  });
}
