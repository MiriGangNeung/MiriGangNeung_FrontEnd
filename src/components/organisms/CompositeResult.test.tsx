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

describe('CompositeResult generative-AI expectation setting', () => {
  // 어색함을 실제로 마주하는 화면이다. 설명이 없으면 사용자가 결함을 고장으로 읽는다.
  it('explains that the result can look off and points at regeneration', () => {
    const markup = renderToStaticMarkup(
      <CompositeResult
        imageUrl="https://images.example.test/composition.png"
        onRegenerate={() => undefined}
        onNext={() => undefined}
      />,
    );

    expect(markup).toContain('AI가 그린 이미지라');
    expect(markup).toContain('다시 생성하기');
  });
});

describe('CompositeResult server quality warnings', () => {
  // 서버가 이 이미지에 대해 판정한 경고(severity: warn)는 결과를 막지 않는다.
  // 일반 안내보다 구체적이므로 그 자리를 대신한다.
  it('shows the server warning instead of the generic notice', () => {
    const markup = renderToStaticMarkup(
      <CompositeResult
        imageUrl="https://images.example.test/composition.png"
        warnings={[
          {
            code: 'FACE_NOT_PRESERVED',
            message: '얼굴이 실제 모습과 조금 다르게 표현됐을 수 있습니다.',
          },
        ]}
        onRegenerate={() => undefined}
        onNext={() => undefined}
      />,
    );

    expect(markup).toContain('얼굴이 실제 모습과 조금 다르게 표현됐을 수 있습니다.');
    expect(markup).toContain('role="status"');
    // 같은 말을 두 번 하지 않는다.
    expect(markup).not.toContain('AI가 그린 이미지라');
  });

  it('falls back to generic wording when the server sends a code without a message', () => {
    const markup = renderToStaticMarkup(
      <CompositeResult
        imageUrl="https://images.example.test/composition.png"
        warnings={[{ code: 'SOME_NEW_CODE', message: null }]}
        onRegenerate={() => undefined}
        onNext={() => undefined}
      />,
    );

    expect(markup).toContain('생성 결과에 확인이 필요한 부분이 있어요.');
  });

  it('keeps the generic notice when there is no warning', () => {
    const markup = renderToStaticMarkup(
      <CompositeResult
        imageUrl="https://images.example.test/composition.png"
        onRegenerate={() => undefined}
        onNext={() => undefined}
      />,
    );

    expect(markup).toContain('AI가 그린 이미지라');
    expect(markup).not.toContain('role="status"');
  });
});
