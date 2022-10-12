<script lang="ts">
  import Highlight from "./Highlight.svelte";
  import {
    state,
    suggestedEnemyMoves,
    suggestedFriendlyMoves,
  } from "../../state";
  import {
    getEnemyMoveColor,
    getFriendlyMoveColor,
  } from "../common/highlight-colors";
</script>

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
