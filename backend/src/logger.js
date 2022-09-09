import { fastify } from "./server.js";

export function debug(msg) {
  fastify.log.debug(msg);
}

export function log(msg) {
  fastify.log.info(msg);
}
