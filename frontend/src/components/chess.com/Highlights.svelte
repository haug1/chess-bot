<script lang="ts">
  import Highlight from "./Highlight.svelte";
  import {
    state,
    States,
    suggestedEnemyMoves,
    suggestedFriendlyMoves,
  } from "../../state";
  import {
    getEnemyMoveColor,
    getFriendlyMoveColor,
  } from "../common/highlight-colors";

  $: showHighlights =
    $state === States.WAITING_FOR_PLAYER ||
    $state === States.WAITING_FOR_STOCKFISH;
</script>

{#if showHighlights}
  {#each $suggestedFriendlyMoves as friendlyMove, i}
    <Highlight
      color={getFriendlyMoveColor(i, $state)}
      x={friendlyMove.from.x}
      y={friendlyMove.from.y}
    />
    <Highlight
      color={getFriendlyMoveColor(i, $state)}
      x={friendlyMove.to.x}
      y={friendlyMove.to.y}
    />
  {/each}
  {#each $suggestedEnemyMoves as enemyMove, i}
    <Highlight
      color={getEnemyMoveColor(i, $state)}
      x={enemyMove.from.x}
      y={enemyMove.from.y}
    />
    <Highlight
      color={getEnemyMoveColor(i, $state)}
      x={enemyMove.to.x}
      y={enemyMove.to.y}
    />
  {/each}
{/if}
