export type BarItem = {
  key: string;
  label: string;
  count: number;
  color: string;
};

type Props = {
  items: BarItem[];
};

// dataviz skillのbarマーク仕様: 太さ<=24px, 端は4px角丸(ベースラインは直角),
// 隣接バー間はサーフェス色2pxギャップ, 目盛線はサーフェスから1段のグレー・ヘアライン。
// 値は常にバー先端に直接ラベル表示するため、ホバー無しでも全情報が読める。
export default function HorizontalBarChart({ items }: Props) {
  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <div className="space-y-[2px]">
      {items.map((item) => {
        const widthPct = Math.max(2, (item.count / max) * 100);
        return (
          <div key={item.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-slate-300 truncate" title={item.label}>
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-2 w-[55%] min-w-[120px]">
              <div className="flex-1 h-3.5 rounded-[4px] bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-[4px]"
                  style={{ width: `${widthPct}%`, background: item.color }}
                />
              </div>
              <span className="text-xs tabular-nums text-slate-400 w-8 text-right flex-shrink-0">
                {item.count}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
