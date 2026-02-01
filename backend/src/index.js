import { exec, ChildProcess } from 'child_process'
import { parseStockfishMessage } from './parser.js'
import { isWindows } from './utils.js'

/** @type {ChildProcess} */
let stockfishProcess

const defaultStockfishClosedHandler = async (/** @type {string} */ code) => {
  console.warn('WARN: Stockfish unexpectedly exited with code ' + code)
  console.warn('Restarting engine..')
  try {
    await stopEngine()
  } finally {
    await startEngine()
  }
}
const defaultStockfishOutputHandler = (/** @type {string} */ msg) =>
  console.debug(msg)
const defaultStockfishErrorHandler = (/** @type {string} */ msg) =>
  console.warn(msg)

/**
 * loads and cooks the Stockfish engine in a child process
 * @returns {Promise<void>} when the engine is ready
 */
export async function startEngine() {
  if (stockfishProcess) {
    return console.warn(
      "Trying to initialize the Stockfish engine, but it's already started..",
    )
  }
  return new Promise(async (resolve, reject) => {
    try {
      const initcommand = isWindows() ? '.\\' : './'
      console.log('Initializing Stockfish engine..')
      stockfishProcess = exec(initcommand + 'bin/stockfish')
      stockfishProcess.on('close', defaultStockfishClosedHandler)
      stockfishProcess.on('error', defaultStockfishErrorHandler)
      stockfishProcess.stdout?.on('data', defaultStockfishOutputHandler)
      stockfishProcess.stderr?.on('data', defaultStockfishErrorHandler)
      await awaitMessage((data) =>
        data?.includes('by the Stockfish developers (see AUTHORS file)'),
      )
      await awaitMessage((data) => data?.includes('uciok'), 'uci')
      sendCommand('ucinewgame')
      resolve(console.log('Stockfish is ready!'))
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Triggers the engine to do an evaluation of a position based on a FEN string.
 * @param {string} fenPosition
 * @param {(result: ReturnType<typeof parseStockfishMessage>) => boolean | undefined | void} oneval callback function for when the engine makes an evaluation. If consumer returns true, then the Stockfish engine will wrap up the evaluation promptly.
 */
export async function evalPosition(fenPosition, oneval) {
  sendCommand('stop')
  await isReady()
  sendCommand('ucinewgame')
  const startTime = new Date()
  if (fenPosition) sendCommand('position fen ' + fenPosition)
  await isReady()
  await awaitMessage(
    (data) => {
      if (data?.startsWith('readyok')) {
        // something else is happening, this handling must be stale, so resolve and free up the resources
        return true
      }
      const parsedData = parseStockfishMessage(data)
      if (parsedData) {
        if (typeof oneval === 'function' && oneval(parsedData) === true) {
          console.log(
            'Consumer cancelled evaluation. Forcing engine to wrap up the evaluation.',
          )
          sendCommand('stop')
        }
        if (parsedData.bestmove) {
          const executionTimeMs = (
            (new Date().getTime() - startTime.getTime()) /
            1000
          ).toFixed(2)
          console.log(
            `Found best move after ${executionTimeMs} seconds. ${parsedData.raw}`,
          )
          return true
        }
      }
    },
    'go infinite',
    0, // never timeout
  )
}

/**
 * Issues the `isready` command and awaits the `readyok` response in order to synchronize the GUI and backend engine
 */
export async function isReady() {
  await awaitMessage((data) => data?.startsWith('readyok'), 'isready')
}

/**
 * Sends a command to the Stockfish engine.
 * Will throw exception if engine is not running.
 * @param {string} cmd
 */
export function sendCommand(cmd) {
  console.debug('Try send command ' + cmd)
  if (stockfishProcess) {
    stockfishProcess.stdin?.write(cmd + '\n')
  }
}

/**
 * Attach a message listener so that you can await a specific message from the engine.
 * Will throw exception if engine is not running.
 * @param {(data: string) => boolean | void | Promise<boolean> | Promise<void>} resolverCb callback function that decides when the function resolves. Return true to resolve.
 * @param command optionally, also send a command to the engine
 * @param timeoutMs number of milliseconds until a timeout exception is thrown
 */
export async function awaitMessage(resolverCb, command = '', timeoutMs = 5000) {
  if (!resolverCb || typeof resolverCb !== 'function')
    throw new Error(`resolverCb must be a function`)
  return new Promise((resolve, reject) => {
    /** @type {NodeJS.Timeout} */
    let timeoutHandler
    if (timeoutMs) {
      timeoutHandler = setTimeout(
        () =>
          reject(
            new Error(
              `Timed out waiting for Stockfish to respond to ${command} (5 seconds)`,
            ),
          ),
        timeoutMs,
      )
    }
    const handler = async (/** @type {string} */ raw) => {
      const dispose = () => {
        clearTimeout(timeoutHandler)
        stockfishProcess.stdout?.off('data', handler)
      }
      try {
        for (const data of raw?.split('\n') || [])
          if ((await resolverCb(data)) === true) {
            dispose()
            resolve(void 0)
          }
      } catch (error) {
        dispose()
        reject(error)
      }
    }
    stockfishProcess.stdout?.on('data', handler)
    if (command) sendCommand(command)
  })
}

/**
 * cancels any on-going evaluation and makes sure the GUI is in sync with the Stockfish engine
 */
export async function cancelCurrentOperation() {
  sendCommand('stop')
  await isReady()
}

/**
 * Somewhat gracefully shuts down and disposes of the child process resources running the Stockfish engine
 * @returns promise that resolves when the process resources are released
 */
export function stopEngine() {
  stockfishProcess.off('close', defaultStockfishClosedHandler)
  const timeoutMs = 2000
  return new Promise((resolve, reject) => {
    const timeoutHandler = setTimeout(
      () =>
        reject(
          new Error(`Timed out waiting for Stockfish to quit (5 seconds)`),
        ),
      timeoutMs,
    )
    try {
      const handler = () => {
        stockfishProcess?.stdout?.off('data', defaultStockfishOutputHandler)
        stockfishProcess?.stderr?.off('data', defaultStockfishErrorHandler)
        stockfishProcess?.off('error', defaultStockfishErrorHandler)
        stockfishProcess?.off('close', handler)
        stockfishProcess?.kill()
        stockfishProcess?.unref()

        // @ts-expect-error
        stockfishProcess = undefined

        clearTimeout(timeoutHandler)
        resolve(void 0)
      }
      stockfishProcess.on('close', handler)
      sendCommand('quit')
    } catch (err) {
      clearTimeout(timeoutHandler)
      reject(err)
    }
  })
}
