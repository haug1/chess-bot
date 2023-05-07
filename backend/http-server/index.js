import yargs from 'yargs'
import { startEngine } from '../src/index.js'
import { createServer } from './config.js'

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
  .option('verbose', {
    alias: 'v',
    describe: 'Get more verbose output',
    type: 'boolean',
    default: false,
  })

;(async function main() {
  try {
    const server = createServer(argv.verbose)
    await startEngine()
    return server.listen({
      host: argv.host,
      port: argv.port,
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
