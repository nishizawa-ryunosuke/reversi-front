import React from "react";
import { CpuLevel } from "@/hooks/useCpuGame";

interface CpuSettingsProps {
  cpuLevel: CpuLevel;
  cpuStarts: boolean;
  onCpuLevelChange: (level: CpuLevel) => void;
  onCpuStartsChange: (starts: boolean) => void;
}

const CpuSettings: React.FC<CpuSettingsProps> = ({
  cpuLevel,
  cpuStarts,
  onCpuLevelChange,
  onCpuStartsChange,
}) => (
  <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-md shadow-md">
    <h2 className="text-xl font-bold mb-2">CPU設定</h2>
    <div className="mb-2">
      <h3 className="font-semibold mb-1">難易度:</h3>
      <div className="flex space-x-2">
        {["beginner", "intermediate", "advanced"].map((level) => (
          <button
            key={level}
            className={`px-3 py-1 rounded-md ${
              cpuLevel === level
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => onCpuLevelChange(level as CpuLevel)}
          >
            {level === "beginner"
              ? "初級"
              : level === "intermediate"
              ? "中級"
              : "上級"}
          </button>
        ))}
      </div>
    </div>
    <div>
      <h3 className="font-semibold mb-1">先攻:</h3>
      <div className="flex space-x-2">
        <button
          className={`px-3 py-1 rounded-md ${
            !cpuStarts
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
          onClick={() => onCpuStartsChange(false)}
        >
          プレイヤー(黒)
        </button>
        <button
          className={`px-3 py-1 rounded-md ${
            cpuStarts
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
          onClick={() => onCpuStartsChange(true)}
        >
          CPU(黒)
        </button>
      </div>
    </div>
  </div>
);

export default CpuSettings;
