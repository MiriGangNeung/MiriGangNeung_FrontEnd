import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CourseResultHeader } from './CourseResultHeader';

const baseProps = {
  isPlaceAdderOpen: false,
  durationText: '당일',
  courseStopCount: 3,
  totalDistanceText: '1.2km',
  tags: ['원픽 경포해변', '자연'],
  onTogglePlaceAdder: vi.fn(),
};

describe('CourseResultHeader', () => {
  it('hides the course overview and toggle while the place adder is open', () => {
    const markup = renderToStaticMarkup(<CourseResultHeader {...baseProps} isPlaceAdderOpen />);

    expect(markup).toBe('');
  });

  it('restores the course overview and add-place toggle after closing the panel', () => {
    const markup = renderToStaticMarkup(<CourseResultHeader {...baseProps} />);

    expect(markup).toContain('나만의 강릉 코스');
    expect(markup).toContain('새로운 장소 추가');
    expect(markup).not.toContain('장소 추가 닫기');
  });
});
