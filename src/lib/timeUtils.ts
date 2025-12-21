/**
 * Formats seconds into a human-readable time string
 * @param seconds - Total seconds to format
 * @returns Formatted time string (e.g., "3h 30min", "45min", "30sec", "No time")
 */
export function formatTimeSpent(seconds: number): string {
  if (seconds === 0) {
    return "No time";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}min`);
  }

  // Only show seconds if no hours and less than 1 minute
  if (hours === 0 && minutes === 0 && secs > 0) {
    parts.push(`${secs}sec`);
  }

  return parts.join(" ") || "No time";
}

/**
 * Formats seconds with translations support
 * @param seconds - Total seconds to format
 * @param translations - Translation object with keys: hours, minutes, seconds, noTime
 * @returns Formatted time string with translations
 */
export function formatTimeSpentWithTranslations(
  seconds: number,
  translations: {
    hours: string;
    minutes: string;
    seconds: string;
    noTime: string;
  }
): string {
  if (seconds === 0) {
    return translations.noTime;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} ${translations.hours}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} ${translations.minutes}`);
  }

  // Only show seconds if no hours and less than 1 minute
  if (hours === 0 && minutes === 0 && secs > 0) {
    parts.push(`${secs} ${translations.seconds}`);
  }

  return parts.join(" ") || translations.noTime;
}
