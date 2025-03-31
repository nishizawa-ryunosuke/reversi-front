"use client";

import { useEffect, useState } from "react";

interface ResultModalProps {
  isOpen: boolean;
  blackCount: number;
  whiteCount: number;
  onClose: () => void;
  onRestart: () => void;
}

export default function ResultModal({
  isOpen,
  blackCount,
  whiteCount,
  onClose,
  onRestart,
}: ResultModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  // アニメーション用の状態管理
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  const result =
    blackCount > whiteCount
      ? "勝利しました！"
      : blackCount < whiteCount
      ? "敗北しました..."
      : "引き分けです";

  const resultClass =
    blackCount > whiteCount
      ? "text-emerald-600 dark:text-emerald-400"
      : blackCount < whiteCount
      ? "text-red-600 dark:text-red-400"
      : "text-yellow-600 dark:text-yellow-400";

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full transform transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">ゲーム終了</h2>

        <div className="flex justify-center items-center space-x-8 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-black rounded-full mb-2"></div>
            <span className="text-xl font-bold">{blackCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-white border border-gray-300 rounded-full mb-2"></div>
            <span className="text-xl font-bold">{whiteCount}</span>
          </div>
        </div>

        <p className={`text-2xl font-bold text-center mb-6 ${resultClass}`}>
          {result}
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onRestart}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
          >
            もう一度プレイ
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
