import z from "zod";
import { router, procedure, prisma } from "@acme/lib";
import { TRPCError } from "@trpc/server";
import { createTaskSchema, updateTaskSchema } from "@acme/schemas";

export const taskRouter = router({
  create: procedure.input(createTaskSchema).mutation(async ({ input }) => {
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

  update: procedure.input(updateTaskSchema).mutation(async ({ input }) => {
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

  delete: procedure
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

  getByUser: procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const tasks = await prisma.task.findMany({ where: input });

        if (tasks.length === 0)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No tasks found for this user",
          });

        return tasks;
      } catch (err) {
        console.error(err.message);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not retrieve tasks",
        });
      }
    }),
});
