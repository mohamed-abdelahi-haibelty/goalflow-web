import { z } from "zod";
import { Column, Task } from "@/generated/prisma/client";

export type ColumnWithTasks = Column & {
  tasks: TaskWithSessionCount[];
};

export type TaskWithSessionCount = Task & {
  sessionCount: number;
};

export type TaskWithColumn = TaskWithSessionCount & {
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

export const deleteColumnSchema = z.object({
  id: z.string(),
  projectId: z.string(),
});

export type DeleteColumnInput = z.infer<typeof deleteColumnSchema>;

export const updateColumnOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      order: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  projectId: z.string(),
});

export type UpdateColumnOrderInput = z.infer<typeof updateColumnOrderSchema>;
