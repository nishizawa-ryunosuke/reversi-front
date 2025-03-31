"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { CellValue } from "@/components/Cell";
import { DIRECTIONS } from "@/utils/const";
import { BLACK, WHITE, EMPTY } from "@/utils/const";

// 型定義
type Position = {
  row: number;
  col: number;
};

type BoardState = CellValue[][];

// リバーシゲームフック
export default function useGame() {
  // 状態管理
  const [board, setBoard] = useState<BoardState>(() => initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState<CellValue>(BLACK);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [blackCount, setBlackCount] = useState(2);
  const [whiteCount, setWhiteCount] = useState(2);

  // ボードの初期化（8x8の二次元配列）
  function initializeBoard(): BoardState {
    const board: BoardState = Array(8)
      .fill(null)
      .map(() => Array(8).fill(EMPTY));
    // 初期配置
    board[3][3] = WHITE;
    board[3][4] = BLACK;
    board[4][3] = BLACK;
    board[4][4] = WHITE;
    return board;
  }

  // 対戦相手の石の色を取得
  const getOpponent = useMemo(() => {
    return (player: CellValue): CellValue =>
      player === BLACK ? WHITE : BLACK;
  }, []);

  // ボード操作関連の関数
  // 特定の位置がプレイヤーにとって有効な手かどうかをチェック
  const isValidMove = useCallback(
    (
      board: BoardState,
      row: number,
      col: number,
      player: CellValue
    ): boolean => {
      if (board[row][col] !== EMPTY) return false;

      const opponent = getOpponent(player);

      for (const [dRow, dCol] of DIRECTIONS) {
        let r = row + dRow;
        let c = col + dCol;
        let foundOpponent = false;

        // ボードの範囲内で相手の石を見つける
        while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === opponent) {
          r += dRow;
          c += dCol;
          foundOpponent = true;
        }

        // 相手の石の後に自分の石があれば有効な手
        if (
          foundOpponent &&
          r >= 0 &&
          r < 8 &&
          c >= 0 &&
          c < 8 &&
          board[r][c] === player
        ) {
          return true;
        }
      }

      return false;
    },
    [getOpponent]
  );

  // ボード上の有効な手を見つける
  const findValidMoves = useCallback(
    (board: BoardState, player: CellValue): Position[] => {
      const moves: Position[] = [];

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (board[row][col] !== EMPTY) continue;

          // この位置が有効かどうかチェック
          if (isValidMove(board, row, col, player)) {
            moves.push({ row, col });
          }
        }
      }

      return moves;
    },
    [isValidMove]
  );

  // 石のカウントを更新
  const updateCounts = useCallback((board: BoardState): void => {
    let black = 0;
    let white = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === BLACK) black++;
        else if (board[row][col] === WHITE) white++;
      }
    }

    setBlackCount(black);
    setWhiteCount(white);
  }, []);

  // ゲーム操作関連の関数
  // 石を置いて挟まれた相手の石をひっくり返す
  const makeMove = useCallback(
    (row: number, col: number): boolean => {
      if (!validMoves.some((move) => move.row === row && move.col === col)) {
        return false; // 無効な手
      }

      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = currentPlayer;

      const opponent = getOpponent(currentPlayer);

      // 全方向をチェック
      for (const [dRow, dCol] of DIRECTIONS) {
        let r = row + dRow;
        let c = col + dCol;
        const flips: Position[] = [];

        // この方向に沿って相手の石を見つける
        while (
          r >= 0 &&
          r < 8 &&
          c >= 0 &&
          c < 8 &&
          newBoard[r][c] === opponent
        ) {
          flips.push({ row: r, col: c });
          r += dRow;
          c += dCol;
        }

        // この方向の最後に自分の石があれば、間の石をすべてひっくり返す
        if (
          flips.length > 0 &&
          r >= 0 &&
          r < 8 &&
          c >= 0 &&
          c < 8 &&
          newBoard[r][c] === currentPlayer
        ) {
          for (const { row: flipRow, col: flipCol } of flips) {
            newBoard[flipRow][flipCol] = currentPlayer;
          }
        }
      }

      setBoard(newBoard);

      // 石のカウントを更新
      updateCounts(newBoard);

      // 次のプレイヤーへ
      const nextPlayer = getOpponent(currentPlayer);

      // 次のプレイヤーの有効な手をチェック
      const nextMoves = findValidMoves(newBoard, nextPlayer);

      if (nextMoves.length > 0) {
        setCurrentPlayer(nextPlayer);
        setValidMoves(nextMoves);
      } else {
        // 次のプレイヤーが手がない場合、現在のプレイヤーが続行
        const currentMoves = findValidMoves(newBoard, currentPlayer);

        if (currentMoves.length > 0) {
          setValidMoves(currentMoves);
          // プレイヤーは変わらない
        } else {
          // どちらのプレイヤーも手がない場合、ゲーム終了
          setGameOver(true);
          setValidMoves([]);
        }
      }

      return true;
    },
    [
      board,
      currentPlayer,
      findValidMoves,
      getOpponent,
      updateCounts,
      validMoves,
    ]
  );

  // ゲームをリセット
  const resetGame = useCallback(() => {
    const newBoard = initializeBoard();
    setBoard(newBoard);
    setCurrentPlayer(BLACK);
    setValidMoves(findValidMoves(newBoard, BLACK));
    setGameOver(false);
    setBlackCount(2);
    setWhiteCount(2);
  }, [findValidMoves]);

  // ゲーム開始時に有効な手を計算
  useEffect(() => {
    setValidMoves(findValidMoves(board, currentPlayer));
  }, [board, currentPlayer, findValidMoves]);

  return {
    board,
    currentPlayer,
    validMoves,
    gameOver,
    blackCount,
    whiteCount,
    makeMove,
    resetGame,
  };
}
