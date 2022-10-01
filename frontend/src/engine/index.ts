import type { ChessBotEngine } from "./base";
import { LichessEngine } from "./lichess";
import { ChessComEngine } from "./chess.com";

export const engine: ChessBotEngine =
  window.location.host === "lichess.org"
    ? new LichessEngine()
    : new ChessComEngine();
