import z from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).min(3, "Title must be at least 3 characters"),
  columnId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().trim().min(1),
      title: z.string().trim().min(1),
      order: z.number().int().nonnegative(),
      completed: z.boolean(),
      columnId: z.string().trim().min(1),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
  projectId: z.string().trim().min(1),
});

export type UpdateTaskOrderInput = z.infer<typeof updateTaskOrderSchema>;

export const deleteTaskSchema = z.object({
  id: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
});

export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;

export const renameTaskSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1).min(3, "Title must be at least 3 characters"),
  projectId: z.string().trim().min(1),
});

export type RenameTaskInput = z.infer<typeof renameTaskSchema>;

export const toggleTaskCompletedSchema = z.object({
  id: z.string().trim().min(1),
  completed: z.boolean(),
  projectId: z.string().trim().min(1),
});

export type ToggleTaskCompletedInput = z.infer<
  typeof toggleTaskCompletedSchema
>;
