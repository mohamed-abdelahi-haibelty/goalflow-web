import { z } from "zod";
import { Column, Task } from "@/generated/prisma/client";

export type ColumnWithTasks = Column & {
  tasks: Task[];
};

export type TaskWithColumn = Task & {
  column: Column;
};

export const createColumnSchema = z.object({
  name: z.string().min(3, "Title must be at least 3 characters"),
  projectId: z.string(),
});

export type CreateColumnInput = z.infer<typeof createColumnSchema>;

export const updateColumnSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Title must be at least 3 characters"),
  projectId: z.string(),
});

export type UpdateColumnInput = z.infer<typeof updateColumnSchema>;
