import { router } from "@acme/lib";
import { userRouter } from "@acme/router";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import cors from "@fastify/cors";

import Fastify, { FastifyReply, FastifyRequest } from "fastify";

const app = Fastify({ logger: true });

app.register(cors, { origin: "http://localhost:3000", credentials: true });

const appRouter = router({
  user: userRouter,
});

const createContext = ({
  req,
  res,
}: {
  req: FastifyRequest;
  res: FastifyReply;
}) => {
  return { req, res };
};

app.register(fastifyTRPCPlugin, {
  prefix: "/trpc/",
  trpcOptions: { router: appRouter, createContext },
});

app.get("/", async (req: FastifyRequest, res: FastifyReply) => {
  res.send("xD");
});

const start = async () => {
  try {
    await app.listen({ port: 3333 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export type AppRouter = typeof appRouter;
export type Context = ReturnType<typeof createContext>;
