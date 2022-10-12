import {
  getBestMoveBasedOnFEN,
  getBestMoveBasedOnMoves,
  initializeStockfish,
} from "../../../src/stockfish/stockfish";

describe("stockfish/index.js", () => {
  beforeAll(async () => {
    await initializeStockfish();
  });

  it("getBestMoveBasedOnFen", async () => {
    const result = await getBestMoveBasedOnFEN(
      "rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2"
    );
    expect(result).toEqual({
      bestmove: {
        bestmove: {
          from: {
            x: 5,
            y: 2,
          },
          to: {
            x: 5,
            y: 4,
          },
        },
        ponder: {
          from: {
            x: 2,
            y: 8,
          },
          to: {
            x: 3,
            y: 6,
          },
        },
      },
      evaluation: undefined,
      raw: "bestmove e2e4 ponder b8c6",
      score: undefined,
    });
  });

  it("getBestMoveBasedOnMoves", async () => {
    const result = await getBestMoveBasedOnMoves([]);
    expect(result).toEqual({
      bestmove: {
        bestmove: {
          from: {
            x: 5,
            y: 2,
          },
          to: {
            x: 5,
            y: 4,
          },
        },
        ponder: {
          from: {
            x: 5,
            y: 7,
          },
          to: {
            x: 5,
            y: 5,
          },
        },
      },
      evaluation: undefined,
      raw: "bestmove e2e4 ponder e7e5",
      score: undefined,
    });
  });
});
