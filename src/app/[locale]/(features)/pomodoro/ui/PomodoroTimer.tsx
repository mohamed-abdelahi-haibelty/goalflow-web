"use client";

import TimerCircle, { getModeDuration } from "./TimerCircle";
import TimerModeSwitcher from "./TimerModeSwitcher";
import { useEffect, useRef, useState } from "react";
import {
  completeTaskSession,
  pauseTimer,
  resetTimer,
  startTaskTimer,
  switchMode,
} from "../action/timer";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft, RotateCcw, Settings } from "lucide-react";
import {
  ActiveTimer,
  Mode,
  Task,
  TimerSettings,
  TimerStatus,
} from "@/generated/prisma/browser";
import { formatTime } from "@/lib/utils";

type Props = {
  initialTimer: ActiveTimer;
  initialSettings: TimerSettings;
  task: Task;
  projectId: string;
};

function PomodoroTimer({
  initialTimer,
  task,
  projectId,
  initialSettings,
}: Props) {
  const [data, setData] = useState(initialTimer);
  const [globalSettings, setGlobalSettings] = useState(initialSettings);

  // Calculate initial time left based on timer status
  const getInitialTimeLeft = () => {
    if (initialTimer.status === TimerStatus.IDLE) {
      return getModeDuration({
        timer: initialTimer,
        settings: initialSettings,
      });
    }
    if (initialTimer.status === TimerStatus.PAUSED) {
      return initialTimer.pausedWhen || 0;
    }
    if (
      initialTimer.status === TimerStatus.RUNNING &&
      initialTimer.startTime &&
      initialTimer.pausedWhen
    ) {
      const now = new Date().getTime();
      const start = new Date(initialTimer.startTime).getTime();
      const elapsed = Math.floor((now - start) / 1000);
      return Math.max(0, initialTimer.pausedWhen - elapsed);
    }
    return getModeDuration({ timer: initialTimer, settings: initialSettings });
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTimeLeft);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const router = useRouter();

  const processingCompletion = useRef(false);

  useEffect(() => {
    setData(initialTimer);
  }, [initialTimer]);

  // Disable transition on initial mount
  useEffect(() => {
    setIsInitialMount(false);
  }, []);

  useEffect(() => {
    setGlobalSettings(initialSettings);
  }, [initialSettings]);

  // 1. Ticking Logic
  useEffect(() => {
    const tick = () => {
      if (data.status === TimerStatus.IDLE) {
        const full = getModeDuration({ timer: data, settings: globalSettings });
        setTimeLeft((prev) => (prev === full ? prev : full));
        return;
      }

      if (data.status === TimerStatus.PAUSED) {
        const pausedTime = data.pausedWhen || 0;
        setTimeLeft((prev) => (prev === pausedTime ? prev : pausedTime));
        return;
      }

      if (
        data.status === TimerStatus.RUNNING &&
        data.startTime &&
        data.pausedWhen
      ) {
        const now = new Date().getTime();
        const start = new Date(data.startTime).getTime();
        const targetDuration = data.pausedWhen;

        const elapsedSeconds = Math.floor((now - start) / 1000);
        const remaining = targetDuration - elapsedSeconds;

        if (remaining <= 0) {
          setTimeLeft(0);
          handleCompletion();
        } else {
          setTimeLeft(remaining);
        }
      }
    };

    tick();
    // Optimization: Only start the interval if we are actually RUNNING
    // This prevents unnecessary processing when IDLE or PAUSED
    if (data.status === TimerStatus.RUNNING) {
      const interval = setInterval(tick, 200);
      return () => clearInterval(interval);
    }
  }, [data]);

  useEffect(() => {
    document.title = `${formatTime(timeLeft)} - ${data.mode}`;
  }, [timeLeft, data.mode]);

  const handleCompletion = async () => {
    if (processingCompletion.current) return;
    processingCompletion.current = true;
    // Todo : play sound
    // Pass taskId to the action
    await completeTaskSession(task.id, projectId);
    router.refresh();
  };

  const handleStart = async () => {
    // Calculate the duration that should be used
    const targetDuration =
      data.status === TimerStatus.PAUSED && data.pausedWhen
        ? data.pausedWhen
        : getModeDuration({ timer: data, settings: globalSettings });
    const now = new Date();
    //OPTIMISTIC UPDATE: Update local state immediately
    setData((prev) => ({
      ...prev,
      status: "RUNNING",
      startTime: now,
      pausedWhen: targetDuration,
    }));
    startTaskTimer(task.id, projectId);
  };

  const handlePause = async () => {
    //OPTIMISTIC UPDATE: Update local state immediately
    setData((prev) => ({ ...prev, status: "PAUSED", pausedWhen: timeLeft }));
    pauseTimer(timeLeft, task.id, projectId);
  };

  const handleReset = async () => {
    setData((prev) => ({
      ...prev,
      status: "IDLE",
      pausedWhen: null,
      startTime: null,
    }));
    resetTimer(task.id, projectId);
  };

  async function handleSwitchMode(m: Mode) {
    setTimeLeft(0);
    setData((prev) => ({
      ...prev,
      status: "IDLE",
      mode: m,
      pausedWhen: null,
      startTime: null,
    }));
    switchMode(m, task.id, projectId);
  }

  return (
    <div className="flex flex-col items-center justify-center  text-foreground">
      <div className="w-full max-w-md mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          <span>Back to project board</span>
        </Button>
        <h2 className="text-xl font-semibold mt-2 text-center">
          {task?.title}
        </h2>
      </div>

      <TimerModeSwitcher mode={data.mode} switchMode={handleSwitchMode} />
      <TimerCircle
        timeLeft={timeLeft}
        timer={data}
        settings={globalSettings}
        startTimer={handleStart}
        pauseTimer={handlePause}
        disableTransition={isInitialMount}
      />

      <div className="flex gap-4 mt-4">
        {/* Reset Button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleReset} // Calls the reset handler
        >
          <RotateCcw className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </Button>

        {/* Settings Button */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </Button>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Completed sessions: {data.sessionsCount}
      </div>
    </div>
  );
}

export default PomodoroTimer;
