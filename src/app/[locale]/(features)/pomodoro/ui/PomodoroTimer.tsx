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
} from "@/generated/prisma/browser";
import { formatTime } from "@/lib/utils";
import PomodoroSettingsModal from "./PomodoroSettingsModal";
import useSound from "use-sound";
import { toast } from "sonner";
import { usePomodoro } from "../hooks/usePomodoro";
import { ActionsResponse } from "@/types";

type Props = {
  initialTimer: ActiveTimer;
  initialSettings: TimerSettings;
  task: Task;
  projectId: string;
};

// Helper to handle the "Optimistic UI with Rollback" pattern
async function executeOptimisticAction(
  actionFn: () => Promise<ActionsResponse>,
  rollbackFn: () => void,
  errorMessage: string = "Operation failed"
) {
  const result = await actionFn();
  if (!result.success) {
    // If server failed, undo the local change immediately
    rollbackFn();
    toast.error(errorMessage, { description: result.message });
  }
}

function PomodoroTimer({
  initialTimer,
  task,
  projectId,
  initialSettings,
}: Props) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const router = useRouter();

  // Sound Setup
  const volume = initialSettings.soundVolume / 100;
  const [playButtonSound] = useSound("/sound/button-sound.mp3", { volume });
  const [playNotification] = useSound("/sound/alarm-sound.mp3", { volume });

  // --- Logic Extracted to Hook ---
  const {
    timeLeft,
    timerState,
    start,
    pause,
    reset,
    switchLocalMode,
    syncFromServer,
    completeAndSwitch,
  } = usePomodoro(initialTimer, initialSettings, handleTimerComplete);

  // --- Effects ---

  // Update document title
  useEffect(() => {
    document.title = `${formatTime(timeLeft)} - ${timerState.mode}`;
  }, [timeLeft, timerState.mode]);

  // Sync from server ONLY if status changed externally (e.g. another tab)
  // This prevents the "Prop Mirroring" loop bug.
  useEffect(() => {
    // Only sync if the server status is fundamentally different or we just loaded
    if (initialTimer.updatedAt !== timerState.updatedAt) {
      syncFromServer(initialTimer);
    }
  }, [initialTimer]);

  useEffect(() => {
    setIsInitialMount(false);
  }, []);

  // --- Handlers ---

  async function handleTimerComplete() {
    playNotification();
    toast.success("Session Completed!", {
      description: `You've completed a ${timerState.mode
        .toLowerCase()
        .replace("_", " ")} session.`,
    });

    // We replicate the server logic here to switch modes instantly
    const currentMode = timerState.mode;
    const currentCount = timerState.sessionsCount;

    // Calculate what the new count WILL be
    const nextCount =
      currentMode === Mode.POMODORO ? currentCount + 1 : currentCount;

    let nextMode: Mode = Mode.POMODORO;

    if (currentMode === Mode.POMODORO) {
      // Use settings for rounds (defaulting to 4 if setting missing)
      const rounds = initialSettings.roundsBeforeLongBreak || 4;
      nextMode = nextCount % rounds === 0 ? Mode.LONG_BREAK : Mode.SHORT_BREAK;
    }
    // If we were in a break, we go back to Pomodoro (default)

    // Fire and forget server action (Optimistic UI is already handled by hook resetting to IDLE)
    const previousState = { ...timerState };

    // EXECUTE INSTANT UI UPDATE
    completeAndSwitch(nextMode);

    await executeOptimisticAction(
      () => completeTaskSession(task.id, projectId),
      () => syncFromServer(previousState),
      "Failed to mark session as completed"
    );
    router.refresh();
  }

  const handleStart = async () => {
    playButtonSound();
    // 1. Snapshot previous state for rollback
    const previousState = { ...timerState };

    // 2. Optimistic Update (UI updates instantly)
    start();

    // 3. Perform Server Action with Rollback protection
    await executeOptimisticAction(
      () => startTaskTimer(task.id, projectId),
      () => syncFromServer(previousState), // Rollback function
      "Failed to start timer"
    );
  };

  const handlePause = async () => {
    playButtonSound();
    const previousState = { ...timerState };

    pause();

    await executeOptimisticAction(
      () => pauseTimer(timeLeft, task.id, projectId),
      () => syncFromServer(previousState),
      "Failed to pause timer"
    );
  };

  const handleReset = async () => {
    const previousState = { ...timerState };

    reset();

    await executeOptimisticAction(
      () => resetTimer(task.id, projectId),
      () => syncFromServer(previousState),
      "Failed to reset"
    );
  };

  const handleSwitchMode = async (m: Mode) => {
    const previousState = { ...timerState };

    switchLocalMode(m);

    await executeOptimisticAction(
      () => switchMode(m, task.id, projectId),
      () => syncFromServer(previousState),
      "Failed to switch mode"
    );
  };

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

      <TimerModeSwitcher mode={timerState.mode} switchMode={handleSwitchMode} />
      <TimerCircle
        timeLeft={timeLeft}
        timer={timerState}
        settings={initialSettings}
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
        <Button
          onClick={() => setIsSettingsOpen(true)}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </Button>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Completed sessions: {timerState.sessionsCount}
      </div>

      {/* Settings Modal */}
      <PomodoroSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentSettings={initialSettings}
      />
    </div>
  );
}

export default PomodoroTimer;
