"use client";

import { useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import useGame from "@/hooks/useGame";

export default function GamePage() {
  const {
    board,
    currentPlayer,
    validMoves,
    gameOver,
    blackCount,
    whiteCount,
    makeMove,
    resetGame,
  } = useGame();

  useEffect(() => {
    // ゲーム開始時にリセット
    resetGame();
  }, [resetGame]);

  return (
    <GameLayout
      title="Reverise"
      board={board}
      currentPlayer={currentPlayer}
      validMoves={validMoves}
      gameOver={gameOver}
      blackCount={blackCount}
      whiteCount={whiteCount}
      onCellClick={makeMove}
      onResetGame={resetGame}
      showNoMovesMessage={!gameOver && validMoves.length === 0}
    />
  );
}
