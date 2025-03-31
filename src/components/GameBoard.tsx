"use client";

import Cell, { CellValue } from "./Cell";

interface GameBoardProps {
  board: CellValue[][];
  validMoves: { row: number; col: number }[];
  onCellClick: (row: number, col: number) => void;
}

export default function GameBoard({
  board,
  validMoves,
  onCellClick,
}: GameBoardProps) {
  const isValidMove = (row: number, col: number) => {
    return validMoves.some((move) => move.row === row && move.col === col);
  };

  return (
    <div className="w-full max-w-md aspect-square bg-emerald-800 overflow-hidden">
      <div className="grid grid-cols-8 grid-rows-8 h-full w-full border border-black">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              row={rowIndex}
              col={colIndex}
              isValidMove={isValidMove(rowIndex, colIndex)}
              onClick={onCellClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
