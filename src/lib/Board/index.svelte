<script lang="ts">
  import Cell from '$lib/Cell/index.svelte';
  import { board } from '$lib/game';
  import { flip } from 'svelte/animate';

  const size = 4;
  let movable = true;
  function handleKeyDown(event: KeyboardEvent) {
    if (movable && event.key.startsWith('Arrow')) {
      movable = false;
      board.move(event.key);

      // 少し遅れて圧縮させる
      setTimeout(() => {
        board.merge();

        // さらに遅れてランダム生成
        setTimeout(() => {
          board.genRandom();
          movable = true;
        }, 200)
      }, 100)
    }
  }

  function cellPositionStyle({x, y}) {
    return 'top: ' + (y * 64 + (y + 1) * 10) + 'px;' +
      'left: ' + (x * 64 + (x + 1) * 10) + 'px;';
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="container">
  <div class="grid-container">
    {#each Array(size * size) as _}
      <div class="grid"></div>
    {/each}

  </div>

  <div class="cell-container">
    {#each $board as cell (cell.id)}
      <div class="cell-wrapper"
        style="{cellPositionStyle(cell.position)}"
        animate:flip={{duration: 200}}
        >
        <Cell value={cell.value} merged={cell.merged}></Cell>
      </div>
    {/each}
  </div>
</div>


<style>
.container {
  position: relative;
  padding: 10px;
}
.grid-container {
  position: absolute;
  display: inline-grid;
  grid-template-columns: repeat(4, 64px);
  row-gap: 10px;
  column-gap: 10px;
  background-color: #b4b6c2;
  border-radius: 10px;
  padding: 10px;
}

.cell-container {
  position: absolute;
  padding: 10px;
}

.cell-wrapper {
  position: absolute;
}

.grid {
  content: "";
  width: 64px;
  height: 64px;
  background-color: #CECECE;
  box-shadow: 3px 3px 3px grey;
  border-radius: 3px;
}

</style>