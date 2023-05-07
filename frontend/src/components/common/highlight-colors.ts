import type { Move, Point } from "../../state";

export function getFriendlyMoveColor(index: number) {
  switch (index) {
    case 0:
      return "rgba(0,255,0,1)";
    case 1:
      return "rgba(212,245,66,1)";
    default:
      return "rgba(212,245,66,0.5)";
  }
}

export function getEnemyMoveColor(index: number) {
  switch (index) {
    case 0:
      return "rgba(255,0,0,1)";
    case 1:
      return "rgba(245,105,66,1)";
    case 2:
    default:
      return "rgba(245,105,66,0.5)";
  }
}

function arePointsEqual(point1: Point, point2: Point): boolean {
  return point1.x === point2.x && point1.y === point2.y;
}

export function showEnemyMove(point: Point, friendlyMoves: Move[]): boolean {
  return !friendlyMoves.some(
    (m) => arePointsEqual(point, m.from) || arePointsEqual(point, m.to)
  );
}
