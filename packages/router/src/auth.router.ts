import { router, publicProcedure } from "@acme/lib";

export const authRouter = router({
  verify: publicProcedure.query(async ({ ctx }) => {
    try {
      const token = ctx.req.cookies["Auth_key"];
      if (!token) return { isAuthenticated: false, userId: "" };

      const decoded = await ctx.req.jwtVerify<{ userId: string }>();

      return { isAuthenticated: true, userId: decoded.userId };
    } catch (err) {
      console.error();

      return { isAuthenticated: false, userId: "" };
    }
  }),
});
