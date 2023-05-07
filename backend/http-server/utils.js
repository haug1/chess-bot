import { Chess } from 'chess.js'

export function getFenFromMoves(moves) {
  const chess = new Chess()
  for (const move of moves) chess.move(move)
  return chess.fen()
}
