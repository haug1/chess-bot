import { writable } from "svelte/store";

export type Point = {
  x: number;
  y: number;
};

export type Move = {
  from: Point;
  to: Point;
};

export const score = writable("");
export const suggestedFriendlyMoves = writable<Move[]>([]);
export const suggestedEnemyMoves = writable<Move[]>([]);
export const stockfishResponse = writable("");
