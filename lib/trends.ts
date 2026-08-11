import type { AttackEvent, CategoryId, Dataset } from "@/lib/types";

export type RankedEntry = { key: string; label: string; count: number };

function rankBy(events: AttackEvent[], keyFn: (e: AttackEvent) => string | null, limit: number): RankedEntry[] {
  const counts = new Map<string, number>();
  for (const e of events) {
    const key = keyFn(e);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([key, count]) => ({ key, label: key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export type TrendsSummary = {
  totalEvents: number;
  uniqueCountries: number;
  uniqueOrgs: number;
  categoryCounts: { id: CategoryId; label: string; count: number }[];
  topCountries: RankedEntry[];
  topOrgs: RankedEntry[];
};

export function computeTrends(dataset: Dataset, topN = 8): TrendsSummary {
  const { events, categories } = dataset;

  const categoryCounts = categories.map((c) => ({
    id: c.id,
    label: c.label,
    count: events.filter((e) => e.category === c.id).length,
  }));

  const uniqueCountries = new Set(events.map((e) => e.countryCode).filter(Boolean)).size;
  const uniqueOrgs = new Set(events.map((e) => e.org).filter(Boolean)).size;

  return {
    totalEvents: events.length,
    uniqueCountries,
    uniqueOrgs,
    categoryCounts,
    topCountries: rankBy(events, (e) => e.country, topN),
    topOrgs: rankBy(events, (e) => e.org, topN),
  };
}
