import type { Cell } from "./types";
import { genCell } from "./utils";
import { writable } from 'svelte/store'

/**
 * TODO: GameEngine Storeを作って、 ボードの状況, 得点, その他フラグを
 * 一つのStoreで管理する
 */
interface GameState {
  board: Cell[],
  moved: boolean,
  score: number,
  gameover: boolean;
}

// 
const createGame = () => {
  const { subscribe, set, update } = writable<GameState>(
    {board: initBoard(), moved: false, score: 0, gameover: false}
  );

  return {
    subscribe,
    set,
    update,
    move: (key) => update(v => {
      const {moved, board} = move(v.board, key);
      
      return {...v, moved, board};
    }),
    merge: () => update(merge),
    genRandom: () => update(v => {
      const b = v.board;
      const rand = randomCell(b);

      let gameover = false;
      if (!rand) {
        // ゲームオーバーの確認
        gameover = isGameover(b)
      }

      return {...v, board: (rand ? [...b, rand] : b), gameover};
    })

    // TODO: ゲームオーバーの処理
  }
}

export const game = createGame();

function isGameover(board: Cell[]): boolean {

  console.log(board);
  if (board.length !== 16 ) return false;

  const sorted = board.map(v => ({
      pos: v.position.x + v.position.y * 4,
      value: v.value
    }))
    .sort((a, b) => a.pos - b.pos);

  console.log(sorted);

  // 全てのマスの左右上下に同じ数字のものがあるかチェックする
  let gameover = true;
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const currentValue = sorted[x + y * 4].value;
      // 上下左右
      for (const {dx, dy} of [{dx: -1, dy: 0}, {dx: 1, dy: 0}, {dx: 0, dy: -1}, {dx: 0, dy: 1}]) {
        const px = x + dx;
        const py = y + dy;

        if (px < 0 || px > 3 || py < 0 || py > 3) continue;

        if (sorted[px + py * 4].value === currentValue) {
          gameover = false;
          break;
        }
      }
    }
  }

  return gameover;
}

// 同じ場所にあるセルを合体させる
function merge(b: GameState): GameState {

  const merged: Cell[] = Array(16).fill(null);

  const newState = Object.assign({}, b);
  b.board.forEach(cell => {
    const idx = cell.position.x + cell.position.y * 4;

    if (merged[idx] === null) {
      merged[idx] = cell;
    } else {
      merged[idx].value += cell.value;
      merged[idx].merged = true;

      newState.score += cell.value * 2;
    }
  })

  newState.board = merged.filter(v => v);
  return newState;
}

function initBoard(): Cell[] {
  // Alt Range 0..15
  return [randomCell([])];
}
 
function move(b: Cell[], key: string): {moved: boolean, board: Cell[]} {

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

  return {moved, board: newBoards};
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