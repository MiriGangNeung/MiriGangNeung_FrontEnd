type CoursePoint = { x: number; y: number };
type CourseViewport = { width: number; height: number };
type CoursePreviewSize = { width: number; height: number };

export type CourseDropCard = { id: string; top: number; bottom: number };

export function hasCourseDragThreshold(
  start: CoursePoint,
  current: CoursePoint,
  threshold = 6,
): boolean {
  return Math.hypot(current.x - start.x, current.y - start.y) >= threshold;
}

export function getCourseDragPreviewPosition(
  point: CoursePoint,
  viewport: CourseViewport,
  previewSize: CoursePreviewSize,
  pointerOffset: CoursePoint = {
    x: previewSize.width / 2,
    y: previewSize.height / 2,
  },
  padding = 16,
): { left: number; top: number } {
  const maxLeft = Math.max(padding, viewport.width - previewSize.width - padding);
  const maxTop = Math.max(padding, viewport.height - previewSize.height - padding);
  return {
    left: Math.min(maxLeft, Math.max(padding, point.x - pointerOffset.x)),
    top: Math.min(maxTop, Math.max(padding, point.y - pointerOffset.y)),
  };
}

export function resolveCourseDropTarget(
  targetId: string | null | undefined,
  fallbackId: string | null,
): string | null {
  const normalizedTargetId = targetId?.trim();
  return normalizedTargetId || fallbackId;
}

export function resolveCourseDropOnRelease(
  targetId: string | null | undefined,
  fallbackId: string | null,
  isInsideCourseList: boolean,
): string | null {
  if (!isInsideCourseList) return null;
  return resolveCourseDropTarget(targetId, fallbackId);
}

export function getCourseDropSlotIndex(
  stopIds: string[],
  draggedStopId: string | null,
  targetStopId: string | null,
): number | null {
  if (!draggedStopId || !targetStopId || draggedStopId === targetStopId) return null;

  const draggedIndex = stopIds.indexOf(draggedStopId);
  const targetIndex = stopIds.indexOf(targetStopId);
  if (draggedIndex < 0 || targetIndex < 0) return null;

  return draggedIndex < targetIndex ? targetIndex + 1 : targetIndex;
}

export function getCourseDropSlotIndexAtPoint(
  cards: CourseDropCard[],
  draggedStopId: string | null,
  pointerY: number,
): number | null {
  if (!draggedStopId) return null;

  const stationaryCards = cards.filter((card) => card.id !== draggedStopId);
  if (stationaryCards.length === 0) return null;

  const slotIndex = stationaryCards.findIndex((card) => pointerY < (card.top + card.bottom) / 2);
  return slotIndex >= 0 ? slotIndex : stationaryCards.length;
}

export function getCourseDropIndicatorIndex(
  stopIds: string[],
  draggedStopId: string | null,
  stationarySlotIndex: number | null,
): number | null {
  if (!draggedStopId || stationarySlotIndex === null) return null;

  const draggedIndex = stopIds.indexOf(draggedStopId);
  if (draggedIndex < 0 || stationarySlotIndex < 0 || stationarySlotIndex >= stopIds.length) {
    return null;
  }

  return stationarySlotIndex > draggedIndex ? stationarySlotIndex + 1 : stationarySlotIndex;
}

export function getCourseMoveTargetIndex(
  stopIds: string[],
  draggedStopId: string | null,
  stationarySlotIndex: number | null,
): number | null {
  if (!draggedStopId || stationarySlotIndex === null) return null;
  if (!stopIds.includes(draggedStopId)) return null;

  const stationaryCount = stopIds.length - 1;
  if (stationarySlotIndex < 0 || stationarySlotIndex > stationaryCount) return null;

  return stationarySlotIndex;
}
