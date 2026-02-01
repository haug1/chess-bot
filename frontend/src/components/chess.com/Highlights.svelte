<script lang="ts">
  import Highlight from "./Highlight.svelte";
  import { suggestedEnemyMoves, suggestedFriendlyMoves } from "../../state";
  import {
    getEnemyMoveColor,
    getFriendlyMoveColor,
    showEnemyMove,
  } from "../common/highlight-colors";
</script>

{#each $suggestedFriendlyMoves as friendlyMove, i (i)}
  <Highlight
    color={getFriendlyMoveColor(i)}
    x={friendlyMove.from.x}
    y={friendlyMove.from.y}
  />
  <Highlight
    color={getFriendlyMoveColor(i)}
    x={friendlyMove.to.x}
    y={friendlyMove.to.y}
  />
{/each}
{#each $suggestedEnemyMoves as enemyMove, i (i)}
  {#if showEnemyMove(enemyMove.from, $suggestedFriendlyMoves)}
    <Highlight
      color={getEnemyMoveColor(i)}
      x={enemyMove.from.x}
      y={enemyMove.from.y}
    />
  {/if}
  {#if showEnemyMove(enemyMove.to, $suggestedFriendlyMoves)}
    <Highlight
      color={getEnemyMoveColor(i)}
      x={enemyMove.to.x}
      y={enemyMove.to.y}
    />
  {/if}
{/each}
