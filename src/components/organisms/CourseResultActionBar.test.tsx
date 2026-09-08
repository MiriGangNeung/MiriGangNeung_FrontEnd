import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CourseResultActionBar } from './CourseResultActionBar';

describe('CourseResultActionBar', () => {
  it('replaces the composite-image action with a disabled add action until a place is selected', () => {
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
    expect(markup).not.toContain('합성 이미지 보기');
  });

  it('shows the composite-image and save actions when the place adder is closed', () => {
    const markup = renderToStaticMarkup(
      <CourseResultActionBar
        isPlaceAdderOpen={false}
        canConfirmPlace={false}
        compositeImageUrl="http://localhost:8080/api/v1/compositions/job-1/download"
        onBack={vi.fn()}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(markup).toContain('합성 이미지 보기');
    expect(markup).toContain('저장');
    expect(markup).not.toContain('코스에 추가');
    expect(markup).not.toContain('스토리 카드 만들기');
  });

  it('disables the composite-image and save actions when no composite image exists', () => {
    const markup = renderToStaticMarkup(
      <CourseResultActionBar
        isPlaceAdderOpen={false}
        canConfirmPlace={false}
        onBack={vi.fn()}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(markup.match(/disabled=""/g)?.length).toBe(2);
  });
});
