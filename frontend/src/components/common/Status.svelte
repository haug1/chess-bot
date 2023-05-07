<script lang="ts">
  import { engine } from "../../engine";
  import { stockfishResponse, score } from "../../state";

  function getBorderColor(score: string) {
    if (score === "GG") {
      return "green";
    } else {
      return "black";
    }
  }

  function getText(stockfishResponse: string, score: string) {
    if (score == "GG") {
      return score;
    } else {
      return stockfishResponse;
    }
  }

  function onRefreshClicked() {
    engine.resync();
  }

  $: styles = {
    "border-color": getBorderColor($score),
  };
  $: style = Object.keys(styles)
    .map((k) => `--${k}:${styles[k]}`)
    .join(";");
  $: text = getText($stockfishResponse, $score);
</script>

<div {style}>
  <button on:click={onRefreshClicked}>Refresh</button>
  <span>{$score}</span>
  <span>{text}</span>
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
    overflow: auto;
  }

  div > * {
    padding: 0.5rem 0;
  }

  div button {
    align-self: flex-start;
  }
</style>
