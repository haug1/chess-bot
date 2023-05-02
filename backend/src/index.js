const { exec, ChildProcess } = require("child_process");
const { parseStockfishMessage } = require("./parser");
const { debug, isWindows } = require("./utils");
const { downloadStockfishForPlatform } = require("./download-binary");

/** @type {ChildProcess} */
let stockfishProcess;

const defaultStockfishClosedHandler = (code) => {
  stockfishProcess = undefined;
  console.warn("WARN: Stockfish exited with code " + code);
  console.warn("Exiting..");
  process.exit(0);
};
const defaultStockfishOutputHandler = (msg) => debug(msg);
const defaultStockfishErrorHandler = (msg) => console.warn(msg);

/**
 * loads and cooks the Stockfish engine in a child process
 * @returns {Promise<void>} when the engine is ready
 */
async function startEngine() {
  if (stockfishProcess) {
    return console.warn(
      "Trying to initialize the Stockfish engine, but it's already started.."
    );
  }
  // Attempts to download the Stockfish engine binary for the current platform if it doesn't already exist
  const outFilepath = await downloadStockfishForPlatform();
  return new Promise(async (resolve, reject) => {
    try {
      const command = isWindows()
        ? ".\\" + outFilepath.replace("/", "\\")
        : "./" + outFilepath;
      console.log("Initializing Stockfish engine..");
      stockfishProcess = exec(command);
      stockfishProcess.on("close", defaultStockfishClosedHandler);
      stockfishProcess.stdout.on("data", defaultStockfishOutputHandler);
      stockfishProcess.stderr.on("data", defaultStockfishErrorHandler);
      await awaitMessage((data) =>
        data?.includes(
          "Stockfish 15.1 by the Stockfish developers (see AUTHORS file)"
        )
      );
      await awaitMessage((data) => data?.includes("uciok"), "uci");
      sendCommand("ucinewgame");
      resolve(console.log("Stockfish is ready!"));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Triggers the engine to do an evaluation of a position based on a FEN string.
 * @param {string} fenPosition
 * @param {(result: ReturnType<typeof parseStockfishMessage>) => boolean | undefined} oneval callback function for when the engine makes an evaluation. If consumer returns true, then the Stockfish engine will wrap up the evaluation promptly.
 */
async function evalPosition(fenPosition, oneval) {
  sendCommand("stop");
  await isReady();
  sendCommand("ucinewgame");
  if (fenPosition) sendCommand("position fen " + fenPosition);
  await isReady();
  await awaitMessage(
    (data) => {
      if (data?.startsWith("readyok")) {
        // something else is happening, this handling must be stale, so resolve and free up the resources
        return true;
      }
      const parsedData = parseStockfishMessage(data);
      if (parsedData) {
        if (typeof oneval === "function" && oneval(parsedData) === true) {
          console.log(
            "Consumer cancelled evaluation. Forcing engine to wrap up the evaluation."
          );
          sendCommand("stop");
        }
        if (parsedData.bestmove) {
          console.log("Found best move");
          return true;
        }
      }
    },
    "go infinite",
    0 // never timeout
  );
}

/**
 * Issues the `isready` command and awaits the `readyok` response in order to synchronize the GUI and backend engine
 */
async function isReady() {
  await awaitMessage((data) => data?.startsWith("readyok"), "isready");
}

/**
 * Sends a command to the Stockfish engine.
 * Will throw exception if engine is not running.
 */
function sendCommand(cmd) {
  debug("Try send command " + cmd);
  if (stockfishProcess) {
    stockfishProcess.stdin.write(cmd + "\n");
  }
}

/**
 * Attach a message listener so that you can await a specific message from the engine.
 * Will throw exception if engine is not running.
 * @param resolverCb callback function that decides when the function resolves. Return true to resolve.
 * @param command optionally, also send a command to the engine
 * @param timeoutMs number of milliseconds until a timeout exception is thrown
 */
async function awaitMessage(resolverCb, command = "", timeoutMs = 5000) {
  if (!resolverCb || typeof resolverCb !== "function")
    throw new Error(`resolverCb must be a function`);
  return new Promise((resolve, reject) => {
    let timeoutHandler = 0;
    if (timeoutMs) {
      timeoutHandler = setTimeout(
        () =>
          reject(
            new Error(
              `Timed out waiting for Stockfish to respond to ${command} (5 seconds)`
            )
          ),
        timeoutMs
      );
    }
    const handler = async (raw) => {
      const dispose = () => {
        clearTimeout(timeoutHandler);
        stockfishProcess.stdout.off("data", handler);
      };
      try {
        for (const data of raw?.split("\n") || [])
          if ((await resolverCb(data)) === true) {
            dispose();
            resolve();
          }
      } catch (error) {
        dispose();
        reject(error);
      }
    };
    stockfishProcess.stdout.on("data", handler);
    if (command) sendCommand(command);
  });
}

/**
 * cancels any on-going evaluation and makes sure the GUI is in sync with the Stockfish engine
 */
async function cancelCurrentOperation() {
  sendCommand("stop");
  await isReady();
}

/**
 * Somewhat gracefully shuts down and disposes of the child process resources running the Stockfish engine
 * @returns promise that resolves when the process resources are released
 */
function stopEngine() {
  stockfishProcess.off("close", defaultStockfishClosedHandler);
  return new Promise(async (resolve) => {
    const handler = () => {
      stockfishProcess.stdout.off("data", defaultStockfishOutputHandler);
      stockfishProcess.stderr.off("data", defaultStockfishErrorHandler);
      stockfishProcess.off("close", handler);
      stockfishProcess.kill();
      stockfishProcess.unref();
      stockfishProcess = undefined;
      resolve();
    };
    stockfishProcess.on("close", handler);
    sendCommand("quit");
  });
}

module.exports = {
  startEngine,
  stopEngine,
  sendCommand,
  awaitMessage,
  isReady,
  evalPosition,
  cancelCurrentOperation,
};
