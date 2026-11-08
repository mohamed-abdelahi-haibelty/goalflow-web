import { z } from "zod";

export const timerSettingsSchema = z.object({
  work: z.number().int().min(60).max(14400),
  short: z.number().int().min(60).max(3600),
  long: z.number().int().min(60).max(7200),
  rounds: z.number().int().min(1).max(12),
  volume: z.number().min(0).max(100),
});
