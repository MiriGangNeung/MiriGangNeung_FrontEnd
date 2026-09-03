import { Plus } from 'lucide-react';

type CourseResultHeaderProps = {
  isPlaceAdderOpen: boolean;
  durationText: string;
  courseStopCount: number;
  totalDistanceText: string;
  tags: string[];
  onTogglePlaceAdder: () => void;
};

export function CourseResultHeader({
  isPlaceAdderOpen,
  durationText,
  courseStopCount,
  totalDistanceText,
  tags,
  onTogglePlaceAdder,
}: CourseResultHeaderProps) {
  if (isPlaceAdderOpen) return null;

  return (
    <>
      <h1 className="m-0 text-[22px] font-extrabold -tracking-[.6px]">나만의 강릉 코스</h1>
      <p className="mt-2 text-[13px] text-ink-soft">
        {durationText} · 총 {courseStopCount}곳 · {totalDistanceText} 이동
      </p>
      <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto pb-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="shrink-0 whitespace-nowrap rounded-full bg-brand-tint px-3 py-1.5 text-xs font-semibold text-brand"
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        aria-expanded={false}
        onClick={onTogglePlaceAdder}
        className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-line-dashed bg-white text-sm font-semibold text-ink-muted hover:border-brand hover:text-brand"
      >
        <Plus size={17} strokeWidth={1.8} /> 새로운 장소 추가
      </button>
    </>
  );
}
