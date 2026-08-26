type CoursePoint = { x: number; y: number };
type CourseViewport = { width: number; height: number };
type CoursePreviewSize = { width: number; height: number };

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
