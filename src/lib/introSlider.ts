export function clampComparisonPercent(value: number): number {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 50));
}
