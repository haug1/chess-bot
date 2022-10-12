import { Chess } from "chess.js";
import stockfish from "stockfish";
import { debug, log } from "../logger.js";
import { parseStockfishMessage } from "./parser.js";

let engine,
  working = false;

export async function initializeStockfish() {
  if (engine) return;
  log("Initializing engine..");
  engine = await stockfish()();
  engine.addMessageListener((msg) => {
    debug(msg);
  });
  return new Promise((resolve) => {
    const messageHandler = (msg) => {
      if (msg === "uciok") {
        log("Initialized ok");
        engine.removeMessageListener(messageHandler);
        resolve();
      }
    };

    engine.addMessageListener(messageHandler);
    engine.postMessage("uci");
  });
}

export async function getBestMoveBasedOnMoves(moves, oneval, onbestmove) {
  const chess = new Chess();
  for (const move of moves) chess.move(move);
  return getBestMoveBasedOnFEN(chess.fen(), oneval, onbestmove);
}

export async function stopEngine() {
  return new Promise((resolve) => {
    engine.postMessage("stop");
    const interval = setInterval(() => {
      if (!working) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

export async function getBestMoveBasedOnFEN(
  fenString,
  oneval = () => {},
  onbestmove = () => {}
) {
  log("Checking FEN: " + fenString);
  if (!engine) throw new Error("Engine is not ready");
  if (working) await stopEngine();
  working = true;
  return new Promise((resolve, reject) => {
    const messageHandler = (msg) => {
      if (typeof msg === "string") {
        try {
          const parsed = parseStockfishMessage(msg);
          if (parsed) {
            if (typeof oneval === "function") oneval(parsed);
            if (parsed.bestmove) {
              log("Found best move: " + msg);
              engine.removeMessageListener(messageHandler);
              if (typeof onbestmove === "function") onbestmove(parsed);
              resolve(parsed);
            }
          }
        } catch (e) {
          reject(e);
        }
      }
    };
    engine.addMessageListener(messageHandler);
    engine.postMessage("ucinewgame");
    engine.postMessage("position fen " + fenString);
    engine.postMessage("go depth 18");
    log("Waiting for engine..");
  }).finally(() => (working = false));
}
