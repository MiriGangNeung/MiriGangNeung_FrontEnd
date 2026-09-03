import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CourseSheet } from './CourseSheet';

describe('CourseSheet', () => {
  it('fills to the bottom of the viewport on mobile and collapses into the column at lg', () => {
    const markup = renderToStaticMarkup(
      <CourseSheet snap="half" onSnapChange={vi.fn()}>
        <div>마지막 코스 카드</div>
      </CourseSheet>,
    );

    expect(markup).toContain('fixed inset-x-0 bottom-0');
    expect(markup).toContain('lg:static');
  });
});
