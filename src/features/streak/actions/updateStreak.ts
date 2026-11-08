import "server-only";

import { StreakStatus } from "@/generated/prisma/client";
import db from "@/lib/db";
import {
  canUpdateStreakToday,
  getStreakDates,
  isStreakBroken,
} from "@/lib/streak";

export async function updateStreak(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        lastStreakUpgradeDate: true,
        streakStatus: true,
        streakCount: true,
        longestStreak: true,
      },
    });

    if (!user) {
      return { success: false, message: "User not found", code: 404 };
    }

    const { lastStreakUpgradeDate, streakStatus, streakCount, longestStreak } =
      user;

    // 2. Guard Clauses
    const canUpdate = canUpdateStreakToday({
      lastStreakDate: lastStreakUpgradeDate,
    });
    if (streakStatus === StreakStatus.STARTED && !canUpdate) {
      return {
        success: true,
        message: "Streak already updated today",
        code: 200,
      };
    }

    // 3. Logic Calculation
    const isBroken = isStreakBroken({ lastStreakDate: lastStreakUpgradeDate });
    const { now } = getStreakDates();

    const newCount = isBroken ? 1 : streakCount + 1;
    const newLongest = Math.max(newCount, longestStreak);

    // 4. Update with Await
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        streakCount: newCount,
        lastStreakUpgradeDate: now,
        longestStreak: newLongest,
        streakStatus: StreakStatus.STARTED,
      },
    });

    return {
      success: true,
      message: "Streak updated successfully!",
      code: 200,
      data: updatedUser,
    };
  } catch (err) {
    console.error("Streak Update Error:", err); // Log for internal tracking
    return {
      success: false,
      message: "An internal error occurred",
      code: 500,
    };
  }
}
