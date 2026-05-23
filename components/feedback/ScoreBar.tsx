"use client";

import { motion } from "framer-motion";

interface Props {
  name: string;
  score: number;
  comment: string;
  index: number;
}

export default function ScoreBar({ name, score, comment, index }: Props) {
  const color =
    score >= 75 ? "#006a61" : score >= 50 ? "#d97706" : "#ba1a1a";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-body-sm font-semibold text-on-surface">{name}</span>
        <span className="text-body-sm font-bold" style={{ color }}>
          {score}/100
        </span>
      </div>

      {/* Track */}
      <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: index * 0.08 + 0.2, ease: "easeOut" }}
        />
      </div>

      <p className="text-body-sm text-on-surface-variant">{comment}</p>
    </motion.div>
  );
}
