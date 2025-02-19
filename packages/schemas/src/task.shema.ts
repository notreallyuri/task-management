import { z } from "zod";

export const createTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Task title is required"),
  userId: z.string().uuid(),
});

export const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
});

export const topicSchema = z.object({
  id: z.number(),
  subTitle: z.string().min(1, "Subtitle is required"),
  content: z.string().min(1, "Content is required"),
  taskId: z.string().uuid(),
});

export type CreateTaskType = z.infer<typeof createTaskSchema>;
export type TopicType = z.infer<typeof topicSchema>;
export type UpdateTaskType = z.infer<typeof topicSchema>;
