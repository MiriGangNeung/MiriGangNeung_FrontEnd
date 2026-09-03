import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import {
  clampSheetOffset,
  nearestSheetSnap,
  sheetOffsetForSnap,
  stepSheetSnap,
  SHEET_SNAP_FRACTIONS,
  type SheetSnap,
} from '../../lib/courseSheetSnap';

const SNAP_LABELS: Record<SheetSnap, string> = { peek: '최소', half: '절반', full: '전체' };

type CourseSheetProps = {
  children: ReactNode;
  snap: SheetSnap;
  onSnapChange: (snap: SheetSnap) => void;
  /** The child is a self-contained full-height panel with its own scroll and footer
   *  (the place adder); skip the grow-to-clear-the-action-bar scroll padding. */
  isPanel?: boolean;
};

/**
 * Course list container. Below `lg` it is a draggable bottom sheet over the map
 * (drag the handle, or use the arrow keys); at `lg` it collapses back into the
 * plain left-hand grid column and every sheet affordance is inert.
 */
export function CourseSheet({ children, snap, onSnapChange, isPanel = false }: CourseSheetProps) {
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  // The live offset lives in the ref as well as in state: pointer events that land
  // in a single React batch would otherwise read a stale `dragOffset` on release
  // and leave the sheet stranded between snap points.
  const dragRef = useRef<{ startY: number; height: number; offset: number } | null>(null);

  const isDragging = dragOffset !== null;
  // Resting position is a percentage of the sheet's own height (survives viewport
  // resizes); the live drag needs pixels. Applied as an inline `transform` rather
  // than a CSS-var utility: routing it through Tailwind's `--tw-translate-y`
  // leaves the transition stuck (an unregistered custom property mid-`transform`
  // transition stops repainting in Chrome).
  const translateY = isDragging ? `${dragOffset}px` : `${(1 - SHEET_SNAP_FRACTIONS[snap]) * 100}%`;
  // At the lower snaps most of the sheet sits below the viewport, so the last
  // rows can never be scrolled up past the floating action bar without extra
  // room. Grow the scroll padding by however much of the sheet is hidden.
  const scrollPadBottom = isPanel
    ? '1rem'
    : `calc(${1 - SHEET_SNAP_FRACTIONS[snap]} * (100dvh - var(--app-header)) + 8rem)`;

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    const height = sheetRef.current?.getBoundingClientRect().height ?? 0;
    if (!height) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const offset = sheetOffsetForSnap(snap, height);
    dragRef.current = { startY: event.clientY, height, offset };
    setDragOffset(offset);
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const startOffset = sheetOffsetForSnap(snap, drag.height);
    drag.offset = clampSheetOffset(startOffset + (event.clientY - drag.startY), drag.height);
    setDragOffset(drag.offset);
  }

  function handlePointerUp() {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    setDragOffset(null);
    onSnapChange(nearestSheetSnap(drag.offset, drag.height));
  }

  return (
    <div
      ref={sheetRef}
      style={
        {
          transform: `translateY(${translateY})`,
          '--sheet-pad-b': scrollPadBottom,
        } as CSSProperties
      }
      className={`fixed inset-x-0 bottom-0 z-[600] flex h-[calc(100dvh-var(--app-header))] flex-col rounded-t-2xl border-t border-line bg-canvas shadow-[0_-8px_30px_rgba(16,24,40,.16)] lg:static lg:bottom-0 lg:z-auto lg:order-1 lg:!translate-y-0 lg:rounded-none lg:border-r lg:border-t-0 lg:shadow-none ${
        isDragging
          ? ''
          : 'transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none'
      }`}
    >
      <button
        type="button"
        aria-label={`추천 코스 목록 시트 · ${SNAP_LABELS[snap]} 높이. 위아래 방향키로 조절하세요.`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp') onSnapChange(stepSheetSnap(snap, 1));
          else if (event.key === 'ArrowDown') onSnapChange(stepSheetSnap(snap, -1));
          else return;
          event.preventDefault();
        }}
        className="flex h-9 w-full shrink-0 touch-none items-center justify-center rounded-t-2xl lg:hidden"
      >
        <span aria-hidden className="h-1.5 w-10 rounded-full bg-line-dashed" />
      </button>

      <div className="min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden px-4 pb-[var(--sheet-pad-b)] pt-1 sm:px-5 lg:pb-32 lg:pt-[26px]">
        {children}
      </div>
    </div>
  );
}
