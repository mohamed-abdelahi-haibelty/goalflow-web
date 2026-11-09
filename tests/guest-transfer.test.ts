import { beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({ default: { $transaction: vi.fn() } }));
import db from "@/lib/db";
import { transferGuestWorkspace } from "@/server/guest";
const tx = {
  user: { findUnique: vi.fn() },
  project: { updateMany: vi.fn() },
  pomodoroSession: { updateMany: vi.fn() },
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(db.$transaction).mockImplementation(async (callback: unknown) =>
    (callback as (value: typeof tx) => Promise<void>)(tx),
  );
});
it("moves only the linked guest's projects and focus history", async () => {
  tx.user.findUnique.mockResolvedValue({ id: "guest-a", isAnonymous: true });
  await transferGuestWorkspace("guest-a", "member-b");
  expect(tx.project.updateMany).toHaveBeenCalledWith({
    where: { ownerId: "guest-a" },
    data: { ownerId: "member-b" },
  });
  expect(tx.pomodoroSession.updateMany).toHaveBeenCalledWith({
    where: { userId: "guest-a" },
    data: { userId: "member-b" },
  });
});
it.each([
  null,
  { id: "member-a", isAnonymous: false },
  { id: "member-b", isAnonymous: true },
])(
  "never transfers a missing, registered, or identical identity",
  async (user) => {
    tx.user.findUnique.mockResolvedValue(user);
    await transferGuestWorkspace(user?.id || "missing", "member-b");
    expect(tx.project.updateMany).not.toHaveBeenCalled();
    expect(tx.pomodoroSession.updateMany).not.toHaveBeenCalled();
  },
);
