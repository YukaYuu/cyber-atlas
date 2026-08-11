import type { CategoryId } from "@/lib/types";

// dataviz skillの検証済みカテゴリカルパレット(ダークモード、固定順)を
// このアプリのダークサーフェス(#05070d)に対してvalidate_palette.jsで
// 検証した上で採用(隣接ペアのCVD分離・コントラストが全て合格)。
// 地図のマーカーとtrendsページのチャートで同じ色を使うことで一貫性を保つ。
export const CATEGORY_COLORS: Record<CategoryId, string> = {
  ssh: "#3987e5",
  ftp: "#d95926",
  mail: "#199e70",
  apache: "#c98500",
  imap: "#d55181",
  bots: "#008300",
  bruteforcelogin: "#9085e9",
};

export function categoryColor(category: CategoryId): string {
  return CATEGORY_COLORS[category] ?? "#94a3b8";
}
