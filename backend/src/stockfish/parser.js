const LOOKUP = ["a", "b", "c", "d", "e", "f", "g", "h"];

const createXY = (boardPosition) => ({
  x: LOOKUP.indexOf(boardPosition[0]) + 1,
  y: parseInt(boardPosition[1]),
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

const BESTMOVE_REGEX =
  /bestmove ([a-z]\d[a-z]\d)(?: ponder )?([a-z]\d[a-z]\d)?/;
const SCORE_REGEX = /score (cp|mate) (.*) nodes/;
const EVAL_REGEX = /.* pv (.\d.\d)(?: )?(.\d.\d)?/;
export function parseStockfishMessage(msg) {
  let evaluation, bestmove, score;

  const evalMatch = EVAL_REGEX.exec(msg);
  if (evalMatch) {
    const [_, friendly, enemy] = evalMatch;
    evaluation = createEvalMove(friendly, enemy);
  } else {
    const bestmoveMatch = BESTMOVE_REGEX.exec(msg);
    if (bestmoveMatch) {
      const [_, bestMove, ponder] = bestmoveMatch;
      bestmove = createBestMove(bestMove, ponder);
    } else if (msg.includes("bestmove (none)")) {
      bestmove = {};
    } else if (msg.includes("pthread sent an error")) {
      throw new Error(msg);
    }
  }

  const scoreMatch = SCORE_REGEX.exec(score);
  if (scoreMatch) {
    const [_, type, res] = scoreMatch;
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
