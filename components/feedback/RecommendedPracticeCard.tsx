import Link from "next/link";

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

interface Props {
  weakestCategory: string;
  role: string;
}

export default function RecommendedPracticeCard({ weakestCategory, role }: Props) {
  const suggestedType = categoryToType[weakestCategory] ?? "Mixed";

  return (
    <div className="card p-6 flex flex-col gap-4" style={{ borderLeft: "4px solid #006a61" }}>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary text-[20px]">auto_awesome</span>
        <h3 className="text-headline-md text-on-surface">Recommended Next Practice</h3>
      </div>
      <p className="text-body-md text-on-surface-variant">
        Your weakest area is{" "}
        <span className="font-semibold text-on-surface">{weakestCategory}</span>. Book a{" "}
        <span className="font-semibold text-secondary">{suggestedType}</span>{" "}
        {role} session to sharpen this skill.
      </p>
      <Link href="/interview" className="btn-primary no-underline self-start">
        <span className="material-symbols-outlined text-[18px]">add</span>
        Start New Session
      </Link>
    </div>
  );
}
