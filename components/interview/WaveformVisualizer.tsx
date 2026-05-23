"use client";

import { motion } from "framer-motion";

interface Props {
  isActive: boolean;
  isSpeaking: boolean;
}

const BARS = 24;

export default function WaveformVisualizer({ isActive, isSpeaking }: Props) {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {Array.from({ length: BARS }).map((_, i) => {
        const delay = (i / BARS) * 0.6;
        const maxH = 12 + Math.sin((i / BARS) * Math.PI) * 40;

        return (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: 4,
              background: isActive
                ? "linear-gradient(to top, #006a61, #6bd8cb)"
                : "#c6c6cd",
            }}
            animate={
              isSpeaking && isActive
                ? {
                    height: [4, maxH, 4],
                    opacity: [0.6, 1, 0.6],
                  }
                : isActive
                ? { height: [4, 8, 4], opacity: 0.5 }
                : { height: 4, opacity: 0.3 }
            }
            transition={
              isSpeaking && isActive
                ? {
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: Infinity,
                    delay,
                    ease: "easeInOut",
                  }
                : isActive
                ? { duration: 1.5, repeat: Infinity, delay, ease: "easeInOut" }
                : { duration: 0.3 }
            }
          />
        );
      })}
    </div>
  );
}
