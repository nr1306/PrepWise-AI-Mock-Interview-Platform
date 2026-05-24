export function generateQuestionFeedbacks(
  questions: string[],
  categoryScores: Array<{ name: string; score: number; comment: string }>,
  totalScore: number
): QuestionFeedback[] {
  return questions.map((question, i) => {
    const variation = Math.round(Math.sin(i * 2.7) * 12);
    const score = Math.min(98, Math.max(40, totalScore + variation));

    const catIdx = i % Math.max(categoryScores.length, 1);
    const comment = categoryScores[catIdx]?.comment ?? "Your answer addressed the core concept adequately.";

    const tip =
      score >= 80
        ? "Strong answer. Boost impact by adding a specific metric or quantifiable outcome."
        : score >= 60
        ? "Solid foundation. Use the STAR format to structure future responses for more clarity."
        : "Practice explaining this concept from first principles before your next session.";

    return { question, score, comment, tip };
  });
}
