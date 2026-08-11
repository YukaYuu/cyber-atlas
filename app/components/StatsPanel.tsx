import type { CategoryId } from "@/lib/types";
import { categoryColor } from "@/lib/categoryColors";

type Props = {
  counts: Partial<Record<CategoryId, number>>;
  categories: { id: CategoryId; label: string }[];
};

export default function StatsPanel({ counts, categories }: Props) {
  const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);

  return (
    <div className="rounded-lg bg-black/60 backdrop-blur px-4 py-3 shadow-lg text-xs text-slate-200 min-w-[180px]">
      <div className="text-slate-400 uppercase tracking-wide text-[10px] mb-1">
        This loop
      </div>
      <div className="text-2xl font-semibold text-slate-100 mb-2">{total}</div>
      <div className="space-y-1">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: categoryColor(c.id) }}
              />
              {c.label}
            </span>
            <span className="text-slate-400">{counts[c.id] ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
