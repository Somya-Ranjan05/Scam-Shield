// client/src/components/result/RiskScoreGauge.jsx
import React from "react";

export default function RiskScoreGauge({ score = 0, tier = "safe", size = 180 }) {
  // SVG circular arc calculations
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree semi-circle arc (offset starts from bottom-left)
  const angle = 270;
  const arcLength = (circumference * angle) / 360;
  const fillLength = (score / 100) * arcLength;

  let colorClass = "#10b981"; // safe emerald
  let glowColor = "rgba(16, 185, 129, 0.35)";

  if (tier === "confirmed_scam" || score >= 75) {
    colorClass = "#ef4444"; // critical red
    glowColor = "rgba(239, 68, 68, 0.4)";
  } else if (tier === "dangerous" || score >= 50) {
    colorClass = "#f97316"; // orange
    glowColor = "rgba(249, 115, 22, 0.35)";
  } else if (tier === "suspicious" || score >= 25) {
    colorClass = "#f59e0b"; // amber
    glowColor = "rgba(245, 158, 11, 0.35)";
  }

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-[135deg]">
        {/* Background Track Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />

        {/* Foreground Value Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={`${fillLength} ${circumference}`}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 10px ${glowColor})`,
          }}
        />
      </svg>

      {/* Centered Score Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
        <span className="text-4xl font-extrabold tracking-tight text-white">
          {score}
        </span>
        <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          Risk Index / 100
        </span>
      </div>
    </div>
  );
}
