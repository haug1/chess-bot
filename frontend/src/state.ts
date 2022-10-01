import { writable } from "svelte/store";

export type Move = {
  from: {
    x: number;
    y: number;
  };
  to: {
    x: number;
    y: number;
  };
};

export enum States {
  ERROR, // something wrong happened
  ABORTED, // stockfish request was aborted
  WAITING_FOR_GAME, // waiting for game to start
  WAITING_FOR_OPPONENT, // waiting for opponent to make a move
  WAITING_FOR_STOCKFISH, // waiting for response from stockfish
  WAITING_FOR_PLAYER, // waiting for player to make a move (stockfish response ok)
}

export const moveCounter = writable(0);
export const suggestedBestMove = writable<Move>(undefined);
export const suggestedPonder = writable<Move>(undefined);
export const hideHighlights = writable(false);
export const stockfishResponse = writable("");
export const state = writable(States.WAITING_FOR_GAME);
