import { router } from "@acme/lib";
import { userRouter, authRouter } from "@acme/router";
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

const app = Fastify({
  logger: true,
  ajv: { customOptions: { removeAdditional: "all", coerceTypes: true } },
});

app.register(fastifyCookie, {
  secret: jwtSecret,
  hook: "onRequest",
  parseOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
});

app.register(jwt, {
  secret: jwtSecret,
  cookie: { cookieName: "Auth_key", signed: false },
});

app.register(cors, {
  origin: clientUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.decorate("auth", async function (req: FastifyRequest, res: FastifyReply) {
  try {
    console.log("Headers:", req.headers);
    console.log("Cookies:", req.cookies);

    const user = await req.jwtVerify<User>();
    console.log("User:", user);
    if (!user?.userId)
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });
    req.user = user;
  } catch (err) {
    res.status(501).send({
      error: "teste",
      message: "Please login to access this resource",
    });
  }
});

const createContext = async ({
  req,
  res,
}: {
  req: FastifyRequest;
  res: FastifyReply;
}) => {
  try {
    const user = await req.jwtVerify<User>();
    console.log("Authenticated User:", user);

    return { req, res, user };
  } catch (err) {
    console.log("JWT verification failed:", err);
    return { req, res, user: null };
  }
};

const appRouter = router({
  user: userRouter,
  auth: authRouter,
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
