"use client";

import { ReactNode, useState, useEffect } from "react";
import GameBoard from "./GameBoard";
import ScoreBoard from "./ScoreBoard";
import ResultModal from "./ResultModal";
import { CellValue } from "./Cell";

interface GameLayoutProps {
  title: string;
  board: CellValue[][];
  currentPlayer: CellValue;
  validMoves: { row: number; col: number }[];
  gameOver: boolean;
  blackCount: number;
  whiteCount: number;
  onCellClick: (row: number, col: number) => void;
  onResetGame: () => void;
  showNoMovesMessage: boolean;
  children?: ReactNode;
}

export default function GameLayout({
  title,
  board,
  currentPlayer,
  validMoves,
  gameOver,
  blackCount,
  whiteCount,
  onCellClick,
  onResetGame,
  showNoMovesMessage,
  children,
}: GameLayoutProps) {
  const [showResultModal, setShowResultModal] = useState(false);

  // ゲーム終了時にモーダルを表示
  useEffect(() => {
    if (gameOver) {
      setShowResultModal(true);
    }
  }, [gameOver]);

  // モーダルを閉じる
  const handleCloseModal = () => {
    setShowResultModal(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 gap-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-center">
        <GameBoard
          board={board}
          validMoves={validMoves}
          onCellClick={onCellClick}
        />

        <div className="w-full max-w-md">
          {children}

          <ScoreBoard
            blackCount={blackCount}
            whiteCount={whiteCount}
            currentPlayer={currentPlayer}
            onResetGame={onResetGame}
          />

          {!gameOver && showNoMovesMessage && (
            <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-md">
              <p className="text-center">有効な手がありません。パスします。</p>
            </div>
          )}
        </div>
      </div>

      {/* 結果モーダル */}
      <ResultModal
        isOpen={showResultModal}
        blackCount={blackCount}
        whiteCount={whiteCount}
        onClose={handleCloseModal}
        onRestart={onResetGame}
      />
    </main>
  );
}
