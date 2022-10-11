const LOOKUP = ["a", "b", "c", "d", "e", "f", "g", "h"];

const createXY = (boardPosition) => ({
  x: LOOKUP.indexOf(boardPosition[0]) + 1,
  y: boardPosition[1],
});

const createMove = (move) => ({
  from: createXY(move.substr(0, 2)),
  to: createXY(move.substr(2)),
});

const createBestMove = (bestmove, ponder) => ({
  ...(bestmove && { bestmove: createMove(bestmove) }),
  ...(ponder && { ponder: createMove(ponder) }),
});

const createEvalMove = (friendly, enemy) => ({
  friendly: createMove(friendly),
  ...(enemy && { enemy: createMove(enemy) }),
});

const BESTMOVE_MATCHER = "bestmove";
const EVALUATION_MATCHER = " pv ";
const SCORE_MATCHER = "score";
export function parseStockfishMessage(msg) {
  let evaluation, bestmove, score;

  if (msg.includes(EVALUATION_MATCHER)) {
    const index = msg.indexOf(EVALUATION_MATCHER);
    const moveStrings = msg
      .substr(index + EVALUATION_MATCHER.length, 9)
      .split(" ");
    const friendlyMove = moveStrings[0];
    const enemyMove = moveStrings.length >= 2 ? moveStrings[1] : undefined;
    evaluation = createEvalMove(friendlyMove, enemyMove);
  } else if (msg.includes(BESTMOVE_MATCHER)) {
    bestmove = createBestMove(msg.substr(9, 4), msg.substr(21));
  } else if (msg.includes("pthread sent an error")) {
    throw new Error(msg);
  }

  if (msg.includes(SCORE_MATCHER)) {
    const [_, type, res] = /score (cp|mate) (.*) nodes/.exec(msg);
    const isMate = type === "mate";
    const prefix = isMate ? type + " " : "";
    const scoreNumber = isMate ? res : parseInt(res) / 100;
    score = prefix + scoreNumber;
  }

  return evaluation || bestmove
    ? {
        evaluation,
        bestmove,
        raw: msg,
        score,
      }
    : undefined;
}
