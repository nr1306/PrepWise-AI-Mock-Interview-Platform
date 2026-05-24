interface Props {
  name: string;
  score: number;
  comment: string;
}

export default function FeedbackMetricCard({ name, score, comment }: Props) {
  const color =
    score >= 80 ? "text-secondary" : score >= 60 ? "text-amber-600" : "text-error";
  const bg =
    score >= 80 ? "bg-secondary/10" : score >= 60 ? "bg-amber-50" : "bg-error/10";
  const bar =
    score >= 80 ? "bg-secondary" : score >= 60 ? "bg-amber-500" : "bg-error";

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-body-sm font-semibold text-on-surface">{name}</p>
        <span className={`text-label-sm font-bold px-2.5 py-1 rounded-full shrink-0 ${bg} ${color}`}>
          {score}/100
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-outline-variant overflow-hidden">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${score}%` }} />
      </div>
      <p className="text-body-sm text-on-surface-variant line-clamp-3">{comment}</p>
    </div>
  );
}
