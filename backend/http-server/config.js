import createFastify from 'fastify'
import pretty from 'pino-pretty'
import { evalPosition, cancelCurrentOperation } from '../src/index.js'
import { getFenFromMoves } from './utils.js'

export const createServer = (/** @type {boolean} */ debug) => {
  const server = createFastify({
    logger: {
      level: debug ? 'debug' : undefined,
      stream: pretty({
        colorize: true,
        translateTime: true,
        ignore: 'pid,hostname',
      }),
    },
  })

  server.get('/', (_, reply) => reply.send('UP'))

  // Sample request:
  // POST /moves/sse
  // Content-Type: application/json
  // { moves: ["e4"] }
  // Returns text/event-stream
  // each chunk is a stockfish evaluation,
  // see `src/parser.js` for structure/details on parsing of Stockfish engine output
  server.post('/moves/sse', async (request, reply) => {
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache,no-transform',
      'x-no-compression': 1,
    })
    try {
      request.socket.on('end', () => cancelCurrentOperation())
      /** @typedef {Parameters<import('chess.js').Chess['move']>[0]} MoveInput */
      /** @type {{ moves: MoveInput[] }} */
      // @ts-ignore
      const body = request.body
      await evalPosition(getFenFromMoves(body.moves), (v) => {
        reply.raw.write(`data: ${JSON.stringify(v)}\n\n`)
      })
      reply.raw.end()
    } catch (e) {
      console.error(e)
      // @ts-ignore
      reply.code(500).send({ message: e?.message })
    }
  })

  // Sample request:
  // POST /fen/sse
  // Content-Type: text/plain
  // rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2
  // Returns text/event-stream
  // each chunk is a stockfish evaluation,
  // see `src/parser.js` for structure/details on parsing of Stockfish engine output
  server.post('/fen/sse', async (request, reply) => {
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache,no-transform',
      'x-no-compression': 1,
    })
    try {
      request.socket.on('end', () => cancelCurrentOperation())
      /** @type {string} */
      // @ts-ignore
      const body = request.body
      await evalPosition(body, (v) => {
        reply.raw.write(`data: ${JSON.stringify(v)}\n\n`)
      })
      reply.raw.end()
    } catch (e) {
      console.error(e)
      // @ts-ignore
      reply.code(500).send({ message: e?.message })
    }
  })

  // attach global logger
  Object.assign(console, {
    // @ts-ignore
    debug: (...params) => params.forEach((param) => server.log.debug(param)),
    // @ts-ignore
    error: (...params) => params.forEach((param) => server.log.error(param)),
    // @ts-ignore
    log: (...params) => params.forEach((param) => server.log.info(param)),
    // @ts-ignore
    warn: (...params) => params.forEach((param) => server.log.warn(param)),
  })

  return server
}
