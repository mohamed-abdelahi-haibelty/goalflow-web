"use server";
import db from "@/lib/db";
import { getGlobalSettings } from "./settings";
import { revalidatePath } from "next/cache";
import { getUserSession } from "@/actions/auth/getUserSession";
import { Mode } from "@/generated/prisma/enums";
import { ActionsResponse } from "@/types";
import { updateStreak } from "../../streak/action/updateStreak";

export async function getTaskTimer(taskId: string) {
  const { data: globalSettings, success } = await getGlobalSettings();

  if (!success) {
    throw new Error("Unauthorized");
  }

  if (!taskId) {
    throw new Error("taskId is required");
  }

  // 1. Get or Create the timer
  let timer = await db.activeTimer.findUnique({ where: { taskId } });

  if (!timer) {
    timer = await db.activeTimer.create({
      data: {
        taskId,
        currentDuration: globalSettings?.workDuration, // Init with global default
      },
    });
  }

  // 2. SYNC LOGIC: If the timer is IDLE, update it to match Global Settings
  // This ensures that if you changed settings 5 mins ago, this task sees them now.
  if (timer.status === "IDLE") {
    let targetDuration = globalSettings?.workDuration;
    if (timer.mode === "SHORT_BREAK")
      targetDuration = globalSettings?.shortBreakDur;
    if (timer.mode === "LONG_BREAK")
      targetDuration = globalSettings?.longBreakDur;

    // Update the timer with the latest global duration
    timer = await db.activeTimer.update({
      where: { id: timer.id },
      data: { currentDuration: targetDuration },
    });
  }

  // Return both the timer and the settings so the UI can populate the form
  return { timer, settings: globalSettings };
}

export async function startTaskTimer(
  taskId: string,
  projectId: string
): Promise<ActionsResponse> {
  try {
    const { timer, settings } = await getTaskTimer(taskId);

    let duration = timer?.currentDuration;
    if (timer.mode === "SHORT_BREAK") duration = settings?.shortBreakDur ?? 300; // 5m
    if (timer.mode === "LONG_BREAK") duration = settings?.longBreakDur ?? 900; // 15m

    // If resuming from pause
    if (timer.status === "PAUSED" && timer.pausedWhen) {
      duration = timer.pausedWhen;
    }

    await db.activeTimer.update({
      where: { taskId },
      data: {
        status: "RUNNING",
        startTime: new Date(),
        pausedWhen: duration,
      },
    });

    return { success: true, message: "Timer started" };
  } catch (error) {
    console.error("Failed to start timer:", error);
    return {
      success: false,
      message: "Failed to start timer. Please try again.",
      code: 500,
    };
  }
}

// 3. COMPLETE & LOG (The Reporting Logic)
export async function completeTaskSession(taskId: string, projectId: string) {
  try {
    const session = await getUserSession();

    if (!session) {
      return { message: "Unauthorized", success: false, code: 401, data: null };
    }
    const { timer } = await getTaskTimer(taskId);

    // TRANSACTION: We must do two things atomically:
    // 1. Log the completed work in history
    // 2. Reset the active timer to the next stage

    await db.$transaction(async (tx) => {
      // A. If we just finished a Work session, Log it!
      if (timer.mode === Mode.POMODORO) {
        await tx.pomodoroSession.create({
          data: {
            taskId: taskId,
            userId: session.user.id,
            projectId: projectId,
            duration: timer.currentDuration, // Log the full duration (e.g. 25 mins)
          },
        });
      }

      // B. Calculate Next Mode
      const newCount =
        timer.mode === "POMODORO"
          ? timer.sessionsCount + 1
          : timer.sessionsCount;
      let nextMode: Mode = Mode.POMODORO;

      if (timer.mode === "POMODORO") {
        // Logic: 4 sessions -> Long Break, otherwise Short Break
        nextMode = newCount % 4 === 0 ? Mode.LONG_BREAK : Mode.SHORT_BREAK;
      }

      // C. Update the Active Timer
      await tx.activeTimer.update({
        where: { taskId },
        data: {
          mode: nextMode,
          status: "IDLE",
          startTime: null,
          pausedWhen: null,
          sessionsCount: newCount,
        },
      });
    });

    if (timer.mode === Mode.POMODORO) {
      console.log("Triggering Streak Update for user:", session.user.id);

      const streakResult = await updateStreak(session.user.id);

      if (!streakResult.success) {
        console.error("Streak Update Failed:", streakResult.message);
      } else {
        console.log("Streak Updated Successfully:", streakResult.data);
      }
    } else {
      console.log("Streak Update Skipped: Session was not POMODORO mode.");
    }

    revalidatePath(`/project/${projectId}/tasks/${taskId}`);
    revalidatePath(`/project/${projectId}`);

    return { success: true, message: "Session completed" };
  } catch (error) {
    return { success: false, message: "Failed to mark session as completed" };
  }
}

export async function resetTimer(taskId: string, projectId: string) {
  try {
    const { timer } = await getTaskTimer(taskId);

    await db.activeTimer.update({
      where: { id: timer.id },
      data: {
        status: "IDLE",
        startTime: null,
        pausedWhen: null,
        // We don't reset sessionsCount here, only the current ticking timer
      },
    });

    return { success: true, message: "Timer reseted" };
  } catch (error) {
    return { success: false, message: "Could not reset timer" };
  }
}

export async function pauseTimer(
  remainingSeconds: number,
  taskId: string,
  projectId: string
) {
  try {
    const { timer } = await getTaskTimer(taskId);
    await db.activeTimer.update({
      where: { id: timer.id },
      data: {
        status: "PAUSED",
        startTime: null,
        pausedWhen: remainingSeconds, // Save exactly how much time was left
      },
    });

    return { success: true, message: "Timer paused" };
  } catch (error) {
    return { success: false, message: "Could not pause timer" };
  }
}

export async function switchMode(
  newMode: Mode,
  taskId: string,
  projectId: string
) {
  try {
    const { timer } = await getTaskTimer(taskId);
    await db.activeTimer.update({
      where: { id: timer.id },
      data: {
        mode: newMode,
        status: "IDLE",
        startTime: null,
        pausedWhen: null,
      },
    });

    return { success: true, message: "Mode switched" };
  } catch (error) {
    return { success: false, message: "Could not switch moode" };
  }
}
