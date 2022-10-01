<script lang="ts">
  import Highlight from "./Highlight.svelte";
  import { suggestedBestMove, suggestedPonder } from "../../state";
</script>

{#if $suggestedBestMove}
  <Highlight
    color="green"
    x={$suggestedBestMove.from.x}
    y={$suggestedBestMove.from.y}
  />
{/if}
{#if $suggestedPonder}
  <Highlight
    color="red"
    x={$suggestedPonder.from.x}
    y={$suggestedPonder.from.y}
  />
{/if}
