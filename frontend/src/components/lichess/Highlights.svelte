<script lang="ts">
  import Highlight from "./Highlight.svelte";
  import {
    state,
    States,
    suggestedEnemyMoves,
    suggestedFriendlyMoves,
    type Move,
  } from "../../state";
  import {
    getEnemyMoveColor,
    getFriendlyMoveColor,
  } from "../common/highlight-colors";

  function calculate(pos: number, isBlack: boolean, isX = false) {
    const position = parseInt(pos.toString());
    let result;
    if (isBlack) result = isX ? 3.5 - position + 1 : -3.5 + position - 1;
    else result = isX ? -3.5 + position - 1 : 3.5 - position + 1;
    return result.toString();
  }

  function calculatePoints(move: Move): Move {
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

  $: friendlyMoves = $suggestedFriendlyMoves.map((m) => calculatePoints(m));
  $: enemyMoves = $suggestedEnemyMoves.map((m) => calculatePoints(m));
  $: showHighlights =
    $state === States.WAITING_FOR_PLAYER ||
    $state === States.WAITING_FOR_STOCKFISH;
</script>

{#if showHighlights}
  {#each friendlyMoves as move, i}
    <Highlight
      color={getFriendlyMoveColor(i, $state)}
      x={move.from.x}
      y={move.from.y}
    />
    <Highlight
      color={getFriendlyMoveColor(i, $state)}
      x={move.to.x}
      y={move.to.y}
    />
  {/each}
  {#each enemyMoves as move, i}
    <Highlight
      color={getEnemyMoveColor(i, $state)}
      x={move.from.x}
      y={move.from.y}
    />
    <Highlight
      color={getEnemyMoveColor(i, $state)}
      x={move.to.x}
      y={move.to.y}
    />
  {/each}
{/if}
