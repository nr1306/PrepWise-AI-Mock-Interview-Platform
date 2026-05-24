import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getFeedbackByInterviewId } from "@/lib/actions/general.action";
import SessionCard from "@/components/dashboard/SessionCard";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import Link from "next/link";

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const interviews = await getInterviewsByUserId(user.id);

  const interviewsWithScores = await Promise.all(
    (interviews ?? []).map(async (iv) => {
      const fb = await getFeedbackByInterviewId({ interviewId: iv.id, userId: user.id });
      return { ...iv, score: fb?.totalScore };
    })
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-surface">Interview History</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            All {interviewsWithScores.length} of your past sessions.
          </p>
        </div>
        <Link href="/interview" className="btn-primary no-underline text-body-sm">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Session
        </Link>
      </div>

      {interviewsWithScores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviewsWithScores.map((iv) => (
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
        <div className="card p-16 flex flex-col items-center gap-4 text-center">
          <span className="material-symbols-outlined text-on-surface-variant text-6xl">
            history
          </span>
          <p className="text-body-lg text-on-surface-variant">
            No sessions yet. Start your first practice interview!
          </p>
          <Link href="/interview" className="btn-primary no-underline">
            Generate Interview
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      )}
    </div>
  );
}
