"use client";

import { useEffect, useState } from "react";

interface Props {
  running: boolean;
  durationMinutes?: number;
}

export default function SessionTimer({ running, durationMinutes = 30 }: Props) {
  const [seconds, setSeconds] = useState(durationMinutes * 60);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  const isLow = seconds < 300; // last 5 min

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-md font-bold transition-colors ${
        isLow && running
          ? "bg-error/10 text-error"
          : "bg-surface-container text-on-surface-variant"
      }`}
    >
      <span className="material-symbols-outlined text-[14px]">schedule</span>
      {m}:{s}
    </div>
  );
}
