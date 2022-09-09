import stockfish from "stockfish";
import { debug, log } from "./logger.js";

let engine;

function defaultMessageHandler(msg) {
  debug(msg);
}

function addEngineMessageListener(messageHandler) {
  engine.removeMessageListener(defaultMessageHandler);
  engine.addMessageListener(messageHandler);
}

function removeEngineMessageListener(messageHandler) {
  engine.removeMessageListener(messageHandler);
  engine.addMessageListener(defaultMessageHandler);
}

export async function initializeStockfish() {
  if (engine) return;

  log("Initializing engine..");

  engine = await stockfish()();

  return new Promise((resolve) => {
    const messageHandler = (msg) => {
      defaultMessageHandler(msg);
      if (msg === "uciok") {
        log("Initialized ok");
        removeEngineMessageListener(messageHandler);
        resolve();
      }
    };

    addEngineMessageListener(messageHandler);
    engine.postMessage("uci");
  });
}

export async function getBestMoveBasedOnFEN(fenString) {
  log("Checking FEN: " + fenString);

  if (!engine) {
    throw new Error("Engine is not ready");
  }

  return new Promise((resolve) => {
    const messageHandler = (msg) => {
      defaultMessageHandler(msg);
      if (typeof (msg == "string") && msg.match("bestmove")) {
        log("Found best move: " + msg);
        removeEngineMessageListener(messageHandler);
        resolve(msg);
      }
    };

    addEngineMessageListener(messageHandler);
    engine.postMessage("ucinewgame");
    engine.postMessage("position fen " + fenString);
    engine.postMessage("go depth 18");
    log("Waiting for engine..");
  });
}
