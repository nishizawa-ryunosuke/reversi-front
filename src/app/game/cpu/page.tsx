"use client";

import { useEffect, useState } from "react";
import GameLayout from "@/components/GameLayout";
import useCpuGame from "@/hooks/useCpuGame";
import { CpuLevel } from "@/hooks/useCpuGame";
import CpuSettings from "@/components/CpuSettings";

export default function GameCpuPage() {
  const {
    board,
    currentPlayer,
    validMoves,
    gameOver,
    blackCount,
    whiteCount,
    handlePlayerMove,
    resetGame,
    startCpuGame,
    cpuLevel,
    isCpuThinking,
    setCpuDifficulty,
  } = useCpuGame();

  const [cpuStarts, setCpuStarts] = useState(false);

  useEffect(() => {
    // ゲーム開始時にリセット
    startCpuGame(cpuLevel, cpuStarts);
  }, []);

  const handleCpuLevelChange = (level: CpuLevel) => {
    setCpuDifficulty(level);
    startCpuGame(level, cpuStarts);
  };

  const handleCpuStartsChange = (starts: boolean) => {
    setCpuStarts(starts);
    startCpuGame(cpuLevel, starts);
  };

  return (
    <GameLayout
      title="- CPU mode -"
      board={board}
      currentPlayer={currentPlayer}
      validMoves={validMoves}
      gameOver={gameOver}
      blackCount={blackCount}
      whiteCount={whiteCount}
      onCellClick={handlePlayerMove}
      onResetGame={resetGame}
      showNoMovesMessage={
        !gameOver && validMoves.length === 0 && !isCpuThinking
      }
    >
      <CpuSettings
        cpuLevel={cpuLevel}
        cpuStarts={cpuStarts}
        onCpuLevelChange={handleCpuLevelChange}
        onCpuStartsChange={handleCpuStartsChange}
      />

      {isCpuThinking && (
        <div className="mt-4 mb-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-md">
          <p className="text-center">CPU Thinking...</p>
        </div>
      )}
    </GameLayout>
  );
}
