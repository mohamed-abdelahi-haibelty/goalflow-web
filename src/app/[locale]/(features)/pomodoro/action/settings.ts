"use server";

import { getUserSession } from "@/actions/auth/getUserSession";
import { TimerSettings } from "@/generated/prisma/client";
import db from "@/lib/db";
import { ActionsResponse } from "@/types";
import { revalidatePath } from "next/cache";

// Helper: Get the single global settings row, or create if missing
export async function getGlobalSettings(): Promise<
  ActionsResponse<TimerSettings>
> {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  let settings = await db.timerSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    settings = await db.timerSettings.create({
      data: {
        userId: session.user.id,
      },
    });

    return {
      success: true,
      message: "Settings created",
      data: settings,
      code: 201,
    };
  }

  return {
    success: true,
    message: "Ok",
    data: settings,
    code: 200,
  };
}

export async function updateGlobalSettings(newSettings: {
  work: number;
  short: number;
  long: number;
  rounds: number;
  volume: number;
}) {
  const { data: settings, success } = await getGlobalSettings();

  if (!success) {
    throw new Error("Unauthorized");
  }

  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  try {
    const updatedSettings = await db.timerSettings.update({
      where: { id: settings?.id, userId: session.user.id },
      data: {
        workDuration: newSettings.work,
        shortBreakDur: newSettings.short,
        longBreakDur: newSettings.long,
        roundsBeforeLongBreak: newSettings.rounds,
        soundVolume: newSettings.volume,
      },
    });

    revalidatePath("/");

    return {
      success: true,
      message: "Settings updated successfully",
      data: updatedSettings,
      code: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update settings",
      data: null,
      code: 500,
    };
  }
}
