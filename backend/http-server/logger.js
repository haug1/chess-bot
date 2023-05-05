import { fastify } from './config.js'

// attach global logger
console.debug = function debug(...params) {
  fastify.log.debug(...params)
}

console.log = function log(...params) {
  fastify.log.info(...params)
}

console.error = function error(...params) {
  fastify.log.error(...params)
}

console.warn = function warn(...params) {
  fastify.log.warn(...params)
}
