<script lang="ts">
  import { engine } from "../../engine";
  import { moveCounter, States, state, stockfishResponse } from "../../state";

  function getBorderWidth(state) {
    switch (state) {
      case States.ERROR:
      case States.WAITING_FOR_PLAYER:
        return "4px";
      default:
        return "2px";
    }
  }

  function getBorderColor(state) {
    switch (state) {
      case States.ERROR:
        return "red";
      case States.ABORTED:
        return "orange";
      case States.WAITING_FOR_STOCKFISH:
        return "yellow";
      default:
        return "black";
    }
  }

  function getText(state) {
    switch (state) {
      case States.ERROR:
        return "ERROR";
      case States.ABORTED:
        return "ABORTED";
      case States.WAITING_FOR_OPPONENT:
        return "Waiting for opponent..";
      case States.WAITING_FOR_STOCKFISH:
        return "Waiting for stockfish..";
      case States.WAITING_FOR_PLAYER:
        return $stockfishResponse;
      default:
        return "";
    }
  }

  function onRefreshClicked() {
    $moveCounter = 0;
    engine.onMoveObserved();
  }

  $: styles = {
    "border-width": getBorderWidth($state),
    "border-color": getBorderColor($state),
  };
  $: style = Object.keys(styles)
    .map((k) => `--${k}:${styles[k]}`)
    .join(";");
  $: text = getText($state);
</script>

<div {style}>
  {#if style}
    <span>{text}</span>
  {/if}
  <button on:click={onRefreshClicked}>Refresh</button>
</div>

<style>
  div {
    border-width: var(--border-width);
    border-color: var(--border-color);
    border-style: solid;
    padding: 5px;
  }

  div button {
    float: right;
  }
</style>
