import { fastify } from "./server.js";

export function debug(msg) {
  fastify.log.debug(msg);
}

export function log(msg) {
  fastify.log.info(msg);
}

export function error(msg) {
  fastify.log.error(msg);
}

export function warn(msg) {
  fastify.log.warn(msg);
}
