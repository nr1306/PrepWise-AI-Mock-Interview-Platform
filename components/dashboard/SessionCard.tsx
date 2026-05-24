"use client";

import Link from "next/link";
import dayjs from "dayjs";
import type { ReactNode } from "react";

interface Props {
  interviewId: string;
  role: string;
  type: string;
  createdAt?: string;
  score?: number;
  children?: ReactNode;
}

export default function SessionCard({
  interviewId,
  role,
  type,
  createdAt,
  score,
  children,
}: Props) {
  const hasFeedback = score !== undefined;

  const scoreColor =
    score === undefined
      ? "text-on-surface-variant"
      : score >= 75
      ? "text-secondary"
      : score >= 50
      ? "text-amber-600"
      : "text-error";

  return (
    <div className="card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-body-md font-semibold text-on-surface capitalize">{role}</h3>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            {type} · {createdAt ? dayjs(createdAt).format("MMM D, YYYY") : "—"}
          </p>
        </div>

        {score !== undefined ? (
          <div className="text-right shrink-0">
            <span className={`text-headline-md font-bold ${scoreColor}`}>{score}</span>
            <span className="text-body-sm text-on-surface-variant">/100</span>
          </div>
        ) : (
          <span className="badge badge-slate">No feedback</span>
        )}
      </div>

      {/* Tech icons */}
      {children}

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-outline-variant">
        <Link
          href={`/interview/${interviewId}`}
          className="btn-ghost text-body-sm no-underline justify-center flex-1"
        >
          <span className="material-symbols-outlined text-[16px]">play_circle</span>
          Retake
        </Link>

        {hasFeedback && (
          <Link
            href={`/feedback/${interviewId}`}
            className="btn-ghost text-body-sm no-underline flex-1 justify-center text-secondary"
          >
            <span className="material-symbols-outlined text-[16px]">feedback</span>
            View Feedback
          </Link>
        )}
      </div>
    </div>
  );
}
