import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getFeedbackByInterviewId,
  getUserStats,
} from "@/lib/actions/general.action";
import ConfidenceRing from "@/components/dashboard/ConfidenceRing";
import RecommendedSession from "@/components/dashboard/RecommendedSession";
import SessionCard from "@/components/dashboard/SessionCard";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const categoryToType: Record<string, string> = {
  "Communication Skills":   "Behavioral",
  "Technical Knowledge":    "Technical",
  "Problem Solving":        "Technical",
  "Problem-Solving":        "Technical",
  "Cultural Fit":           "Behavioral",
  "Cultural & Role Fit":    "Behavioral",
  "Confidence and Clarity": "Behavioral",
  "Confidence & Clarity":   "Behavioral",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [userInterviews, allInterviews, stats] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
    getUserStats(user.id),
  ]);

  const interviewsWithScores = await Promise.all(
    (userInterviews ?? []).map(async (iv) => {
      const fb = await getFeedbackByInterviewId({ interviewId: iv.id, userId: user.id });
      return { ...iv, score: fb?.totalScore };
    })
  );

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col gap-10">
      {/* Greeting */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface">
            {greeting}, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-body-lg text-on-surface-variant mt-1">
            {stats.sessionCount > 0
              ? `You've completed ${stats.sessionCount} session${stats.sessionCount !== 1 ? "s" : ""}.`
              : "Start your first practice session today."}
          </p>
        </div>

        {stats.weeklyDelta !== 0 && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-body-sm self-start ${
              stats.weeklyDelta > 0
                ? "bg-secondary/10 text-secondary"
                : "bg-error/10 text-error"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {stats.weeklyDelta > 0 ? "trending_up" : "trending_down"}
            </span>
            {stats.weeklyDelta > 0 ? "+" : ""}
            {stats.weeklyDelta}% this week
          </div>
        )}
      </section>

      {/* Stats row */}
      {stats.sessionCount > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 flex flex-col items-center gap-3">
            <ConfidenceRing score={stats.avgScore} size={140} />
            <p className="text-body-sm text-on-surface-variant text-center">
              Average across last {Math.min(stats.sessionCount, 5)} sessions
            </p>
          </div>

          <div className="card p-6 flex flex-col justify-between gap-4">
            <span className="material-symbols-outlined text-secondary text-4xl">mic</span>
            <div>
              <p className="text-headline-lg text-on-surface font-bold">{stats.sessionCount}</p>
              <p className="text-body-md text-on-surface-variant">Total sessions</p>
            </div>
          </div>

          <div className="card p-6 flex flex-col justify-between gap-4" style={{ background: "#006a61", borderColor: "#006a61" }}>
            <span className="material-symbols-outlined text-[rgba(255,255,255,0.8)] text-4xl">record_voice_over</span>
            <div>
              <p className="text-body-md font-semibold text-white/90 mb-3">Ready to practice?</p>
              <Link
                href="/interview"
                className="inline-flex items-center gap-2 bg-white text-secondary px-4 py-2 rounded-lg font-semibold text-body-sm no-underline hover:bg-white/90 transition-colors"
              >
                Start Session
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* AI Recommendation */}
      {stats.sessionCount > 0 && (
        <RecommendedSession
          weakCategory={stats.weakestCategory}
          weakScore={stats.avgScore}
          suggestedType={categoryToType[stats.weakestCategory] ?? "Technical"}
        />
      )}

      {/* Your Sessions */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-headline-md text-on-surface">Your Sessions</h2>
          {interviewsWithScores.length > 0 && (
            <Link href="/history" className="text-secondary text-body-sm font-semibold no-underline hover:underline">
              View all
            </Link>
          )}
        </div>

        {interviewsWithScores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewsWithScores.slice(0, 6).map((iv) => (
              <SessionCard
                key={iv.id}
                interviewId={iv.id}
                role={iv.role}
                type={iv.type}
                createdAt={iv.createdAt}
                score={iv.score}
              >
                <DisplayTechIcons techStack={iv.techstack} />
              </SessionCard>
            ))}
          </div>
        ) : (
          <div className="card p-10 flex flex-col items-center gap-4 text-center">
            <span className="material-symbols-outlined text-on-surface-variant text-5xl">mic_off</span>
            <p className="text-body-lg text-on-surface-variant">
              No sessions yet. Start your first practice interview!
            </p>
            <Link href="/interview" className="btn-primary no-underline">
              Generate Interview
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        )}
      </section>

      {/* Community */}
      {(allInterviews ?? []).length > 0 && (
        <section>
          <h2 className="text-headline-md text-on-surface mb-5">Take an Interview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(allInterviews ?? []).slice(0, 6).map((iv) => (
              <SessionCard
                key={iv.id}
                interviewId={iv.id}
                role={iv.role}
                type={iv.type}
                createdAt={iv.createdAt}
              >
                <DisplayTechIcons techStack={iv.techstack} />
              </SessionCard>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
