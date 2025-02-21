import z from "zod";
import { router, publicProcedure, protectedProcedure, prisma } from "@acme/lib";
import { TRPCError } from "@trpc/server";
import { createTaskSchema, updateTaskSchema } from "@acme/schemas";
import { topicRouter } from "./topic.router";

export const taskRouter = router({
  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ input }) => {
      try {
        return await prisma.task.create({ data: input });
      } catch (err) {
        console.error("Failed creating task:", err.message);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unexpected error",
        });
      }
    }),

  updateTitle: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ input }) => {
      try {
        const existingTask = await prisma.task.findUnique({
          where: { id: input.id },
          select: { id: true },
        });
        if (!existingTask)
          throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });

        return await prisma.task.update({
          where: { id: input.id },
          data: { title: input.title },
        });
      } catch (err) {
        console.error(err.message);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unexpected error",
        });
      }
    }),

  deleteTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const task = await prisma.task.findUnique({ where: input });

        if (!task)
          throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });

        return await prisma.task.delete({ where: input });
      } catch (err) {
        console.error(err.message);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not delete task",
        });
      }
    }),

  getByUser: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.user?.userId;
      console.log("ctx.user:", ctx.user);

      if (!userId)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "I'm really lost",
        });

      const tasks = await prisma.task.findMany({ where: { userId } });

      if (tasks.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No tasks found for this user",
        });

      return tasks;
    } catch (err) {
      console.error(err.message);

      if (err instanceof TRPCError) throw err;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not retrieve tasks",
      });
    }
  }),

  topics: topicRouter,
});
