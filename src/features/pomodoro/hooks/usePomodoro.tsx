import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import {
  type ActiveTimer,
  type TimerSettings,
  type Mode,
  TimerStatus,
} from "@/generated/prisma/browser";
import { durationForMode, remainingTime } from "@/features/pomodoro/lib/timer";

function timeLeftFor(timer: ActiveTimer, settings: TimerSettings) {
  return timer.status === TimerStatus.IDLE
    ? durationForMode(timer.mode, settings)
    : remainingTime(timer);
}

export function usePomodoro(
  initialTimer: ActiveTimer,
  settings: TimerSettings,
  onComplete: () => void,
) {
  const [timerState, setTimerState] = useState(initialTimer);
  const [timeLeft, setTimeLeft] = useState(() =>
    timeLeftFor(initialTimer, settings),
  );
  const completed = useRef(false);
  const complete = useEffectEvent(() => onComplete());

  useEffect(() => {
    if (timerState.status !== TimerStatus.RUNNING) return;
    completed.current = false;
    const interval = setInterval(() => {
      const remaining = timeLeftFor(timerState, settings);
      setTimeLeft(remaining);
      if (remaining === 0 && !completed.current) {
        completed.current = true;
        clearInterval(interval);
        complete();
      }
    }, 250);
    return () => clearInterval(interval);
  }, [timerState, settings]);

  const syncFromServer = useCallback(
    (timer: ActiveTimer) => {
      setTimerState(timer);
      setTimeLeft(timeLeftFor(timer, settings));
    },
    [settings],
  );

  const start = () =>
    setTimerState((previous) => ({
      ...previous,
      status: TimerStatus.RUNNING,
      startTime: new Date(),
      pausedWhen: timeLeft,
    }));
  const pause = () =>
    setTimerState((previous) => ({
      ...previous,
      status: TimerStatus.PAUSED,
      startTime: null,
      pausedWhen: timeLeft,
    }));
  const switchLocalMode = (mode: Mode) => {
    const timer = {
      ...timerState,
      mode,
      status: TimerStatus.IDLE,
      startTime: null,
      pausedWhen: null,
    };
    syncFromServer(timer);
  };
  const reset = () => switchLocalMode(timerState.mode);
  const completeAndSwitch = (mode: Mode) => {
    syncFromServer({
      ...timerState,
      mode,
      status: TimerStatus.IDLE,
      startTime: null,
      pausedWhen: null,
      sessionsCount:
        timerState.sessionsCount + (timerState.mode === "POMODORO" ? 1 : 0),
    });
  };
  return {
    timeLeft,
    timerState,
    start,
    pause,
    reset,
    switchLocalMode,
    syncFromServer,
    completeAndSwitch,
  };
}
