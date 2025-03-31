"use client";

import { useCallback, useState } from "react";
import useGame from "./useGame";
import { CellValue } from "@/components/Cell";
import { BLACK, WHITE, EMPTY } from "@/utils/const";

// CPU難易度レベル
export type CpuLevel = "beginner" | "intermediate" | "advanced";

export default function useCpuGame() {
  const game = useGame();
  const [cpuLevel, setCpuLevel] = useState<CpuLevel>("beginner");
  const [isCpuTurn, setIsCpuTurn] = useState(false);
  const [isCpuThinking, setIsCpuThinking] = useState(false);

  // CPU難易度を設定
  const setCpuDifficulty = useCallback((level: CpuLevel) => {
    setCpuLevel(level);
  }, []);

  // 評価関数：ボード上の位置の価値を評価（戦略的価値）
  const positionValues = [
    [100, -10, 10, 5, 5, 10, -10, 100],
    [-10, -20, 1, 1, 1, 1, -20, -10],
    [10, 1, 5, 2, 2, 5, 1, 10],
    [5, 1, 2, 1, 1, 2, 1, 5],
    [5, 1, 2, 1, 1, 2, 1, 5],
    [10, 1, 5, 2, 2, 5, 1, 10],
    [-10, -20, 1, 1, 1, 1, -20, -10],
    [100, -10, 10, 5, 5, 10, -10, 100],
  ];

  // 初級レベルのCPUの手を決定（ランダム選択）
  const beginnerCpuMove = useCallback(() => {
    const validMoves = game.validMoves;
    if (validMoves.length === 0) return null;

    // ランダムに手を選択
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  }, [game.validMoves]);

  // 中級レベルのCPUの手を決定（簡単な戦略あり）
  const intermediateCpuMove = useCallback(() => {
    const validMoves = game.validMoves;
    if (validMoves.length === 0) return null;

    // 各手の価値を計算し、最も価値の高い手を選択
    let bestScore = -Infinity;
    let bestMove = validMoves[0];

    for (const move of validMoves) {
      const score = positionValues[move.row][move.col];
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    // 80%の確率で最適な手を選び、20%の確率でランダムな手を選ぶ
    if (Math.random() < 0.8) {
      return bestMove;
    } else {
      const randomIndex = Math.floor(Math.random() * validMoves.length);
      return validMoves[randomIndex];
    }
  }, [game.validMoves, positionValues]);

  // 上級レベルのCPUの手を決定（ミニマックス法、深さ3）
  const advancedCpuMove = useCallback(() => {
    const validMoves = game.validMoves;
    if (validMoves.length === 0) return null;

    const cpuColor = game.currentPlayer;
    const opponentColor = cpuColor === BLACK ? WHITE : BLACK;

    // ボードの現在の状態をコピー
    const simulateBoard = (board: CellValue[][]) => {
      return board.map((row) => [...row]);
    };

    // 指定した位置に置いた場合のボードの状態を計算
    const simulateMove = (
      board: CellValue[][],
      row: number,
      col: number,
      player: CellValue
    ) => {
      const newBoard = simulateBoard(board);
      newBoard[row][col] = player;

      // 8方向をチェックして挟まれた石をひっくり返す
      const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];

      const opponent = player === BLACK ? WHITE : BLACK;

      for (const [dRow, dCol] of directions) {
        let r = row + dRow;
        let c = col + dCol;
        const flips: { row: number; col: number }[] = [];

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
          newBoard[r][c] === player
        ) {
          for (const { row: flipRow, col: flipCol } of flips) {
            newBoard[flipRow][flipCol] = player;
          }
        }
      }

      return newBoard;
    };

    // ボードの状態を評価
    const evaluateBoard = (board: CellValue[][], player: CellValue) => {
      let score = 0;
      const opponent = player === BLACK ? WHITE : BLACK;

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (board[row][col] === player) {
            score += positionValues[row][col];
          } else if (board[row][col] === opponent) {
            score -= positionValues[row][col];
          }
        }
      }

      return score;
    };

    // ミニマックスアルゴリズム
    const minimax = (
      board: CellValue[][],
      depth: number,
      player: CellValue,
      isMaximizing: boolean
    ): number => {
      if (depth === 0) {
        return evaluateBoard(board, cpuColor);
      }

      // 有効な手を見つける
      const moves: { row: number; col: number }[] = [];
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (board[row][col] === EMPTY) {
            // 周囲に石があるか確認（簡略化）
            let hasAdjacentStone = false;
            for (const [dRow, dCol] of [
              [-1, -1],
              [-1, 0],
              [-1, 1],
              [0, -1],
              [0, 1],
              [1, -1],
              [1, 0],
              [1, 1],
            ]) {
              const newRow = row + dRow;
              const newCol = col + dCol;
              if (
                newRow >= 0 &&
                newRow < 8 &&
                newCol >= 0 &&
                newCol < 8 &&
                board[newRow][newCol] !== EMPTY
              ) {
                hasAdjacentStone = true;
                break;
              }
            }
            if (hasAdjacentStone) {
              moves.push({ row, col });
            }
          }
        }
      }

      if (moves.length === 0) {
        return evaluateBoard(board, cpuColor);
      }

      if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of moves) {
          const newBoard = simulateMove(board, move.row, move.col, player);
          const evalValue = minimax(
            newBoard,
            depth - 1,
            player === BLACK ? WHITE : BLACK,
            false
          );
          maxEval = Math.max(maxEval, evalValue);
        }
        return maxEval;
      } else {
        let minEval = Infinity;
        for (const move of moves) {
          const newBoard = simulateMove(board, move.row, move.col, player);
          const evalValue = minimax(
            newBoard,
            depth - 1,
            player === BLACK ? WHITE : BLACK,
            true
          );
          minEval = Math.min(minEval, evalValue);
        }
        return minEval;
      }
    };

    // 各手の評価値を計算
    let bestScore = -Infinity;
    let bestMove = validMoves[0];

    for (const move of validMoves) {
      const newBoard = simulateMove(game.board, move.row, move.col, cpuColor);
      // 深さ3のミニマックス探索
      const score = minimax(newBoard, 3, opponentColor, false);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }, [game.validMoves, game.currentPlayer, game.board, positionValues]);

  // CPUの手を決定
  const determineCpuMove = useCallback(() => {
    switch (cpuLevel) {
      case "beginner":
        return beginnerCpuMove();
      case "intermediate":
        return intermediateCpuMove();
      case "advanced":
        return advancedCpuMove();
      default:
        return beginnerCpuMove();
    }
  }, [cpuLevel, beginnerCpuMove, intermediateCpuMove, advancedCpuMove]);

  // CPUのターンを実行
  const executeCpuTurn = useCallback(() => {
    if (!isCpuTurn || game.gameOver) return;

    setIsCpuThinking(true);

    // CPUの思考時間
    const thinkingTime = 500;

    setTimeout(() => {
      const move = determineCpuMove();
      if (move) {
        game.makeMove(move.row, move.col);
      }
      setIsCpuTurn(false);
      setIsCpuThinking(false);
    }, thinkingTime);
  }, [isCpuTurn, game, cpuLevel, determineCpuMove]);

  // プレイヤーの手を処理
  const handlePlayerMove = useCallback(
    (row: number, col: number) => {
      if (isCpuTurn || isCpuThinking || game.gameOver) return false;

      const success = game.makeMove(row, col);
      if (success && !game.gameOver) {
        setIsCpuTurn(true);
      }
      return success;
    },
    [game, isCpuTurn, isCpuThinking]
  );

  // ゲームのリセット
  const resetGame = useCallback(() => {
    game.resetGame();
    setIsCpuTurn(false);
    setIsCpuThinking(false);
  }, [game]);

  // CPUとの対戦を開始
  const startCpuGame = useCallback(
    (level: CpuLevel, cpuStarts: boolean = false) => {
      resetGame();
      setCpuDifficulty(level);
      setIsCpuTurn(cpuStarts);
    },
    [resetGame, setCpuDifficulty]
  );

  // CPUのターンを実行
  if (isCpuTurn && !isCpuThinking && !game.gameOver) {
    executeCpuTurn();
  }

  return {
    ...game,
    cpuLevel,
    isCpuTurn,
    isCpuThinking,
    setCpuDifficulty,
    handlePlayerMove,
    startCpuGame,
    resetGame,
  };
}
