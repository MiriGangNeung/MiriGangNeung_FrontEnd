import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CourseOptions } from './CourseOptions';

describe('CourseOptions duration controls', () => {
  it('does not render a travel duration selector or a duration summary', () => {
    const markup = renderToStaticMarkup(
      <CourseOptions
        places={[]}
        picks={[]}
        onePick=""
        types={['rest']}
        detailTypes={[]}
        companion="couple"
        onToggleType={() => undefined}
        onToggleDetailType={() => undefined}
        onCompanion={() => undefined}
        onNext={() => undefined}
      />,
    );

    expect(markup).not.toContain('여행 기간');
    expect(markup).not.toContain('당일');
    expect(markup).not.toContain('1박 2일');
    expect(markup).not.toContain('직접 설정');
    expect(markup).not.toContain('기간');
  });
});
