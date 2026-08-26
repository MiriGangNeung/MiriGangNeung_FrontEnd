import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { KakaoPlaceReviewButton } from './KakaoPlaceReviewButton';
import type { KakaoPlacePreviewTarget } from './KakaoPlaceReviewButton';

const target: KakaoPlacePreviewTarget = {
  externalPlaceId: 'kakao-1',
  name: '카페 예시',
  placeUrl: 'https://place.map.kakao.com/123456789',
};

describe('KakaoPlaceReviewButton', () => {
  it('exposes an accessible action for opening a place review preview', () => {
    const markup = renderToStaticMarkup(
      <KakaoPlaceReviewButton target={target} onOpen={() => undefined} />,
    );

    expect(markup).toContain('data-kakao-place-review-button');
    expect(markup).toContain('aria-label="카페 예시 카카오맵 리뷰 보기"');
    expect(markup).toContain('리뷰 보기');
  });

  it('supports a shorter label for inline title actions', () => {
    const markup = renderToStaticMarkup(
      <KakaoPlaceReviewButton target={target} onOpen={() => undefined} compact label="리뷰" />,
    );

    expect(markup).toContain('> 리뷰</button>');
    expect(markup).not.toContain('> 리뷰 보기</button>');
  });
});
