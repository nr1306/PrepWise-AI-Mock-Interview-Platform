"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  index: number;
  question: string;
  score: number;
  comment: string;
  tip: string;
}

export default function QuestionFeedbackCard({ index, question, score, comment, tip }: Props) {
  const [open, setOpen] = useState(false);

  const color =
    score >= 80 ? "text-secondary" : score >= 60 ? "text-amber-600" : "text-error";
  const bg =
    score >= 80 ? "bg-secondary/10" : score >= 60 ? "bg-amber-50" : "bg-error/10";

  return (
    <div className="card p-5 flex flex-col gap-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-start justify-between gap-3 text-left w-full cursor-pointer"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-label-sm font-bold text-on-surface-variant shrink-0 mt-0.5">
            Q{index + 1}
          </span>
          <p className="text-body-sm font-medium text-on-surface line-clamp-2">{question}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className={`text-label-sm font-bold px-2.5 py-1 rounded-full ${bg} ${color}`}>
            {score}
          </span>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
            {open ? "expand_less" : "expand_more"}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-outline-variant flex flex-col gap-3">
              <p className="text-body-sm text-on-surface-variant">{comment}</p>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/5">
                <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">
                  lightbulb
                </span>
                <p className="text-body-sm text-on-surface-variant">{tip}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
