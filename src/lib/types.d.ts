/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
  userid: string;
}

export interface Cell {
  id: string;
  value: number;
  position: CellPos;
  merged: boolean = false;
}

export interface CellPos {
  x: number;
  y: number;
}

export type Board = Map<{x: number, y: number}, Cell[]>
