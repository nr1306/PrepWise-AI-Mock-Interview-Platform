"use server";

import { generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getRandomInterviewCover } from "@/lib/utils";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: feedbackSchema,
      mode: "tool",
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  try {
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error("getInterviewsByUserId error:", error);
    return [];
  }
}

export async function createInterview(params: {
  role: string;
  level: string;
  type: string;
  techstack: string;
  amount: number;
  coach?: string;
  track?: string;
}): Promise<{ success: boolean; interviewId?: string; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { role, level, type, techstack, amount, coach = "maya", track = "tech" } = params;

  const trackContext: Record<string, string> = {
    tech:       "Focus on software engineering concepts, system design, and coding.",
    finance:    "Focus on quantitative reasoning, financial modeling, and market analysis.",
    marketing:  "Focus on brand strategy, growth metrics, and campaign thinking.",
    healthcare: "Focus on clinical knowledge, patient care scenarios, and healthcare systems.",
  };

  try {
    const { text: questions } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Industry context: ${trackContext[track] ?? ""}
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
      `,
    });

    const jsonMatch = questions.match(/\[[\s\S]*\]/);
    const parsedQuestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((t) => t.trim()),
      questions: parsedQuestions,
      userId: user.id,
      coach,
      track,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);
    return { success: true, interviewId: docRef.id };
  } catch (error) {
    console.error("createInterview error:", error);
    return { success: false, error: "Failed to generate interview" };
  }
}

export async function getUserStats(userId: string): Promise<{
  avgScore: number;
  weeklyDelta: number;
  weakestCategory: string;
  sessionCount: number;
}> {
  try {
    const snapshot = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    if (snapshot.empty) {
      return { avgScore: 0, weeklyDelta: 0, weakestCategory: "Technical Knowledge", sessionCount: 0 };
    }

    const feedbacks = snapshot.docs.map((d) => d.data() as Feedback);
    const now = Date.now();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

    const thisWeek = feedbacks.filter(
      (f) => now - new Date(f.createdAt).getTime() < oneWeekMs
    );
    const lastWeek = feedbacks.filter((f) => {
      const age = now - new Date(f.createdAt).getTime();
      return age >= oneWeekMs && age < 2 * oneWeekMs;
    });

    const avg = (arr: Feedback[]) =>
      arr.length ? arr.reduce((s, f) => s + f.totalScore, 0) / arr.length : 0;

    const avgScore = Math.round(avg(feedbacks.slice(0, 5)));
    const weeklyDelta = Math.round(avg(thisWeek) - avg(lastWeek));

    // Find weakest category from last feedback
    const latest = feedbacks[0];
    let weakest = { name: "Technical Knowledge", score: 100 };
    for (const cat of latest.categoryScores ?? []) {
      if (cat.score < weakest.score) weakest = cat;
    }

    return {
      avgScore,
      weeklyDelta,
      weakestCategory: weakest.name,
      sessionCount: feedbacks.length,
    };
  } catch {
    return { avgScore: 0, weeklyDelta: 0, weakestCategory: "Technical Knowledge", sessionCount: 0 };
  }
}
