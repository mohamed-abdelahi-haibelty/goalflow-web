import z, { boolean } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  columnId: z.string(),
  projectId: z.string(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      completed: z.boolean(),
      columnId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  projectId: z.string(),
});

export type UpdateTaskOrderInput = z.infer<typeof updateTaskOrderSchema>;

export const deleteTaskSchema = z.object({
  id: z.string(),
  projectId: z.string(),
});

export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;

export const renameTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  projectId: z.string(),
});

export type RenameTaskInput = z.infer<typeof renameTaskSchema>;

export const toggleTaskCompletedSchema = z.object({
  id: z.string(),
  completed: z.boolean(),
  projectId: z.string(),
});

export type ToggleTaskCompletedInput = z.infer<
  typeof toggleTaskCompletedSchema
>;
