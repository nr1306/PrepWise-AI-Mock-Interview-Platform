import Link from "next/link";
import dayjs from "dayjs";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById, getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { generateQuestionFeedbacks } from "@/lib/mock/feedbackMock";
import ConfidenceRing from "@/components/dashboard/ConfidenceRing";
import FeedbackMetricCard from "@/components/feedback/FeedbackMetricCard";
import QuestionFeedbackCard from "@/components/feedback/QuestionFeedbackCard";
import StrengthWeaknessSection from "@/components/feedback/StrengthWeaknessSection";
import RecommendedPracticeCard from "@/components/feedback/RecommendedPracticeCard";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const coachMap: Record<string, { name: string; emoji: string; badge: string }> = {
  sarah: { name: "Sarah", emoji: "👩‍💼", badge: "Encouraging" },
  david: { name: "David", emoji: "👨‍💼", badge: "Challenging" },
  maya:  { name: "Maya",  emoji: "👩‍🏫", badge: "Professional" },
};

export default async function FeedbackReportPage({ params }: RouteParams) {
  const { sessionId } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const interview = await getInterviewById(sessionId);
  if (!interview) redirect("/dashboard");

  const feedback = await getFeedbackByInterviewId({
    interviewId: sessionId,
    userId: user.id,
  });

  if (!feedback) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card p-10 flex flex-col items-center gap-4 text-center">
          <span className="material-symbols-outlined text-on-surface-variant text-5xl">feedback</span>
          <h2 className="text-headline-md text-on-surface capitalize">
            {interview.role} Interview
          </h2>
          <p className="text-body-md text-on-surface-variant max-w-md">
            No feedback has been generated yet. This usually means the interview ended before
            enough transcript was captured.
          </p>
          <div className="flex gap-4 flex-wrap justify-center pt-2">
            <Link href="/dashboard" className="btn-secondary no-underline">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Dashboard
            </Link>
            <Link href={`/interview/${sessionId}`} className="btn-primary no-underline">
              <span className="material-symbols-outlined text-[18px]">replay</span>
              Retake Interview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const questionFeedbacks = generateQuestionFeedbacks(
    interview.questions ?? [],
    feedback.categoryScores ?? [],
    feedback.totalScore
  );

  const weakest = [...(feedback.categoryScores ?? [])].sort((a, b) => a.score - b.score)[0];
  const coachInfo = coachMap[interview.coach ?? "maya"] ?? coachMap.maya;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Back + title */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="btn-ghost p-2 rounded-full no-underline">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-headline-md text-on-surface capitalize">{interview.role} Interview</h1>
          <p className="text-body-sm text-on-surface-variant">
            {interview.level} · {interview.type} ·{" "}
            {dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")}
          </p>
        </div>
      </div>

      {/* Overall Score */}
      <div className="card p-8 flex flex-col md:flex-row items-center gap-8">
        <ConfidenceRing score={feedback.totalScore} size={140} />
        <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <span className="text-4xl">{coachInfo.emoji}</span>
            <div>
              <p className="text-body-md font-bold text-on-surface">{coachInfo.name}</p>
              <span className="badge badge-teal">{coachInfo.badge}</span>
            </div>
          </div>
          <DisplayTechIcons techStack={interview.techstack} />
          {feedback.finalAssessment && (
            <p className="text-body-md text-on-surface-variant italic">
              &ldquo;{feedback.finalAssessment}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="flex flex-col gap-4">
        <h2 className="text-headline-md text-on-surface">Performance Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(feedback.categoryScores ?? []).map((cat) => (
            <FeedbackMetricCard
              key={cat.name}
              name={cat.name}
              score={cat.score}
              comment={cat.comment}
            />
          ))}
        </div>
      </div>

      {/* Strengths + Improvements */}
      <StrengthWeaknessSection
        strengths={feedback.strengths}
        areasForImprovement={feedback.areasForImprovement}
      />

      {/* Question-by-Question Review */}
      {questionFeedbacks.length > 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-headline-md text-on-surface">Question Review</h2>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Tap any question to see detailed feedback and improvement tips.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {questionFeedbacks.map((qf, i) => (
              <QuestionFeedbackCard
                key={i}
                index={i}
                question={qf.question}
                score={qf.score}
                comment={qf.comment}
                tip={qf.tip}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Next Practice */}
      {weakest && (
        <RecommendedPracticeCard weakestCategory={weakest.name} role={interview.role} />
      )}

      {/* Actions */}
      <div className="flex gap-4 flex-wrap">
        <Link href="/dashboard" className="btn-secondary no-underline flex-1 justify-center">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Dashboard
        </Link>
        <Link href={`/interview/${sessionId}`} className="btn-primary no-underline flex-1 justify-center">
          <span className="material-symbols-outlined text-[18px]">replay</span>
          Retake Interview
        </Link>
      </div>
    </div>
  );
}
