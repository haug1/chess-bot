<script lang="ts">
  export let color: string;
  export let x: number, y: number;

  $: style = `--highlight-color:${color};`;
  $: classes = `highlight square-${x}${y}`;
</script>

<div class={classes} {style}></div>

<style>
  div {
    background-color: var(--highlight-color, green);
    opacity: var(--highlight-opacity, 0.5);
  }
</style>
