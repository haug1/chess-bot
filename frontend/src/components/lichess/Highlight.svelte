<script lang="ts">
  export let color: string;
  export let x: number = 0;
  export let y: number = 0;
</script>

<circle
  cx={x}
  cy={y}
  stroke={color}
  opacity="1"
  r="0.4"
  stroke-width="0.1"
  fill="none"
/>
