import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CourseResultHeader } from './CourseResultHeader';

const baseProps = {
  isPlaceAdderOpen: false,
  courseStopCount: 3,
  totalDistanceText: '1.2km',
  tags: ['도보 25.5km · 394분', '식도락 · 휴식 · 문화 · 예술', '친구'],
  onTogglePlaceAdder: vi.fn(),
  isOptimizingRoute: false,
  routeOptimizationMessage: null,
  isCourseMutationPending: false,
  onOptimizeRoute: vi.fn(),
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
    expect(markup).toContain('경로 최적화하기');
  });

  it('wraps summary chips instead of clipping them in a horizontal scroller', () => {
    const markup = renderToStaticMarkup(<CourseResultHeader {...baseProps} />);
    const summaryStart = markup.indexOf('나만의 강릉 코스');
    const summaryEnd = markup.indexOf('경로 최적화하기', summaryStart);
    const summary = markup.slice(summaryStart, summaryEnd);

    expect(summary).toContain('flex-wrap');
    expect(summary).not.toContain('overflow-x-auto');
    expect(summary).toContain('도보 25.5km · 394분');
    expect(summary).toContain('식도락 · 휴식 · 문화 · 예술');
    expect(summary).toContain('친구');
    expect(summary).toContain('px-3 py-1.5 text-xs');
  });

  it('shows progress while the walking route is being optimized', () => {
    const markup = renderToStaticMarkup(<CourseResultHeader {...baseProps} isOptimizingRoute />);

    expect(markup).toContain('경로 계산 중');
    expect(markup).toContain('disabled=""');
  });

  it('prevents route optimization while a stop change is still saving', () => {
    const markup = renderToStaticMarkup(
      <CourseResultHeader {...baseProps} isCourseMutationPending />,
    );
    const optimizationButton = markup
      .split('<button')
      .find((button) => button.includes('장소 저장 중') || button.includes('경로 최적화하기'));

    expect(optimizationButton).toContain('disabled=""');
  });

  it('prevents opening the place adder while route optimization is running', () => {
    const markup = renderToStaticMarkup(<CourseResultHeader {...baseProps} isOptimizingRoute />);
    const addPlaceButton = markup
      .split('<button')
      .find((button) => button.includes('새로운 장소 추가'));

    expect(addPlaceButton).toContain('disabled=""');
  });
});
