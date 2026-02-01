import { Chess } from 'chess.js'

/**
 * @typedef {Parameters<Chess['move']>[0]} MoveInput
 * @param {MoveInput[]} moves
 * @returns {string}
 **/
export function getFenFromMoves(moves) {
  const chess = new Chess()
  for (const move of moves) chess.move(move)
  return chess.fen()
}

/**
 * @typedef {Object} PositionedPiece
 * @property {import('chess.js').Color} color
 * @property {import('chess.js').PieceSymbol} type
 * @property {import('chess.js').Square} square
 */

/**
 * Builds a FEN string from a list of pieces.
 *
 * @param {PositionedPiece[]} pieces
 * @returns {string}
 **/
export function getFenFromPosition(pieces) {
  const chess = new Chess()

  for (const { color, type, square } of pieces) {
    chess.put({ color, type }, square)
  }

  return chess.fen()
}
