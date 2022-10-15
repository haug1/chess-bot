import { parseStockfishMessage } from "../../../src/stockfish/parser";

describe("stockfish/parser.js", () => {
  it("parse bestmove without ponder", () => {
    const raw = "bestmove g4f5";
    expect(parseStockfishMessage(raw)).toEqual({
      bestmove: { bestmove: { from: { x: 7, y: 4 }, to: { x: 6, y: 5 } } },
      raw,
    });
  });

  it("parse bestmove with ponder", () => {
    const raw = "bestmove g4f5 ponder a2a4";
    expect(parseStockfishMessage(raw)).toEqual({
      bestmove: {
        bestmove: { from: { x: 7, y: 4 }, to: { x: 6, y: 5 } },
        ponder: {
          from: {
            x: 1,
            y: 2,
          },
          to: {
            x: 1,
            y: 4,
          },
        },
      },
      raw,
    });
  });

  it("parse eval", () => {
    const raw =
      "info depth 11 seldepth 15 multipv 1 score cp 13 nodes 121663 nps 1267322 time 96 pv e2e4 e7e6 g1f3 b8c6 f1e2 g8f6 b1d2 f8e7 e1g1 d7d5";
    const expected = {
      evaluation: {
        friendly: { from: { x: 5, y: 2 }, to: { x: 5, y: 4 } },
        enemy: { from: { x: 5, y: 7 }, to: { x: 5, y: 6 } },
      },
      raw,
      score: "0.13",
    };
    const actual = parseStockfishMessage(raw);
    expect(actual).toEqual(expected);
  });

  it.only("parse no bestmove", () => {
    const raw = "bestmove (none)";
    const actual = parseStockfishMessage(raw);
    const expected = {
      bestmove: {},
      evaluation: undefined,
      raw: "bestmove (none)",
      score: "GG",
    };
    expect(actual).toEqual(expected);
  });

  it("parse error", () => {
    const raw = "pthread sent an error blabla some error";
    let errorMessage;
    try {
      parseStockfishMessage(raw);
    } catch (e) {
      errorMessage = e.message;
    }
    expect(errorMessage).toEqual(raw);
  });

  describe("parse score", () => {
    it("score cp 41", () => {
      const raw =
        "info depth 18 seldepth 32 multipv 1 score cp 41 lowerbound nodes 4375107 nps 1327801 hashfull 982 time 3295 pv d2d4";
      const actual = parseStockfishMessage(raw).score;
      expect(actual).toEqual("0.41");
    });

    it("score mate 1", () => {
      const raw =
        "info depth 18 seldepth 32 multipv 1 score mate 1 lowerbound nodes 4375107 nps 1327801 hashfull 982 time 3295 pv d2d4";
      const actual = parseStockfishMessage(raw).score;
      expect(actual).toEqual("mate 1");
    });
  });
});
