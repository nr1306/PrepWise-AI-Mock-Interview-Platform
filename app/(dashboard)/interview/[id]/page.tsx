import { redirect } from "next/navigation";
import Agent from "@/components/Agent";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default async function InterviewRoomPage({ params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);
  if (!interview) redirect("/dashboard");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-secondary-container text-[20px]">
              mic
            </span>
          </div>
          <div>
            <h1 className="text-headline-md text-on-surface capitalize">
              {interview.role} Interview
            </h1>
            <p className="text-body-sm text-on-surface-variant">
              {interview.level} · {interview.type}
            </p>
          </div>
        </div>
        <DisplayTechIcons techStack={interview.techstack} />
      </div>

      {/* Agent */}
      <Agent
        userName={user?.name!}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
        coach={(interview as any).coach ?? "maya"}
      />
    </div>
  );
}
