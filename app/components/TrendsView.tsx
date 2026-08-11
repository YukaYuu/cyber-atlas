import type { Dataset } from "@/lib/types";
import { computeTrends } from "@/lib/trends";
import { categoryColor } from "@/lib/categoryColors";
import { sequentialColorForRank } from "@/lib/sequentialRamp";
import StatTile from "@/app/components/StatTile";
import HorizontalBarChart from "@/app/components/HorizontalBarChart";
import NavLink from "@/app/components/NavLink";

type Props = {
  dataset: Dataset;
};

export default function TrendsView({ dataset }: Props) {
  const trends = computeTrends(dataset, 8);

  const categoryItems = [...trends.categoryCounts]
    .sort((a, b) => b.count - a.count)
    .map((c) => ({ key: c.id, label: c.label, count: c.count, color: categoryColor(c.id) }));

  const countryItems = trends.topCountries.map((c, i) => ({
    key: c.key,
    label: c.label,
    count: c.count,
    color: sequentialColorForRank(i, trends.topCountries.length),
  }));

  const orgItems = trends.topOrgs.map((o, i) => ({
    key: o.key,
    label: o.label,
    count: o.count,
    color: sequentialColorForRank(i, trends.topOrgs.length),
  }));

  return (
    <div className="min-h-screen bg-[#05070d] px-6 py-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-lg font-semibold tracking-wide text-slate-100">Trends</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            aggregate breakdown of the same {trends.totalEvents}-event dataset behind the replay map
          </p>
        </div>
        <NavLink href="/" label="← Back to map" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6 max-w-2xl">
        <StatTile label="Total events" value={trends.totalEvents} />
        <StatTile label="Countries" value={trends.uniqueCountries} />
        <StatTile label="Hosting orgs / ASNs" value={trends.uniqueOrgs} />
      </div>

      <div className="grid gap-4 max-w-5xl md:grid-cols-2">
        <section className="rounded-lg bg-black/40 p-4">
          <h2 className="text-xs uppercase tracking-wide text-slate-400 mb-3">
            Events by attack category
          </h2>
          <HorizontalBarChart items={categoryItems} />
        </section>

        <section className="rounded-lg bg-black/40 p-4">
          <h2 className="text-xs uppercase tracking-wide text-slate-400 mb-3">
            Top reporting countries
          </h2>
          <HorizontalBarChart items={countryItems} />
        </section>

        <section className="rounded-lg bg-black/40 p-4 md:col-span-2">
          <h2 className="text-xs uppercase tracking-wide text-slate-400 mb-3">
            Top hosting organizations / networks
          </h2>
          <p className="text-[11px] text-slate-500 mb-3">
            Which ISPs and hosting providers the reported attacker IPs belong to —
            a proxy for where abuse-friendly or poorly-secured infrastructure clusters.
          </p>
          <HorizontalBarChart items={orgItems} />
        </section>
      </div>

      <p className="text-[11px] text-slate-600 mt-6 max-w-2xl">
        This view aggregates across the full dataset by category, country, and hosting
        organization — all real fields from blocklist.de + ip-api.com. Unlike the replay
        map, nothing here depends on the synthesized replay timestamps.
      </p>
    </div>
  );
}
