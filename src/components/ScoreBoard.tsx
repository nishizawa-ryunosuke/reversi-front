"use client";

import { CellValue } from "./Cell";
import { BLACK} from "@/utils/const";

interface ScoreBoardProps {
  blackCount: number;
  whiteCount: number;
  currentPlayer: CellValue;
  onResetGame: () => void;
}

export default function ScoreBoard({
  blackCount,
  whiteCount,
  currentPlayer,
  onResetGame,
}: ScoreBoardProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-md shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-full"></div>
          <span className="text-xl font-bold">{blackCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">{whiteCount}</span>
          <div className="w-6 h-6 bg-white border border-gray-300 rounded-full"></div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-2">
        <span className="text-lg">現在の手番:</span>
        <div
          className={`w-6 h-6 rounded-full ${
            currentPlayer === BLACK
              ? "bg-black"
              : "bg-white border border-gray-300"
          }`}
        ></div>
      </div>

      <button
        onClick={onResetGame}
        className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
      >
        ゲームをリセット
      </button>
    </div>
  );
}
