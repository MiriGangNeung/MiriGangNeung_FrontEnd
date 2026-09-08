import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CompositeResult } from './CompositeResult';

describe('CompositeResult', () => {
  it('shows the time when the displayed composition completed', () => {
    const completionProps = { compositionCompletedAt: '2026-09-08T13:19:00.000Z' };
    const markup = renderToStaticMarkup(
      <CompositeResult
        imageUrl="https://images.example.test/composition.png"
        onRegenerate={() => undefined}
        onNext={() => undefined}
        {...completionProps}
      />,
    );

    expect(markup).toContain('9/8 22:19');
    expect(markup).not.toContain('7/30 22:19');
  });
});
