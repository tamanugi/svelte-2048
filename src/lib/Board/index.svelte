<script lang="ts">
  import Cell from '$lib/Cell/index.svelte';

  export let board: number[];
</script>

<div class="board">
  {#each board as cell}
    <Cell {cell}></Cell>
  {/each}
</div>

<style>
.board {
  display: inline-grid;
  grid-template-columns: repeat(4, 64px);
  row-gap: 10px;
  column-gap: 10px;
  background-color: #F5ACC9;
  border-radius: 10px;
  padding: 10px;
}

</style>