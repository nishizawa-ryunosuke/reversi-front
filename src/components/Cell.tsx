"use client";

import { BLACK, WHITE, EMPTY } from "@/utils/const";

import { useState } from "react";

export type CellValue = typeof BLACK | typeof WHITE | typeof EMPTY;

interface CellProps {
  value: CellValue;
  row: number;
  col: number;
  isValidMove?: boolean;
  onClick?: (row: number, col: number) => void;
}

export default function Cell({
  value,
  row,
  col,
  isValidMove = false,
  onClick,
}: CellProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick && (isValidMove || value === EMPTY)) {
      onClick(row, col);
    }
  };

  return (
    <div
      className={`
        w-full h-full relative flex items-center justify-center 
        bg-emerald-600 border border-black
        ${isValidMove && isHovered ? "bg-green-500 dark:bg-green-700" : ""}
        ${isValidMove ? "cursor-pointer" : ""}
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {value !== EMPTY && (
        <div
          className={`
            w-4/5 h-4/5 rounded-full transition-all duration-300 transform
            ${
              value === BLACK ? "bg-black" : "bg-white border border-gray-200"
            }
            ${isHovered && isValidMove ? "scale-75 opacity-50" : "scale-100"}
          `}
        />
      )}
      {isValidMove && value === EMPTY && isHovered && (
        <div className="w-2/5 h-2/5 rounded-full bg-current opacity-30" />
      )}
    </div>
  );
}
