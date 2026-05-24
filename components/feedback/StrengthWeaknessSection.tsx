interface Props {
  strengths: string[];
  areasForImprovement: string[];
}

export default function StrengthWeaknessSection({ strengths, areasForImprovement }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-secondary text-[20px]">thumb_up</span>
          <h3 className="text-headline-md text-on-surface">Strengths</h3>
        </div>
        <ul className="flex flex-col gap-2">
          {strengths.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-body-sm text-on-surface-variant">
              <span className="text-secondary mt-0.5 shrink-0">•</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-amber-600 text-[20px]">build</span>
          <h3 className="text-headline-md text-on-surface">To Improve</h3>
        </div>
        <ul className="flex flex-col gap-2">
          {areasForImprovement.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-body-sm text-on-surface-variant">
              <span className="text-amber-600 mt-0.5 shrink-0">•</span>
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
