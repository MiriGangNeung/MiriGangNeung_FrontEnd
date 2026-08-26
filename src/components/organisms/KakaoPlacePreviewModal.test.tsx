import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { KakaoPlacePreviewModal } from './KakaoPlacePreviewModal';
import type { NearbyPlace } from '../../types/domain';

const place: NearbyPlace = {
  externalPlaceId: 'kakao-1',
  name: '카페 예시',
  category: 'cafe',
  categoryName: '음식점 > 카페',
  address: '강릉시',
  roadAddress: '강릉시 창해로',
  phone: '',
  placeUrl: 'https://place.map.kakao.com/123456789',
  latitude: 37.77,
  longitude: 128.94,
  distanceMeters: 120,
};

describe('KakaoPlacePreviewModal', () => {
  it('shows the full Kakao place page in an accessible modal', () => {
    const markup = renderToStaticMarkup(
      <KakaoPlacePreviewModal place={place} onClose={() => undefined} />,
    );

    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('aria-label="카페 예시 카카오맵 상세 정보"');
    expect(markup).toContain('src="https://place.map.kakao.com/123456789"');
    expect(markup).toContain('title="카페 예시 카카오맵 상세 정보"');
  });

  it('keeps a new-tab fallback available alongside the embedded page', () => {
    const markup = renderToStaticMarkup(
      <KakaoPlacePreviewModal place={place} onClose={() => undefined} />,
    );

    expect(markup).toContain('카카오맵에서 새 탭으로 열기');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noreferrer"');
  });
});
