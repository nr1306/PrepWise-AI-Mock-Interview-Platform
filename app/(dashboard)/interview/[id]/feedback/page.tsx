import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import ConfidenceRing from "@/components/dashboard/ConfidenceRing";
import ScoreBar from "@/components/feedback/ScoreBar";

export default async function FeedbackPage({ params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);
  if (!interview) redirect("/dashboard");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      {/* ── Header ── */}
      <div className="card p-8 flex flex-col md:flex-row items-center gap-8">
        <ConfidenceRing score={feedback?.totalScore ?? 0} size={140} />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-headline-md text-on-surface capitalize mb-1">
            {interview.role} Interview
          </h1>
          <p className="text-body-sm text-on-surface-variant mb-4">
            {interview.level} · {interview.type} ·{" "}
            {feedback?.createdAt
              ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
              : "—"}
          </p>
          {feedback?.finalAssessment && (
            <p className="text-body-md text-on-surface-variant italic">
              &ldquo;{feedback.finalAssessment}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* ── Category Breakdown ── */}
      {feedback?.categoryScores && (
        <div className="card p-6 flex flex-col gap-6">
          <h2 className="text-headline-md text-on-surface">Breakdown</h2>
          {feedback.categoryScores.map((cat, i) => (
            <ScoreBar
              key={cat.name}
              name={cat.name}
              score={cat.score}
              comment={cat.comment}
              index={i}
            />
          ))}
        </div>
      )}

      {/* ── Strengths + Improvements ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              thumb_up
            </span>
            <h3 className="text-headline-md text-on-surface">Strengths</h3>
          </div>
          <ul className="flex flex-col gap-2">
            {(feedback?.strengths ?? []).map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-body-sm text-on-surface-variant">
                <span className="text-secondary mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-amber-600 text-[20px]">
              build
            </span>
            <h3 className="text-headline-md text-on-surface">To Improve</h3>
          </div>
          <ul className="flex flex-col gap-2">
            {(feedback?.areasForImprovement ?? []).map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-body-sm text-on-surface-variant">
                <span className="text-amber-600 mt-0.5">•</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-4 flex-wrap">
        <Link href="/dashboard" className="btn-secondary no-underline flex-1 justify-center">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Dashboard
        </Link>
        <Link href={`/interview/${id}`} className="btn-primary no-underline flex-1 justify-center">
          <span className="material-symbols-outlined text-[18px]">replay</span>
          Retake Interview
        </Link>
      </div>
    </div>
  );
}
