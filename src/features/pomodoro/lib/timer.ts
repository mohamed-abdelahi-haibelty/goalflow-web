import type {
  ActiveTimer,
  Mode,
  TimerSettings,
} from "@/generated/prisma/browser";

export function durationForMode(
  mode: Mode,
  settings: Pick<
    TimerSettings,
    "workDuration" | "shortBreakDur" | "longBreakDur"
  >,
) {
  if (mode === "SHORT_BREAK") return settings.shortBreakDur;
  if (mode === "LONG_BREAK") return settings.longBreakDur;
  return settings.workDuration;
}

export function nextTimerMode(
  mode: Mode,
  completedSessions: number,
  rounds: number,
): Mode {
  if (mode !== "POMODORO") return "POMODORO";
  return completedSessions % rounds === 0 ? "LONG_BREAK" : "SHORT_BREAK";
}

export function remainingTime(
  timer: Pick<
    ActiveTimer,
    "status" | "startTime" | "pausedWhen" | "currentDuration"
  >,
  now = Date.now(),
) {
  const duration = timer.pausedWhen ?? timer.currentDuration;
  if (timer.status !== "RUNNING" || !timer.startTime) return duration;
  const elapsed = Math.max(
    0,
    Math.floor((now - new Date(timer.startTime).getTime()) / 1000),
  );
  return Math.max(0, duration - elapsed);
}
