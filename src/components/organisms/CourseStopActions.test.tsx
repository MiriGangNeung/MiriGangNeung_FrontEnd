import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CourseStopActions } from './CourseStopActions';
import type { CourseStop } from '../../types/domain';

const stop: CourseStop = {
  id: 'stop-1',
  n: 1,
  name: '경포해변',
  time: '09:00',
  stay: '60분',
  crowd: 'easy',
  note: '해변 산책',
  lat: 37.8,
  lng: 128.9,
};

const baseProps = {
  stop,
  onDelete: () => {},
  onPointerDown: () => {},
  onLostPointerCapture: () => {},
  isDragging: false,
  isOptimizingRoute: false,
};

describe('CourseStopActions', () => {
  it('hides delete and the drag handle while the compact place-adder cards are visible', () => {
    const markup = renderToStaticMarkup(<CourseStopActions {...baseProps} isPlaceAdderOpen />);

    expect(markup).not.toContain('data-course-stop-delete');
    expect(markup).not.toContain('data-course-stop-menu');
    expect(markup).not.toContain('data-course-stop-drag-handle');
  });

  it('keeps the destructive action behind a menu on full-size cards', () => {
    const markup = renderToStaticMarkup(
      <CourseStopActions {...baseProps} isPlaceAdderOpen={false} />,
    );

    expect(markup).toContain('data-course-stop-menu');
    expect(markup).not.toContain('data-course-stop-delete');
  });

  it('disables card mutations while the walking route is being optimized', () => {
    const markup = renderToStaticMarkup(
      <CourseStopActions {...baseProps} isPlaceAdderOpen={false} isOptimizingRoute />,
    );
    const menuButton = markup
      .split('<button')
      .find((button) => button.includes('data-course-stop-menu'));
    const dragButton = markup
      .split('<button')
      .find((button) => button.includes('data-course-stop-drag-handle'));

    expect(menuButton).toContain('disabled=""');
    expect(dragButton).toContain('disabled=""');
  });
});
