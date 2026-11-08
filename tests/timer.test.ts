import { describe, expect, it } from "vitest";
import {
  durationForMode,
  nextTimerMode,
  remainingTime,
} from "@/features/pomodoro/lib/timer";
import { timerSettingsSchema } from "@/features/pomodoro/schemas/settings";

const settings = { workDuration: 1500, shortBreakDur: 300, longBreakDur: 900 };
describe("Pomodoro timing", () => {
  it("uses the configured round count rather than a hard-coded four", () => {
    expect(nextTimerMode("POMODORO", 3, 3)).toBe("LONG_BREAK");
    expect(nextTimerMode("POMODORO", 2, 3)).toBe("SHORT_BREAK");
    expect(nextTimerMode("LONG_BREAK", 3, 3)).toBe("POMODORO");
  });
  it("chooses the configured duration for each mode", () => {
    expect(durationForMode("POMODORO", settings)).toBe(1500);
    expect(durationForMode("SHORT_BREAK", settings)).toBe(300);
    expect(durationForMode("LONG_BREAK", settings)).toBe(900);
  });
  it("computes remaining time from server timestamps and preserves a zero remainder", () => {
    const timer = {
      status: "RUNNING" as const,
      startTime: new Date(0),
      pausedWhen: 30,
      currentDuration: 1500,
    };
    expect(remainingTime(timer, 10000)).toBe(20);
    expect(remainingTime(timer, 40000)).toBe(0);
    expect(remainingTime({ ...timer, pausedWhen: 0 }, 0)).toBe(0);
  });
  it("rejects negative durations, fractional rounds, and excessive volume", () => {
    const valid = { work: 1500, short: 300, long: 900, rounds: 4, volume: 50 };
    expect(timerSettingsSchema.safeParse(valid).success).toBe(true);
    for (const invalid of [{ work: -1 }, { rounds: 1.5 }, { volume: 101 }]) {
      expect(
        timerSettingsSchema.safeParse({ ...valid, ...invalid }).success,
      ).toBe(false);
    }
  });
});
