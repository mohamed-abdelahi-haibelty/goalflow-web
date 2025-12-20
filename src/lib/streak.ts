import { TZDate } from "@date-fns/tz";
import { startOfDay, differenceInDays } from "date-fns";

export function getStreakDates() {
  // Get user's local timezone using the Intl API
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const now = new Date();
  // Create a timezone-aware date object for 'now'
  const localNow = new TZDate(now, timezone);

  // Get start of day in user's timezone
  const todayStart = startOfDay(localNow);

  return { now, todayStart, timezone };
}

export function canUpdateStreakToday({
  lastStreakDate,
}: {
  lastStreakDate: Date | null;
}) {
  // New users can always update their streak
  if (!lastStreakDate) return true;

  const { todayStart, timezone } = getStreakDates();
  const lastUpdate = new TZDate(lastStreakDate, timezone);
  const lastUpdateStart = startOfDay(lastUpdate);

  // Allow update if last update was on a different calendar day
  return differenceInDays(todayStart, lastUpdateStart) > 0;
}

export function isStreakBroken({
  lastStreakDate,
}: {
  lastStreakDate: Date | null;
}) {
  // New users haven't broken their streak
  if (!lastStreakDate) return false;

  const { todayStart, timezone } = getStreakDates();
  const lastUpdate = new TZDate(lastStreakDate, timezone);
  const lastUpdateStart = startOfDay(lastUpdate);

  // Streak is broken if more than one day has passed
  return differenceInDays(todayStart, lastUpdateStart) > 1;
}
