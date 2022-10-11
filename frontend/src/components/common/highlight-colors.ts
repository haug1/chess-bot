import { States } from "../../state";

export function getFriendlyMoveColor(index: number, state: States) {
  switch (index) {
    case 0:
      return state === States.WAITING_FOR_STOCKFISH
        ? "rgba(255,255,0,1)"
        : "rgba(0,255,0,1)";
    case 1:
      return state === States.WAITING_FOR_STOCKFISH
        ? "rgba(255,255,0,0.5)"
        : "rgba(0,255,0,0.5)";
    case 2:
    default:
      return state === States.WAITING_FOR_STOCKFISH
        ? "rgba(255,255,0,0.3)"
        : "rgba(0,255,0,0.3)";
  }
}

export function getEnemyMoveColor(index: number, state: States) {
  switch (index) {
    case 0:
      return "rgba(255,0,0,1)";
    case 1:
      return "rgba(255,0,0,0.5)";
    case 2:
    default:
      return "rgba(255,0,0,0.3)";
  }
}
