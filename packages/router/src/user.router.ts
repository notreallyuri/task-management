import { z } from "zod";
import { router, procedure, prisma } from "@acme/lib";
import { TRPCError } from "@trpc/server";
import { userSchema, loginSchema } from "@acme/schemas";
import bcrypt from "bcrypt";

export const userRouter = router({
  create: procedure.input(userSchema).mutation(async ({ input }) => {
    const { password, ...data } = input;

    try {
      const hash = await bcrypt.hash(password, 10);

      const inUse = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (inUse)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already in use.",
        });

      return await prisma.user.create({
        data: { hashPassword: hash, ...data },
      });
    } catch (err) {
      console.error("A problem has occured", err);

      if (err instanceof Error) throw err;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unexpeted error",
      });
    }
  }),

  login: procedure.input(loginSchema).mutation(async ({ input }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user)
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Wrong email." });

      const isValid = await bcrypt.compare(input.password, user.hashPassword);
      if (!isValid)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Wrong password",
        });

      return { userId: user.id, email: user.email };
    } catch (err) {
      console.error("A problem has ocured", err);

      if (err instanceof Error) throw err;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unexpected Error",
      });
    }
  }),

  delete: procedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      try {
        return await prisma.user.delete({ where: { email: input.email } });
      } catch (err) {
        console.error(err.message);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not delete user",
        });
      }
    }),
});
