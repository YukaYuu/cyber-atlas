// dataviz skillの連続量(sequential)ランプ(blue)から、ダークサーフェス上でも
// 視認できる範囲(step 250〜600、暗すぎるとサーフェスに沈んで消える)だけを
// 8段抜き出したもの。ランク0(最大値)が最も明るく、末尾が最も暗い。
const DARK_SURFACE_STEPS = [
  "#86b6ef", // 250
  "#6da7ec", // 300
  "#5598e7", // 350
  "#3987e5", // 400
  "#2a78d6", // 450
  "#256abf", // 500
  "#1c5cab", // 550
  "#184f95", // 600
];

export function sequentialColorForRank(rank: number, total: number): string {
  if (total <= 1) return DARK_SURFACE_STEPS[0];
  const idx = Math.round((rank / (total - 1)) * (DARK_SURFACE_STEPS.length - 1));
  return DARK_SURFACE_STEPS[Math.min(idx, DARK_SURFACE_STEPS.length - 1)];
}
