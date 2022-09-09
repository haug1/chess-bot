// Require the framework and instantiate it
import createFastify from "fastify";
import { getBestMoveBasedOnFEN } from "./stockfish.js";

export const fastify = createFastify({
  logger: {
    level: process.env.LOG_LEVEL,
    transport:
      process.env.ENV === "development"
        ? {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          }
        : undefined,
  },
});

fastify.post("/", async (request, reply) =>
  reply.send(await getBestMoveBasedOnFEN(request.body))
);

export async function startServer() {
  if (fastify.server?.listening) return;
  try {
    return fastify.listen({ port: process.env.PORT || 8080 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
