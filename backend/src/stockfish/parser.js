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
    const moves = msg.substr(index + EVALUATION_MATCHER.length);
    const matches = /(.\d.\d).*(.\d.\d).*/.exec(moves);
    evaluation = createEvalMove(matches[1], matches[2]);
  } else if (msg.includes(BESTMOVE_MATCHER)) {
    const [_, bestMove, ponder] = /bestmove (.\d.\d).*ponder (.\d.\d).*/.exec(
      msg
    );
    bestmove = createBestMove(bestMove, ponder);
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
