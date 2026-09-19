import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ProgressHeader } from './ProgressHeader';

describe('ProgressHeader branding', () => {
  it('uses the intro serif typeface for the brand and its supporting copy', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/background-picker']}>
        <ProgressHeader />
      </MemoryRouter>,
    );

    expect(markup.match(/font-serif/g)).toHaveLength(2);
    expect(markup).toContain('aria-label="미리강릉 첫 화면으로 이동"');
    expect(markup).toContain('title="처음으로"');
  });
});
