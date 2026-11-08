import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/server/access", () => ({ requireOwnedTask: vi.fn() }));
vi.mock("@/features/pomodoro/actions/settings", () => ({
  getGlobalSettings: vi.fn(),
}));
vi.mock("@/features/streak/actions/updateStreak", () => ({
  updateStreak: vi.fn(),
}));
vi.mock("@/lib/db", () => ({
  default: {
    activeTimer: { upsert: vi.fn(), update: vi.fn() },
    $transaction: vi.fn(),
  },
}));
import db from "@/lib/db";
import { requireOwnedTask } from "@/server/access";
import { getGlobalSettings } from "@/features/pomodoro/actions/settings";
import {
  completeTaskSession,
  startTaskTimer,
} from "@/features/pomodoro/actions/timer";

describe("timer server boundaries", () => {
  beforeEach(() => {
    vi.mocked(requireOwnedTask).mockResolvedValue({
      task: { column: { projectId: "project-a" } },
      userId: "owner-a",
    } as never);
    vi.mocked(getGlobalSettings).mockResolvedValue({
      success: true,
      data: {
        workDuration: 1500,
        shortBreakDur: 300,
        longBreakDur: 900,
        roundsBeforeLongBreak: 4,
      },
    } as never);
  });
  it("rejects a foreign task before reading or writing its timer", async () => {
    vi.mocked(requireOwnedTask).mockRejectedValueOnce(
      new Error("Task not found"),
    );
    const result = await startTaskTimer("foreign-task", "owned-project");
    expect(result.success).toBe(false);
    expect(db.activeTimer.upsert).not.toHaveBeenCalled();
  });
  it("rejects premature completion instead of trusting a client countdown", async () => {
    vi.mocked(db.activeTimer.upsert).mockResolvedValue({
      id: "timer-a",
      status: "RUNNING",
      startTime: new Date(),
      pausedWhen: 1500,
      currentDuration: 1500,
      mode: "POMODORO",
      updatedAt: new Date(),
    } as never);
    const result = await completeTaskSession("task-a", "project-a");
    expect(result.success).toBe(false);
    expect(db.$transaction).not.toHaveBeenCalled();
  });
  it("does not write session history if another completion already claimed the timer", async () => {
    vi.mocked(db.activeTimer.upsert).mockResolvedValue({
      id: "timer-a",
      status: "RUNNING",
      startTime: new Date(Date.now() - 1600000),
      pausedWhen: 1500,
      currentDuration: 1500,
      mode: "POMODORO",
      sessionsCount: 0,
      updatedAt: new Date(),
    } as never);
    const create = vi.fn();
    vi.mocked(db.$transaction).mockImplementation(async (callback: unknown) => {
      return (callback as (tx: unknown) => Promise<unknown>)({
        activeTimer: { updateMany: vi.fn().mockResolvedValue({ count: 0 }) },
        pomodoroSession: { create },
      });
    });
    expect((await completeTaskSession("task-a", "project-a")).success).toBe(
      false,
    );
    expect(create).not.toHaveBeenCalled();
  });
});
