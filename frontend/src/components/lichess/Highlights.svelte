<script lang="ts">
  import Highlight from "./Highlight.svelte";
  import {
    suggestedEnemyMoves,
    suggestedFriendlyMoves,
    type Move,
  } from "../../state";
  import {
    getEnemyMoveColor,
    getFriendlyMoveColor,
    showEnemyMove,
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
</script>

{#each friendlyMoves as move, i (i)}
  <Highlight color={getFriendlyMoveColor(i)} x={move.from.x} y={move.from.y} />
  <Highlight color={getFriendlyMoveColor(i)} x={move.to.x} y={move.to.y} />
{/each}
{#each enemyMoves as move, i (i)}
  {#if showEnemyMove(move.from, friendlyMoves)}
    <Highlight color={getEnemyMoveColor(i)} x={move.from.x} y={move.from.y} />
  {/if}
  {#if showEnemyMove(move.to, enemyMoves)}
    <Highlight color={getEnemyMoveColor(i)} x={move.to.x} y={move.to.y} />
  {/if}
{/each}
