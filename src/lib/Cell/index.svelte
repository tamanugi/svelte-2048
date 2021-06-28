<script lang="ts">
export let cell:number = 0;

function calcHsl(cell: number) {

  if (cell === 0) {
    return '#CECECE';
  }

  const n = Math.log2(cell);
  return `hsl(${50 + (20 * n)}, 72%, 72%)`
}

</script>

<div class="cell" style="{'background-color: ' + calcHsl(cell)}">
  {cell > 0 ? cell : ''}
</div>

<style>
.cell {
  display: flex;
  width: 64px;
  height: 64px;
  justify-content: center;
  align-items: center;

  border-radius: 10px;
  color: white;
  font-weight: bold;
  box-shadow: 3px 3px 3px grey;
}
</style>