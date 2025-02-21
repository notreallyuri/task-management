import { z } from "zod";
import { router, publicProcedure, protectedProcedure, prisma } from "@acme/lib";
import { TRPCError } from "@trpc/server";
import { userSchema, loginSchema, createUserSchema } from "@acme/schemas";
import { taskRouter } from "./task.router";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

export const userRouter = router({
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { password, ...data } = input;

      try {
        const inUse = await prisma.user.findUnique({
          where: { email: input.email },
        });

        if (inUse)
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already in use.",
          });

        const hash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
          data: { hashPassword: hash, ...data },
          select: { id: true, email: true, username: true },
        });

        const token = await ctx.res.jwtSign({
          userId: user.id,
          email: user.email,
        });

        ctx.res.setCookie("Auth_key", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60,
          path: "/",
        });

        return user;
      } catch (err) {
        console.error("User registration error:", {
          error: err,
          email: input.email,
          timestamp: new Date().toISOString(),
        });

        if (err instanceof Error) throw err;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unexpeted error",
        });
      }
    }),

  login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });

      const isValid = await bcrypt.compare(input.password, user.hashPassword);
      if (!isValid)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });

      const token = await ctx.res.jwtSign({
        userId: user.id,
        email: user.email,
      });

      ctx.res.setCookie("Auth_key", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60,
      });

      return { userId: user.id };
    } catch (err) {
      console.error("Login error:", {
        error: err,
        email: input.email,
        timestamp: new Date().toISOString(),
      });

      if (err instanceof Error) throw err;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unexpected error during login",
      });
    }
  }),

  deleteUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        ctx.res.clearCookie("Auth_key");
        return await prisma.user.delete({
          where: { id: input.id },
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2025")
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "User not found",
            });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not delete user",
        });
      }
    }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie("Auth_key");

    return { success: true };
  }),

  getAll: publicProcedure.query(async () => {
    try {
      return prisma.user.findMany();
    } catch (err) {
      console.error("Fetch error:", {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      if (err instanceof Error) throw err;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not fetch users",
      });
    }
  }),

  tasks: taskRouter,
});
