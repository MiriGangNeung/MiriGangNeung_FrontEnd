import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CourseResultActionBar } from './CourseResultActionBar';

describe('CourseResultActionBar', () => {
  it('replaces the story-card action with a disabled add action until a place is selected', () => {
    const markup = renderToStaticMarkup(
      <CourseResultActionBar
        isPlaceAdderOpen
        canConfirmPlace={false}
        onBack={vi.fn()}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(markup).toContain('코스에 추가');
    expect(markup).toContain('disabled=""');
    expect(markup).not.toContain('스토리 카드 만들기');
  });

  it('restores the story-card action when the place adder is closed', () => {
    const markup = renderToStaticMarkup(
      <CourseResultActionBar
        isPlaceAdderOpen={false}
        canConfirmPlace={false}
        onBack={vi.fn()}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(markup).toContain('스토리 카드 만들기');
    expect(markup).not.toContain('코스에 추가');
  });
});
