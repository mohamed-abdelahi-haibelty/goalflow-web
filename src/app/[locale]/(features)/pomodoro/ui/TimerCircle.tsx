"use client";

import {
  ActiveTimer,
  Mode,
  TimerSettings,
  TimerStatus,
} from "@/generated/prisma/browser";
import { formatTime } from "@/lib/utils";

type Props = {
  timer: ActiveTimer;
  settings: TimerSettings;
  timeLeft: number;
  startTimer: () => void;
  pauseTimer: () => void;
  disableTransition?: boolean;
};

export function getModeDuration({
  timer,
  settings,
}: {
  timer: ActiveTimer;
  settings: TimerSettings;
}) {
  let duration = settings.workDuration;
  if (timer.mode === Mode.SHORT_BREAK) {
    duration = settings.shortBreakDur;
  } else if (timer.mode === Mode.LONG_BREAK) {
    duration = settings.longBreakDur;
  }
  return duration;
}

function TimerCircle({
  timer,
  settings,
  timeLeft,
  startTimer,
  pauseTimer,
  disableTransition,
}: Props) {
  const radius = 130;
  const circumference = 2 * Math.PI * radius;

  const totalDuration = getModeDuration({ timer, settings });
  const progress = timeLeft / totalDuration;

  const strokeDashoffset = circumference * progress;

  const timerControlText =
    timer.status === TimerStatus.IDLE || timer.status === TimerStatus.PAUSED
      ? "START"
      : "PAUSE";

  function handleTimerControle() {
    if (
      timer.status === TimerStatus.IDLE ||
      timer.status === TimerStatus.PAUSED
    ) {
      startTimer();
    } else {
      pauseTimer();
    }
  }

  return (
    <div className="relative w-80 h-80 flex items-center justify-center mb-8 cursor-pointer">
      <div className="absolute w-full h-full rounded-full bg-white border border-dashed shadow-lg flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300">
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className=" text-background"
          />
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`text-primary ${
              disableTransition
                ? ""
                : "transition-all duration-1000 ease-linear"
            }`}
          />
        </svg>
        <div
          onClick={handleTimerControle}
          className="absolute text-muted-foreground flex flex-col items-center justify-center"
        >
          <div className="text-6xl font-bold tracking-wider mb-2">
            {formatTime(timeLeft)}
          </div>
          <div className="uppercase tracking-[0.5em] text-sm font-medium hover:opacity-80 transition-opacity">
            {timerControlText}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimerCircle;
