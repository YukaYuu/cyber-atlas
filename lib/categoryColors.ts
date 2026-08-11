import type { CategoryId } from "@/lib/types";

// NICTER Atlasのようにカテゴリごとに色分けする。ダーク地図背景で映えるよう、
// 蛍光寄りの彩度高めの色を選んでいる。
export const CATEGORY_COLORS: Record<CategoryId, string> = {
  ssh: "#22d3ee",
  ftp: "#a3e635",
  mail: "#f472b6",
  apache: "#fb923c",
  imap: "#c084fc",
  bots: "#f87171",
  bruteforcelogin: "#facc15",
};

export function categoryColor(category: CategoryId): string {
  return CATEGORY_COLORS[category] ?? "#94a3b8";
}
