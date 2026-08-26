import { GripVertical, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState, type PointerEvent } from 'react';
import type { CourseStop } from '../../types/domain';

type CourseStopActionsProps = {
  isPlaceAdderOpen: boolean;
  stop: CourseStop;
  onDelete: () => void;
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onLostPointerCapture: () => void;
  isDragging: boolean;
};

export function CourseStopActions({
  isPlaceAdderOpen,
  stop,
  onDelete,
  onPointerDown,
  onLostPointerCapture,
  isDragging,
}: CourseStopActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {!isPlaceAdderOpen && (
        <div data-course-stop-actions className="absolute right-2 top-2 z-10">
          <button
            type="button"
            data-course-stop-menu
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            aria-label={`${stop.name} 관리 메뉴`}
            title="장소 관리"
            onClick={() => setIsMenuOpen((open) => !open)}
            className={`rounded-full p-1.5 text-ink-muted transition hover:bg-fill hover:text-brand ${isMenuOpen ? 'opacity-100' : 'opacity-100 lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100'}`}
          >
            <MoreHorizontal size={17} />
          </button>
          {isMenuOpen && (
            <div
              role="menu"
              aria-label={`${stop.name} 관리`}
              className="absolute right-0 top-full mt-1 min-w-[120px] rounded-xl border border-line bg-white p-1 shadow-[0_8px_20px_rgba(16,24,40,.14)]"
            >
              <button
                type="button"
                role="menuitem"
                data-course-stop-delete
                disabled={stop.onePick}
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete();
                }}
                title={stop.onePick ? '원픽 장소는 삭제할 수 없어요' : '장소 삭제'}
                aria-label={`${stop.name} 삭제`}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-ink-muted hover:bg-coral-tint hover:text-coral disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Trash2 size={14} /> 장소 삭제
              </button>
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        data-course-stop-drag-handle
        onPointerDown={onPointerDown}
        onLostPointerCapture={onLostPointerCapture}
        title="드래그해서 순서 변경"
        aria-label={`${stop.name} 순서 변경 핸들`}
        aria-pressed={isDragging}
        className={`absolute right-2 top-1/2 z-10 flex -translate-y-1/2 touch-none items-center justify-center p-2 transition ${isDragging ? 'cursor-grabbing text-brand' : 'cursor-grab text-ink-muted/35 hover:text-brand'} active:cursor-grabbing`}
      >
        <GripVertical size={18} strokeWidth={2.2} />
      </button>
    </>
  );
}
