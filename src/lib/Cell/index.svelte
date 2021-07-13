<script lang="ts">
  import { scale } from 'svelte/transition';

  export let value:number;
  export let merged:boolean = false;

  function calcHsl(cell: number) {
    if (cell === 0) {
      return '#CECECE';
    }

    const n = Math.log2(cell);
    return `hsl(${50 + (20 * n)}, 72%, 72%)`
  }

  function style(value) {
    return 'background-color: '+ calcHsl(value)
  }
</script>

<div class="cell" class:merged={merged} style={style(value)}>
  {value}
</div>

<style lang="scss">
.cell {
  display: flex;
  width: 64px;
  height: 64px;
  justify-content: center;
  align-items: center;

  border-radius: 3px;
  color: white;
  font-weight: bold;
  box-shadow: 3px 3px 3px grey;
}

.merged {
  animation: pop 200ms ease 100ms;
}

@keyframes pop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>