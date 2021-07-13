import type { Cell } from "./types";

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
export function genCell(x: number, y: number): Cell {
  return {
    id: uuid(),
    value: Math.pow(2, Math.floor(Math.random() * 2 + 1)),
    position: { x, y },
    merged: true
  }
}
