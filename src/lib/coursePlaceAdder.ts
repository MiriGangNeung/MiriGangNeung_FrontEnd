type CoursePlaceAdderAnchor = { top: number; right: number };
type CoursePlaceAdderViewport = { width: number; height: number };
type CoursePlaceAdderPanelSize = { width: number; height: number };

export function getCoursePlaceAdderPosition(
  anchor: CoursePlaceAdderAnchor,
  viewport: CoursePlaceAdderViewport,
  panelSize: CoursePlaceAdderPanelSize,
  gap = 12,
  padding = 16,
): { left: number; top: number } {
  const maxLeft = Math.max(padding, viewport.width - panelSize.width - padding);
  const maxTop = Math.max(padding, viewport.height - panelSize.height - padding);

  return {
    left: Math.min(maxLeft, Math.max(padding, anchor.right + gap)),
    top: Math.min(maxTop, Math.max(padding, anchor.top)),
  };
}
