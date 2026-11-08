"use server";

import { Mode } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { requireOwnedTask } from "@/server/access";
import { getGlobalSettings } from "@/features/pomodoro/actions/settings";
import { updateStreak } from "@/features/streak/actions/updateStreak";
import {
  durationForMode,
  nextTimerMode,
  remainingTime,
} from "@/features/pomodoro/lib/timer";

/** Resolve ownership before reading or creating any timer state. */
async function loadTimer(taskId: string, projectId?: string) {
  const { task, userId } = await requireOwnedTask(taskId, projectId);
  const result = await getGlobalSettings();
  if (!result.success || !result.data)
    throw new Error("Timer settings unavailable");
  const settings = result.data;
  let timer = await db.activeTimer.upsert({
    where: { taskId },
    create: { taskId, currentDuration: settings.workDuration },
    update: {},
  });
  if (timer.status === "IDLE") {
    timer = await db.activeTimer.update({
      where: { id: timer.id },
      data: { currentDuration: durationForMode(timer.mode, settings) },
    });
  }
  return { timer, settings, userId, projectId: task.column.projectId };
}

export async function getTaskTimer(taskId: string) {
  const { timer, settings } = await loadTimer(taskId);
  return { timer, settings };
}

export async function startTaskTimer(taskId: string, projectId: string) {
  try {
    const { timer, settings } = await loadTimer(taskId, projectId);
    if (timer.status === "RUNNING")
      return { success: true, message: "Timer already running" };
    const duration =
      timer.status === "PAUSED"
        ? (timer.pausedWhen ?? timer.currentDuration)
        : durationForMode(timer.mode, settings);
    await db.activeTimer.update({
      where: { id: timer.id, status: timer.status, updatedAt: timer.updatedAt },
      data: { status: "RUNNING", startTime: new Date(), pausedWhen: duration },
    });
    return { success: true, message: "Timer started" };
  } catch {
    return { success: false, message: "Could not start timer" };
  }
}

export async function completeTaskSession(taskId: string, projectId: string) {
  try {
    const {
      timer,
      settings,
      userId,
      projectId: ownedProjectId,
    } = await loadTimer(taskId, projectId);
    if (timer.status !== "RUNNING" || remainingTime(timer) > 0) {
      return { success: false, message: "The session has not finished" };
    }
    const sessionsCount =
      timer.sessionsCount + (timer.mode === Mode.POMODORO ? 1 : 0);
    const mode = nextTimerMode(
      timer.mode,
      sessionsCount,
      settings.roundsBeforeLongBreak,
    );
    await db.$transaction(async (tx) => {
      // Compare-and-set ensures concurrent completions cannot log a session twice.
      const claimed = await tx.activeTimer.updateMany({
        where: { id: timer.id, status: "RUNNING", updatedAt: timer.updatedAt },
        data: {
          mode,
          sessionsCount,
          status: "IDLE",
          startTime: null,
          pausedWhen: null,
          currentDuration: durationForMode(mode, settings),
        },
      });
      if (claimed.count !== 1)
        throw new Error("Timer changed; refresh and try again");
      if (timer.mode === Mode.POMODORO) {
        await tx.pomodoroSession.create({
          data: {
            taskId,
            userId,
            projectId: ownedProjectId,
            duration: timer.currentDuration,
          },
        });
      }
    });
    if (timer.mode === Mode.POMODORO) await updateStreak(userId);
    revalidatePath(`/project/${ownedProjectId}`);
    revalidatePath(`/project/${ownedProjectId}/task/${taskId}`);
    revalidatePath("/report");
    return { success: true, message: "Session completed" };
  } catch {
    return {
      success: false,
      message: "Could not complete session; refresh and try again",
    };
  }
}

export async function resetTimer(taskId: string, projectId: string) {
  try {
    const { timer } = await loadTimer(taskId, projectId);
    await db.activeTimer.update({
      where: { id: timer.id, updatedAt: timer.updatedAt },
      data: { status: "IDLE", startTime: null, pausedWhen: null },
    });
    return { success: true, message: "Timer reset" };
  } catch {
    return { success: false, message: "Could not reset timer" };
  }
}

export async function pauseTimer(
  _remainingSeconds: number,
  taskId: string,
  projectId: string,
) {
  try {
    const { timer } = await loadTimer(taskId, projectId);
    if (timer.status !== "RUNNING")
      return { success: false, message: "Timer is not running" };
    await db.activeTimer.update({
      where: { id: timer.id, status: "RUNNING", updatedAt: timer.updatedAt },
      data: {
        status: "PAUSED",
        startTime: null,
        pausedWhen: remainingTime(timer),
      },
    });
    return { success: true, message: "Timer paused" };
  } catch {
    return { success: false, message: "Could not pause timer" };
  }
}

export async function switchMode(
  newMode: Mode,
  taskId: string,
  projectId: string,
) {
  if (!Object.values(Mode).includes(newMode))
    return { success: false, message: "Invalid timer mode" };
  try {
    const { timer, settings } = await loadTimer(taskId, projectId);
    await db.activeTimer.update({
      where: { id: timer.id, updatedAt: timer.updatedAt },
      data: {
        mode: newMode,
        status: "IDLE",
        startTime: null,
        pausedWhen: null,
        currentDuration: durationForMode(newMode, settings),
      },
    });
    return { success: true, message: "Mode switched" };
  } catch {
    return { success: false, message: "Could not switch mode" };
  }
}
