type Props = {
  label: string;
  value: string | number;
};

export default function StatTile({ label, value }: Props) {
  return (
    <div className="rounded-lg bg-black/60 backdrop-blur px-4 py-3 shadow-lg">
      <div className="text-slate-400 uppercase tracking-wide text-[10px] mb-1">{label}</div>
      <div className="text-3xl font-semibold text-slate-100">{value}</div>
    </div>
  );
}
