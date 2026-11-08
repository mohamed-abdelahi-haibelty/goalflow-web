import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/actions/auth/getUserSession", () => ({ getUserSession: vi.fn() }));
vi.mock("@/lib/db", () => ({
  default: {
    project: { findUnique: vi.fn() },
    task: { findUnique: vi.fn(), delete: vi.fn(), update: vi.fn() },
    column: { count: vi.fn() },
    $transaction: vi.fn(),
  },
}));
import db from "@/lib/db";
import { getUserSession } from "@/actions/auth/getUserSession";
import { deleteTask } from "@/features/task/actions/deleteTask";
import { updateTaskOrder } from "@/features/task/actions/updateTaskOrder";

describe("task ownership boundaries", () => {
  beforeEach(() => {
    vi.mocked(getUserSession).mockResolvedValue({
      user: { id: "owner-a" },
    } as Awaited<ReturnType<typeof getUserSession>>);
    vi.mocked(db.project.findUnique).mockResolvedValue({
      id: "project-a",
    } as never);
  });
  it("rejects deletion when a supplied task does not belong to the owned project", async () => {
    vi.mocked(db.task.findUnique).mockResolvedValue(null);
    const result = await deleteTask({
      id: "foreign-task",
      projectId: "project-a",
    });
    expect(result.success).toBe(false);
    expect(db.task.findUnique).toHaveBeenCalledWith({
      where: {
        id: "foreign-task",
        column: { project: { id: "project-a", ownerId: "owner-a" } },
      },
    });
    expect(db.task.delete).not.toHaveBeenCalled();
  });
  it("rejects reordering into a column outside the owned project", async () => {
    vi.mocked(db.column.count).mockResolvedValue(0);
    const result = await updateTaskOrder({
      projectId: "project-a",
      items: [
        {
          id: "task-a",
          columnId: "foreign-column",
          title: "A task",
          completed: false,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });
    expect(result.success).toBe(false);
    expect(db.task.update).not.toHaveBeenCalled();
  });
  it("does not query projects for an unauthenticated request", async () => {
    vi.mocked(getUserSession).mockResolvedValue(null);
    expect(
      (await deleteTask({ id: "task-a", projectId: "project-a" })).code,
    ).toBe(401);
    expect(db.project.findUnique).not.toHaveBeenCalled();
  });
});
