import type { SvelteComponentDev } from "svelte/internal";
import { StockfishClient } from "../api/stockfish";
import {
  hideHighlights,
  moveCounter,
  state,
  States,
  stockfishResponse,
  suggestedBestMove,
  suggestedPonder,
} from "../state";
import { Chess } from "chess.js";

export interface IChessBotEngine {
  // Check whether a game is ready
  isGame(): boolean;
  // Mount the UI on the chess page
  mount(): void;
  // Handle a turn (get stockfish evaluation and present to user if player's turn)
  onMoveObserved(): Promise<void>;
}

export abstract class ChessBotEngine implements IChessBotEngine {
  protected abstract Status: typeof SvelteComponentDev;
  protected abstract Highlights: typeof SvelteComponentDev;
  protected abstract get movesContainer(): Element | null;
  protected abstract get highlightsTarget(): Element | null;
  protected abstract get statusTarget(): Element | null;
  protected abstract scrapeMoves(): string[];

  public abstract isGame(): boolean;

  private readonly _stockfish = new StockfishClient();
  private moveCounter = 0;

  constructor() {
    moveCounter.subscribe((value) => (this.moveCounter = value));
  }

  public mount() {
    new Promise(
      () =>
        new this.Highlights({
          target: this.highlightsTarget,
        })
    );
    new Promise(
      () =>
        new this.Status({
          target: this.statusTarget,
        })
    );
    this.onMoveObserved();
    this.startObservingMoves();
  }

  public async onMoveObserved() {
    moveCounter.set(++this.moveCounter);
    try {
      this._stockfish.abort();
      if (this.moveCounter % 2) await this.onPlayerTurn();
      else this.onOpponentTurn();
    } catch (e) {
      if (!e.stale) {
        state.set(e.aborted ? States.ABORTED : States.ERROR);
        if (!e.aborted) throw e;
      }
    }
  }

  private startObservingMoves() {
    new MutationObserver(() => {
      this.onMoveObserved();
    }).observe(this.movesContainer, {
      childList: true,
      subtree: true,
    });
  }

  private async onPlayerTurn() {
    state.set(States.WAITING_FOR_STOCKFISH);
    const chess = new Chess();
    for (const move of this.scrapeMoves()) chess.move(move);
    const stockfishResult = await this._stockfish.getBestMoveBasedOnFEN(
      chess.fen(),
      this.moveCounter
    );

    // throw response if stale, i.e. the response was meant for an earlier game state
    const stale = this.moveCounter !== stockfishResult.refMoveCounter;
    if (stale) throw { stale };

    state.set(States.WAITING_FOR_PLAYER);
    stockfishResponse.set(stockfishResult.response);
    if (stockfishResult.moves) {
      suggestedBestMove.set(stockfishResult.moves.bestmove);
      suggestedPonder.set(stockfishResult.moves.ponder);
      hideHighlights.set(false);
    }
  }

  private onOpponentTurn() {
    state.set(States.WAITING_FOR_OPPONENT);
    hideHighlights.set(true);
  }
}
