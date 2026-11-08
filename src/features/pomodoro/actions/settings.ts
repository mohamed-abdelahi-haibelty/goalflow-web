"use server";

import { getUserSession } from "@/actions/auth/getUserSession";
import { TimerSettings } from "@/generated/prisma/client";
import db from "@/lib/db";
import { timerSettingsSchema } from "@/features/pomodoro/schemas/settings";
import { ActionsResponse } from "@/types/index";
import { revalidatePath } from "next/cache";

// Helper: Get the single global settings row, or create if missing
export async function getGlobalSettings(): Promise<
  ActionsResponse<TimerSettings>
> {
  const session = await getUserSession();

  if (!session) {
    return { message: "Unauthorized", success: false, code: 401, data: null };
  }

  const settings = await db.timerSettings.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id },
    update: {},
  });

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
  const parsed = timerSettingsSchema.safeParse(newSettings);
  if (!parsed.success)
    return {
      success: false,
      message: "Invalid timer settings",
      code: 400,
      data: null,
    };
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
  } catch {
    return {
      success: false,
      message: "Failed to update settings",
      data: null,
      code: 500,
    };
  }
}
