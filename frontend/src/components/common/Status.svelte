<script lang="ts">
  import { engine } from "../../engine";
  import { States, state, stockfishResponse, score } from "../../state";

  function getBorderWidth(state: States) {
    switch (state) {
      case States.ERROR:
      case States.WAITING_FOR_PLAYER:
        return "4px";
      default:
        return "2px";
    }
  }

  function getBorderColor(state: States, score: string) {
    if (score === "GG") {
      return "green";
    } else {
      switch (state) {
        case States.ERROR:
          return "red";
        case States.ABORTED:
          return "orange";
        case States.WAITING_FOR_STOCKFISH:
          return "yellow";
        case States.WAITING_FOR_PLAYER:
          return "green";
        default:
          return "black";
      }
    }
  }

  function getText(state: States, stockfishResponse: string, score: string) {
    if (score == "GG") {
      return score;
    } else {
      switch (state) {
        case States.ERROR:
          return "ERROR";
        case States.ABORTED:
          return "ABORTED";
        case States.WAITING_FOR_OPPONENT:
          return "Waiting for opponent..";
        case States.WAITING_FOR_STOCKFISH:
        case States.WAITING_FOR_PLAYER:
          return stockfishResponse;
        default:
          return "";
      }
    }
  }

  function onRefreshClicked() {
    engine.resync();
  }

  $: styles = {
    "border-width": getBorderWidth($state),
    "border-color": getBorderColor($state, $score),
  };
  $: style = Object.keys(styles)
    .map((k) => `--${k}:${styles[k]}`)
    .join(";");
  $: text = getText($state, $stockfishResponse, $score);
</script>

<div {style}>
  <span>{$score}</span>
  <span>{text}</span>
  <button on:click={onRefreshClicked}>Refresh</button>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    border-width: var(--border-width);
    border-color: var(--border-color);
    border-style: solid;
    padding: 5px;
    width: 100%;
    height: 100%;
    font-size: 20px;
  }

  div > * {
    margin: 0.5rem 0;
  }

  div button {
    float: right;
  }
</style>
