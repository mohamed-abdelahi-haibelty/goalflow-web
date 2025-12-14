import { useState, useEffect, useRef, useCallback } from "react";
import {
  ActiveTimer,
  TimerStatus,
  TimerSettings,
  Mode,
} from "@/generated/prisma/browser";
import { getModeDuration } from "../ui/TimerCircle";

export function usePomodoro(
  initialTimer: ActiveTimer,
  settings: TimerSettings,
  onComplete: () => void
) {
  // We only initialize state once. We do NOT mirror props in useEffect loops.
  const [timerState, setTimerState] = useState(initialTimer);
  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(initialTimer, settings)
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to calculate time based on timestamps (immune to browser throttling)
  function calculateTimeLeft(
    timer: ActiveTimer,
    currentSettings: TimerSettings
  ) {
    if (timer.status === TimerStatus.IDLE) {
      return getModeDuration({ timer, settings: currentSettings });
    }
    if (timer.status === TimerStatus.PAUSED) {
      return timer.pausedWhen || 0;
    }
    if (
      timer.status === TimerStatus.RUNNING &&
      timer.startTime &&
      timer.pausedWhen
    ) {
      const now = Date.now();
      const start = new Date(timer.startTime).getTime();
      const elapsed = Math.floor((now - start) / 1000);
      return Math.max(0, timer.pausedWhen - elapsed);
    }
    return 0;
  }

  // The Tick Logic
  const tick = useCallback(() => {
    const remaining = calculateTimeLeft(timerState, settings);
    setTimeLeft(remaining);

    if (remaining <= 0 && timerState.status === TimerStatus.RUNNING) {
      handleComplete();
    }
  }, [timerState, settings]);

  const handleComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onComplete();
  };

  // Sync effect: runs interval only when RUNNING
  useEffect(() => {
    if (timerState.status === TimerStatus.RUNNING) {
      timerRef.current = setInterval(tick, 1000);
      // Immediate tick to prevent 1s delay on UI
      tick();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerState.status, tick]);

  // Public Actions (Optimistic Updates)
  const start = () => {
    const now = new Date();
    const duration = timeLeft; // Current remaining time
    setTimerState((prev) => ({
      ...prev,
      status: TimerStatus.RUNNING,
      startTime: now,
      pausedWhen: duration,
    }));
  };

  const pause = () => {
    setTimerState((prev) => ({
      ...prev,
      status: TimerStatus.PAUSED,
      startTime: null,
      pausedWhen: timeLeft,
    }));
  };

  const reset = () => {
    setTimerState((prev) => ({
      ...prev,
      status: TimerStatus.IDLE,
      startTime: null,
      pausedWhen: null,
    }));
    // Reset visual time immediately
    setTimeLeft(
      getModeDuration({
        timer: { ...timerState, mode: timerState.mode },
        settings,
      })
    );
  };

  const switchLocalMode = (mode: Mode) => {
    const newTimer = {
      ...timerState,
      mode,
      status: TimerStatus.IDLE,
      startTime: null,
      pausedWhen: null,
    };
    setTimerState(newTimer);
    setTimeLeft(getModeDuration({ timer: newTimer, settings }));
  };

  const completeAndSwitch = (nextMode: Mode) => {
    // 1. Calculate new session count based on current state
    const isPomodoro = timerState.mode === Mode.POMODORO;
    const newCount = isPomodoro
      ? timerState.sessionsCount + 1
      : timerState.sessionsCount;

    // 2. Create the new optimistic state object
    const newTimerState: ActiveTimer = {
      ...timerState,
      mode: nextMode,
      status: TimerStatus.IDLE,
      sessionsCount: newCount,
      startTime: null,
      pausedWhen: null,
    };

    // 3. Update State & Visual Time Immediately
    setTimerState(newTimerState);
    setTimeLeft(getModeDuration({ timer: newTimerState, settings }));
  };

  return {
    timeLeft,
    timerState,
    start,
    pause,
    reset,
    switchLocalMode,
    // Expose setter if parent needs to force sync from server (rare)
    syncFromServer: (serverTimer: ActiveTimer) => {
      setTimerState(serverTimer);
      setTimeLeft(calculateTimeLeft(serverTimer, settings));
    },
    completeAndSwitch,
  };
}
