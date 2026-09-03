/** Visible fraction of the mobile course sheet at each snap point. */
export const SHEET_SNAP_FRACTIONS = { peek: 0.32, half: 0.62, full: 0.94 } as const;
export const SHEET_SNAP_ORDER = ['peek', 'half', 'full'] as const;

export type SheetSnap = (typeof SHEET_SNAP_ORDER)[number];

/** Translate-Y offset, in px, that leaves `snap` worth of a `height`-tall sheet visible. */
export function sheetOffsetForSnap(snap: SheetSnap, height: number): number {
  return (1 - SHEET_SNAP_FRACTIONS[snap]) * height;
}

/** Keeps a dragged offset between the full and peek positions. */
export function clampSheetOffset(offset: number, height: number): number {
  const min = sheetOffsetForSnap('full', height);
  const max = sheetOffsetForSnap('peek', height);
  return Math.min(Math.max(offset, min), max);
}

/** Snap point whose visible fraction is closest to where the drag ended. */
export function nearestSheetSnap(offset: number, height: number): SheetSnap {
  if (height <= 0) return 'half';
  const visible = 1 - offset / height;
  return SHEET_SNAP_ORDER.reduce((best, key) =>
    Math.abs(SHEET_SNAP_FRACTIONS[key] - visible) < Math.abs(SHEET_SNAP_FRACTIONS[best] - visible)
      ? key
      : best,
  );
}

/** Snap one step up (`+1`) or down (`-1`); returns the current snap at either end. */
export function stepSheetSnap(snap: SheetSnap, delta: number): SheetSnap {
  return SHEET_SNAP_ORDER[SHEET_SNAP_ORDER.indexOf(snap) + delta] ?? snap;
}
