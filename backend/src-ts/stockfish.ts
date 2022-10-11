// import stockfish from "stockfish";
// import { debug, log } from "../logger.js";
// import { parseStockfishResponse } from "./parser.js";

// type MessageHandler = (msg?: string) => void;

// interface StockfishEngine {
//   addMessageListener(handler: MessageHandler): void;
//   removeMessageListener(handler: MessageHandler): void;
//   postMessage(message: string): void;
// }

// interface Position {
//   x: number;
//   y: number;
// }

// interface Move {
//   from: Position;
//   to: Position;
// }

// interface BestMoveResponse {
//   moves?: {
//     bestmove?: Move;
//     ponder?: Move;
//   };
//   raw?: string;
// }

// interface StockfishService {
//   initialize(): Promise<void>;
//   getBestMoveBasedOnFEN(fen: string): Promise<BestMoveResponse>;
// }

// let engine: StockfishEngine;

// export const stocfishService: StockfishService = {
//   async initialize(): Promise<void> {
//     if (engine) return;

//     log("Initializing engine..");

//     engine = await stockfish()();
//     engine.addMessageListener((msg) => {
//       debug(msg);
//     });

//     return new Promise<void>((resolve) => {
//       const messageHandler = (msg) => {
//         if (msg === "uciok") {
//           log("Initialized ok");
//           resolve(engine.removeMessageListener(messageHandler));
//         }
//       };

//       engine.addMessageListener(messageHandler);
//       engine.postMessage("uci");
//     });
//   },
//   async getBestMoveBasedOnFEN(fen: string): Promise<BestMoveResponse> {
//     log("Checking FEN: " + fen);

//     if (!engine) throw new Error("Engine is not ready");

//     return new Promise((resolve, reject) => {
//       const messageHandler = (msg) => {
//         if (typeof msg === "string") {
//           if (msg.match("bestmove")) {
//             log("Found best move: " + msg);
//             engine.removeMessageListener(messageHandler);
//             resolve(parseStockfishResponse(msg));
//           } else if (msg.includes("pthread sent an error")) {
//             reject(new Error(msg));
//           }
//         }
//       };

//       engine.addMessageListener(messageHandler);
//       engine.postMessage("ucinewgame");
//       engine.postMessage("position fen " + fen);
//       engine.postMessage("go depth 18");
//       log("Waiting for engine..");
//     });
//   },
// };
