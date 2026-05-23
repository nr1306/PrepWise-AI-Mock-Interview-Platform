"use client";

import { motion } from "framer-motion";

interface Props {
  score: number; // 0–100
  size?: number;
}

export default function ConfidenceRing({ score, size = 120 }: Props) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? "#006a61" : score >= 50 ? "#d97706" : "#ba1a1a";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e4e2e4"
          strokeWidth={8}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Label */}
        <text
          x={size / 2}
          y={size / 2 + 6}
          textAnchor="middle"
          fill="#1b1b1d"
          fontSize={size > 100 ? 22 : 16}
          fontWeight={700}
          fontFamily="Inter, sans-serif"
        >
          {score}
        </text>
      </svg>
      <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
        Confidence Score
      </span>
    </div>
  );
}
