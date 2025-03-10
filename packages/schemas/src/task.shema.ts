import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
});

export const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().optional(),
  description: z.string().optional(),
});

export const createTopicSchema = z.object({
  id: z.number(),
  subTitle: z.string().min(1, "Subtitle is required"),
  content: z.string().min(1, "Content is required"),
  taskId: z.string().uuid(),
});

export const updateTopicSchema = z.object({
  id: z.number(),
  subTitle: z.string().optional(),
  content: z.string().optional(),
});

export type CreateTaskType = z.infer<typeof createTaskSchema>;
export type UpdateTaskType = z.infer<typeof updateTaskSchema>;

export type CreateTopicSchema = z.infer<typeof createTopicSchema>;
