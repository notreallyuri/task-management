import { prisma, publicProcedure, protectedProcedure, router } from "@acme/lib";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createTopicSchema, updateTopicSchema } from "@acme/schemas";
import { z } from "zod";

export const topicRouter = router({
  createTopic: protectedProcedure
    .input(createTopicSchema)
    .mutation(async ({ input }) => {
      try {
        return await prisma.topic.create({ data: input });
      } catch (err) {
        console.error("Failed creating topic:", err.message);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed creating new topic.",
        });
      }
    }),

  updateTopic: protectedProcedure
    .input(updateTopicSchema)
    .mutation(async ({ input }) => {
      try {
        return await prisma.topic.update({
          where: { id: input.id },
          data: input,
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2025")
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Topic not found",
            });

          if (err.code === "P2002")
            throw new TRPCError({
              code: "CONFLICT",
              message: "A topic with this name already exists",
            });
        }

        console.error("Topic update error:", {
          err,
          input,
          timestamp: new Date().toISOString(),
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while updating the topic",
          cause: err,
        });
      }
    }),

  getByTask: protectedProcedure
    .input(z.object({ TaskId: z.string() }))
    .query(async ({ input }) => {
      const topics = await prisma.topic.findMany({
        where: { taskId: input.TaskId },
      });
    }),
});
