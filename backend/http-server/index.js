import { startEngine } from '../src/index.js'
import { fastify } from './config.js'
import './logger.js'
;(async function main() {
  if (fastify.server?.listening) return
  try {
    await startEngine()
    return fastify.listen({ port: process.env.PORT || 8080 })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
