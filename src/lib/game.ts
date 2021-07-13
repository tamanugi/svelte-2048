import type { Cell } from "./types";
import { genCell } from "./utils";
import { writable } from 'svelte/store'

const createBoard = () => {
  const { subscribe, set, update } = writable(initBoard());

  return {
    subscribe,
    move: (key) => update(v => move(v, key)),
    merge: () => update(v => merge(v)),
    genRandom: () => update(v => {
      const rand = randomCell(v);

      return rand ? [...v, rand] : v;
    })
  }
}

export const board = createBoard();

// 同じ場所にあるセルを合体させる
function merge(b: Cell[]): Cell[] {

  const merged: Cell[] = Array(16).fill(null);

  b.forEach(cell => {
    const idx = cell.position.x + cell.position.y * 4;

    if (merged[idx] === null) {
      merged[idx] = cell;
    } else {
      merged[idx].value += cell.value;
      merged[idx].merged = true;
    }
  })

  return merged.filter(v => v);
}

function initBoard(): Cell[] {
  // Alt Range 0..15
  return [randomCell([])];
}
 
function move(b: Cell[], key: string): Cell[] {

  // mergedフラグを下げる
  b.forEach(cell => cell.merged = false);

  const {reverse, main, cross} = direction(key);

  let moved = false;
  const newBoards = [];
  for (let k = 0; k < 4; k++) {
    // 同じ行/列の配列を取り出す
    const tmpCells = b.filter(cell => cell.position[cross] === k)
      .sort((a, b) => a.position[main] - b.position[main]);

    if (reverse) tmpCells.reverse()

    let pre = null;
    let curPos = 0;
    for (const cell of tmpCells) {
      const p = reverse ? 3 - curPos : curPos;
      if (pre?.value === cell.value) {
        cell.position = pre.position;
        pre = null;
        moved = true;
      } else {
        if(!moved) moved = cell.position[main] !== p;

        cell.position[main] = p;
        pre = cell;
        curPos++;
      }

      newBoards.push(cell);
    }
  }

  if (!moved) {
    return b;
  }

  return newBoards;
}

function randomCell(b: Cell[]) {
  // 生成できるところの候補を見つける
  const filled = b.map(cell => cell.position.x + (cell.position.y * 4))

  const candinates = 
  Array.from(Array(16))
    .map((_v, idx) => idx)
    .filter(i => !filled.includes(i));

  if (candinates.length === 0) return null;

  const idx = candinates[Math.floor(Math.random() * candinates.length)];

  return genCell(Math.floor(idx % 4), Math.floor(idx / 4));
} 

interface Direction {
  reverse: boolean;
  main: 'x' | 'y';
  cross: 'x' | 'y';
}
function direction(key): Direction {
  switch(key) {
  case 'ArrowUp':
    return {reverse: false, main: 'y', cross: 'x'};
  case 'ArrowDown':
    return {reverse: true, main: 'y', cross: 'x'};
  case 'ArrowLeft':
    return {reverse: false, main: 'x', cross: 'y'};
  case 'ArrowRight':
    return {reverse: true, main: 'x', cross: 'y'}
  }
}