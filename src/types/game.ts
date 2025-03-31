
import { BLACK, WHITE, EMPTY } from "@/utils/const";

// ゲームのセル（マス目）の値
export type CellValue = typeof BLACK | typeof WHITE | typeof EMPTY;

// ボードの状態（8x8の二次元配列）
export type BoardState = CellValue[][];

// 位置（行と列）
export interface Position {
  row: number;
  col: number;
}

// ゲームの状態
export interface GameState {
  board: BoardState;
  currentPlayer: CellValue;
  blackCount: number;
  whiteCount: number;
  gameOver: boolean;
}
