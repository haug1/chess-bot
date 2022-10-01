<script lang="ts">
  import Highlight from "./Highlight.svelte";
  import { suggestedBestMove, suggestedPonder, type Move } from "../../state";

  function calculate(pos: number, isBlack: boolean, isX = false) {
    const position = parseInt(pos.toString());
    let result;
    if (isBlack) result = isX ? 3.5 - position + 1 : -3.5 + position - 1;
    else result = isX ? -3.5 + position - 1 : 3.5 - position + 1;
    return result.toString();
  }

  function calculatePoints(move: Move): Move {
    if (!move) return undefined;
    const isBlack = document
      .querySelector("coords.files")!
      .classList.contains("black");
    return {
      from: {
        x: calculate(move.from.x, isBlack, true),
        y: calculate(move.from.y, isBlack),
      },
      to: {
        x: calculate(move.to.x, isBlack, true),
        y: calculate(move.to.y, isBlack),
      },
    };
  }

  $: bestmove = calculatePoints($suggestedBestMove);
  $: ponder = calculatePoints($suggestedPonder);
</script>

{#if bestmove}
  <Highlight color="green" cx={bestmove.from.x} cy={bestmove.from.y} />
  <Highlight color="green" cx={bestmove.to.x} cy={bestmove.to.y} />
{/if}
{#if ponder}
  <Highlight color="red" cx={ponder.from.x} cy={ponder.from.y} />
  <Highlight color="red" cx={ponder.to.x} cy={ponder.to.y} />
{/if}
