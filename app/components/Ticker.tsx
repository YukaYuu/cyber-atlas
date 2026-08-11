import type { AttackEvent } from "@/lib/types";
import { categoryColor } from "@/lib/categoryColors";

type Props = {
  events: AttackEvent[];
};

export default function Ticker({ events }: Props) {
  return (
    <div className="rounded-lg bg-black/60 backdrop-blur px-4 py-3 shadow-lg w-[320px] max-h-[240px] overflow-hidden">
      <div className="text-slate-400 uppercase tracking-wide text-[10px] mb-2">
        Live feed
      </div>
      <div className="space-y-1 font-mono text-[11px]">
        {events.length === 0 && <div className="text-slate-500">waiting for events...</div>}
        {events.map((e, i) => (
          <div
            key={`${e.ip}-${e.timestamp}-${i}`}
            className="flex items-center gap-2 text-slate-300"
            style={{ opacity: 1 - i * 0.07 }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: categoryColor(e.category) }}
            />
            <span className="text-slate-500">{formatClock(e.timestamp)}</span>
            <span className="truncate">{e.ip}</span>
            <span className="text-slate-500 truncate">{e.countryCode ?? "??"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatClock(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().slice(11, 19);
}
