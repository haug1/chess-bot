import type { ComponentType } from "svelte/internal";
import { StockfishClient, type StockfishResult } from "../api/stockfish";
import {
  score,
  stockfishResponse,
  suggestedEnemyMoves,
  suggestedFriendlyMoves,
  type Move,
} from "../state";
import Status from "../components/common/Status.svelte";
import type { Writable } from "svelte/store";

export interface IChessBotEngine {
  // Check whether a game is ready
  isGame(): boolean;
  // Mount the UI on the chess page
  mount(): void;
  // Handle a turn (get stockfish evaluation and present to user if player's turn)
  resync(): void;
}

const isMoveNotEqual = (move1, move2) =>
  move1.from.x !== move2.from.x ||
  move1.from.y !== move2.from.y ||
  move1.to.x !== move2.to.x ||
  move1.to.y !== move2.to.y;

const isMoveEqual = (move1, move2) =>
  move1.from.x === move2.from.x &&
  move1.from.y === move2.from.y &&
  move1.to.x === move2.to.x &&
  move1.to.y === move2.to.y;

export abstract class ChessBotEngine implements IChessBotEngine {
  protected abstract Highlights: ComponentType;
  protected abstract get movesContainer(): Element | null;
  protected abstract get highlightsTarget(): Element | null;
  protected abstract get statusTarget(): Element | null;
  protected abstract scrapeMoves(): string[];
  public abstract isGame(): boolean;

  private readonly _stockfish = new StockfishClient();
  private moveCounter = 0;
  private moveObserver?: MutationObserver;
  private friendlyMoves: Move[];
  private enemyMoves: Move[];

  constructor() {
    suggestedFriendlyMoves.subscribe(
      (friendlyMoves) => (this.friendlyMoves = friendlyMoves)
    );
    suggestedEnemyMoves.subscribe(
      (enemyMoves) => (this.enemyMoves = enemyMoves)
    );
  }

  public mount() {
    new Promise(
      () =>
        new this.Highlights({
          target: this.highlightsTarget!,
        })
    );
    new Promise(
      () =>
        new Status({
          target: this.statusTarget!,
        })
    );
    this.onMoveObserved();
    this.startObservingMoves();
  }

  public resync(): void {
    this.moveCounter = 0;
    if (this.moveObserver) {
      this.moveObserver.disconnect();
      this.moveObserver = undefined;
    }
    this.onMoveObserved();
    this.startObservingMoves();
  }

  private async onMoveObserved() {
    ++this.moveCounter;
    suggestedFriendlyMoves.set([]);
    suggestedEnemyMoves.set([]);
    this._stockfish.abort();
    await this.handleTurn(this.moveCounter % 2 !== 0);
  }

  private startObservingMoves() {
    this.moveObserver = new MutationObserver(() => {
      this.onMoveObserved();
    });
    this.moveObserver.observe(this.movesContainer!, {
      childList: true,
      subtree: true,
    });
  }

  private addTopMove(
    movesStore: Writable<Move[]>,
    move: Move,
    cachedMoves: Move[]
  ) {
    movesStore.set([
      move,
      ...cachedMoves.filter(getUniqueMoves(move)).slice(0, 1),
    ]);
  }

  private async handleTurn(isPlayerTurn: boolean) {
    try {
      await this._stockfish.getEvaluation(
        this.scrapeMoves(),
        this.moveCounter,
        // when evaluation recieved, do:
        (stockfishResult: StockfishResult) => {
          const stale = this.moveCounter !== stockfishResult.refMoveCounter;
          if (stale) throw { stale };

          stockfishResponse.set(stockfishResult.raw);

          if (stockfishResult.bestmove) {
            const playerMove = isPlayerTurn
              ? stockfishResult.bestmove.bestmove
              : stockfishResult.bestmove.ponder;
            const opponentMove = isPlayerTurn
              ? stockfishResult.bestmove.ponder
              : stockfishResult.bestmove.bestmove;

            if (playerMove)
              this.addTopMove(
                suggestedFriendlyMoves,
                playerMove,
                this.friendlyMoves
              );
            if (opponentMove)
              this.addTopMove(
                suggestedEnemyMoves,
                opponentMove,
                this.enemyMoves
              );
          }

          if (stockfishResult.evaluation) {
            const playerMove = isPlayerTurn
              ? stockfishResult.evaluation.friendly
              : stockfishResult.evaluation.enemy;
            const opponentMove = isPlayerTurn
              ? stockfishResult.evaluation.enemy
              : stockfishResult.evaluation.friendly;

            if (playerMove)
              this.addTopMove(
                suggestedFriendlyMoves,
                playerMove,
                this.friendlyMoves
              );
            if (opponentMove)
              this.addTopMove(
                suggestedEnemyMoves,
                opponentMove,
                this.enemyMoves
              );
          }

          if (stockfishResult.score) {
            score.set(stockfishResult.score);
          }
        }
      );
    } catch (e) {
      if (!e.stale && !e.aborted) throw e;
    }
  }
}

function getUniqueMoves(refMove) {
  return (move, i, arr) => {
    const notEqualBestMove = isMoveNotEqual(move, refMove);
    const index = arr.findIndex((otherMove) => isMoveEqual(move, otherMove));
    const isNotEqualToOtherMoveInArr = index === i;
    return notEqualBestMove && isNotEqualToOtherMoveInArr;
  };
}
