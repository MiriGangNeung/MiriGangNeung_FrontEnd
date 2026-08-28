type StationHeadingProps = {
  /** Stop number in the journey (1-based). */
  index: number;
  /** Korean journey label, e.g. "첫 번째 · 장소 고르기". */
  label: string;
};

/**
 * Itinerary station marker: a numbered node on the route plus a Korean journey
 * label. Shared by the three middle sections so the intro reads as one travel
 * course. Each section supplies its own <h2> beneath this.
 */
export function StationHeading({ index, label }: StationHeadingProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-label/35 text-sm font-extrabold text-label"
        aria-hidden="true"
      >
        {index}
        <span className="absolute left-1/2 top-full h-9 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,rgba(74,122,181,0.35),transparent)]" />
      </span>
      <span className="text-[13px] font-bold tracking-tight text-label">{label}</span>
    </div>
  );
}
