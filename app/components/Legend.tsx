import type { CategoryId } from "@/lib/types";
import { categoryColor } from "@/lib/categoryColors";

type Props = {
  categories: { id: CategoryId; label: string }[];
};

export default function Legend({ categories }: Props) {
  return (
    <div className="rounded-lg bg-black/60 backdrop-blur px-4 py-3 shadow-lg text-xs text-slate-200 space-y-1.5 min-w-[180px]">
      <div className="text-slate-400 uppercase tracking-wide text-[10px] mb-1">
        Attack category
      </div>
      {categories.map((c) => (
        <div key={c.id} className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: categoryColor(c.id), boxShadow: `0 0 4px ${categoryColor(c.id)}` }}
          />
          <span>{c.label}</span>
        </div>
      ))}
    </div>
  );
}
