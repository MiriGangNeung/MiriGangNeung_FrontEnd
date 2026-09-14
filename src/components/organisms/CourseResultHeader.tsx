import { LoaderCircle, Plus, Route } from 'lucide-react';

type CourseResultHeaderProps = {
  isPlaceAdderOpen: boolean;
  courseStopCount: number;
  totalDistanceText: string;
  tags: string[];
  isOptimizingRoute: boolean;
  routeOptimizationMessage: string | null;
  onTogglePlaceAdder: () => void;
  onOptimizeRoute: () => void;
};

export function CourseResultHeader({
  isPlaceAdderOpen,
  courseStopCount,
  totalDistanceText,
  tags,
  isOptimizingRoute,
  routeOptimizationMessage,
  onTogglePlaceAdder,
  onOptimizeRoute,
}: CourseResultHeaderProps) {
  if (isPlaceAdderOpen) return null;

  return (
    <>
      <h1 className="m-0 text-[22px] font-extrabold -tracking-[.6px]">나만의 강릉 코스</h1>
      <p className="mt-2 text-[13px] text-ink-soft">
        총 {courseStopCount}곳 · {totalDistanceText} 이동
      </p>
      <div className="mt-4 flex flex-wrap gap-2 pb-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex max-w-full items-center rounded-full bg-brand-tint px-3 py-1.5 text-xs font-semibold leading-4 text-brand"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onOptimizeRoute}
          disabled={isOptimizingRoute || courseStopCount < 2}
          className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-brand-tint text-sm font-semibold text-brand transition hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isOptimizingRoute ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Route size={17} strokeWidth={1.8} />
          )}
          {isOptimizingRoute ? '경로 계산 중' : '경로 최적화하기'}
        </button>
        <button
          type="button"
          aria-expanded={false}
          onClick={onTogglePlaceAdder}
          className="flex h-12 items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-line-dashed bg-white text-sm font-semibold text-ink-muted hover:border-brand hover:text-brand"
        >
          <Plus size={17} strokeWidth={1.8} /> 새로운 장소 추가
        </button>
      </div>
      {routeOptimizationMessage && (
        <p role="status" className="mb-0 mt-2 text-xs leading-5 text-ink-soft">
          {routeOptimizationMessage}
        </p>
      )}
    </>
  );
}
