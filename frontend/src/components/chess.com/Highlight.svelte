<script lang="ts">
  import { hideHighlights } from "../../state";

  export let color: string;
  export let x: number, y: number;

  $: style = `--highlight-color:${color};--highligh-opacity:${
    $hideHighlights ? 0 : 0.5
  }`;
  $: classes = `highlight square-${x}${y}`;
</script>

<div class={classes} {style} />

<style>
  div {
    background-color: var(--highlight-color, green);
    opacity: var(--highlight-opacity, 0.5);
  }
</style>
