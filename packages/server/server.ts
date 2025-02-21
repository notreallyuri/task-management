import { router } from "@acme/lib";
import { userRouter } from "@acme/router";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { fastifyCookie } from "@fastify/cookie";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { inferAsyncReturnType, TRPCError } from "@trpc/server";

const jwtSecret = process.env.JWT_SECRET;
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
if (!jwtSecret)
  throw new Error("JWT_SECRET environment variable is not defined");

interface User {
  userId: string;
  email: string;
}

const createContext = async ({
  req,
  res,
}: {
  req: FastifyRequest;
  res: FastifyReply;
}) => {
  try {
    const user = await req.jwtVerify<User>();

    return { req, res, user };
  } catch (err) {
    return { req, res, user: null };
  }
};

const app = Fastify({
  logger: true,
  ajv: { customOptions: { removeAdditional: "all", coerceTypes: true } },
});

const appRouter = router({
  user: userRouter,
});

app.register(jwt, { secret: jwtSecret });
app.register(fastifyCookie, {
  secret: jwtSecret,
  hook: "onRequest",
  parseOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});
app.register(cors, {
  origin: clientUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

app.decorate("auth", async function (req: FastifyRequest, res: FastifyReply) {
  try {
    const user = await req.jwtVerify<User>();
    if (!user?.userId)
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });
    return user;
  } catch (err) {
    res.status(401).send({
      error: "Unauthorized",
      message: "Please login to access this resource",
    });
  }
});

await app.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
  },
});

const start = async () => {
  try {
    const address = await app.listen({ port: 3333, host: "0.0.0.0" });

    app.log.info(`Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export type AppRouter = typeof appRouter;
export type Context = inferAsyncReturnType<typeof createContext>;
