import yargs from 'yargs'
import { startEngine } from '../src/index.js'
import { fastify } from './config.js'
import './logger.js'

const { argv } = yargs(process.argv)
  .option('host', {
    alias: 'h',
    describe: 'Host to bind to',
    type: 'string',
    default: '0.0.0.0',
  })
  .option('port', {
    alias: 'p',
    describe: 'Port to bind to',
    type: 'number',
    default: 8080,
  })

;(async function main() {
  if (fastify.server?.listening) return
  try {
    await startEngine()
    return fastify.listen({
      host: argv.host,
      port: argv.port,
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
