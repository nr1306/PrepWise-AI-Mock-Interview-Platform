import Link from "next/link";

interface Props {
  weakCategory: string;
  weakScore: number;
  suggestedType: string;
}

export default function RecommendedSession({
  weakCategory,
  weakScore,
  suggestedType,
}: Props) {
  return (
    <div
      className="card p-5 border-l-4"
      style={{ borderLeftColor: "#006a61" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              auto_awesome
            </span>
            <span className="text-label-sm text-secondary uppercase tracking-wider font-semibold">
              AI Recommendation
            </span>
          </div>
          <h3 className="text-body-md font-semibold text-on-surface mb-1">
            Practice a {suggestedType} Interview
          </h3>
          <p className="text-body-sm text-on-surface-variant">
            Your <strong>{weakCategory}</strong> scored {weakScore}/100 in your
            last session. A focused {suggestedType.toLowerCase()} practice will
            help you improve.
          </p>
        </div>

        <Link href="/interview" className="btn-primary shrink-0 text-body-sm px-4 py-2 no-underline">
          Start Now
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}
