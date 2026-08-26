import { describe, expect, it } from 'vitest';
import {
  getCourseDragPreviewPosition,
  getCourseDropSlotIndex,
  hasCourseDragThreshold,
  resolveCourseDropOnRelease,
  resolveCourseDropTarget,
} from './courseDragDrop';

describe('course drag and drop target', () => {
  it('keeps the last valid target when the pointer leaves a stop card', () => {
    expect(resolveCourseDropTarget(' stop-2 ', 'stop-1')).toBe('stop-2');
    expect(resolveCourseDropTarget('', 'stop-1')).toBe('stop-1');
    expect(resolveCourseDropTarget(null, null)).toBeNull();
  });

  it('cancels a release outside the course list instead of using the last target', () => {
    expect(resolveCourseDropOnRelease(null, 'stop-2', false)).toBeNull();
    expect(resolveCourseDropOnRelease('stop-3', 'stop-2', false)).toBeNull();
    expect(resolveCourseDropOnRelease(null, 'stop-2', true)).toBe('stop-2');
  });

  it('starts dragging only after the pointer moves past the click threshold', () => {
    expect(hasCourseDragThreshold({ x: 100, y: 100 }, { x: 103, y: 103 })).toBe(false);
    expect(hasCourseDragThreshold({ x: 100, y: 100 }, { x: 105, y: 104 })).toBe(true);
  });

  it('keeps the full-size lifted card centered on the grab point and inside the viewport', () => {
    expect(
      getCourseDragPreviewPosition(
        { x: 1000, y: 760 },
        { width: 1024, height: 768 },
        { width: 320, height: 120 },
        { x: 160, y: 60 },
      ),
    ).toEqual({ left: 688, top: 632 });
  });

  it('opens an insertion slot where the dragged card will be placed', () => {
    expect(getCourseDropSlotIndex(['a', 'b', 'c'], 'c', 'b')).toBe(1);
    expect(getCourseDropSlotIndex(['a', 'b', 'c'], 'a', 'b')).toBe(2);
    expect(getCourseDropSlotIndex(['a', 'b', 'c'], 'a', 'c')).toBe(3);
    expect(getCourseDropSlotIndex(['a', 'b', 'c'], 'c', 'c')).toBeNull();
    expect(getCourseDropSlotIndex(['a', 'b', 'c'], 'x', 'b')).toBeNull();
  });
});
