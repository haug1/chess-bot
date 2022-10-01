<script lang="ts">
  import { hideHighlights } from "../../state";

  export let color: string;
  export let cx: number = 0;
  export let cy: number = 0;
</script>

<circle
  {cx}
  {cy}
  stroke={color}
  opacity={$hideHighlights ? 0 : 1}
  r="0.4"
  stroke-width="0.1"
  fill="none"
/>
