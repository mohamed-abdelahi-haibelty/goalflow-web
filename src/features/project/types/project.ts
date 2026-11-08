import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().max(120).min(3, "Name must be at least 3 characters"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
