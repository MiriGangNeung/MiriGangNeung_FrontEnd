import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchAwardPhotos, mapAwardPhotosResponse } from './awardPhotosApi';

describe('mapAwardPhotosResponse', () => {
  it('maps award photos to picker places and prefers the original image', () => {
    expect(
      mapAwardPhotosResponse({
        content: [
          {
            id: 'award-1',
            title: '강릉의 밤',
            location: '강릉시 경포대',
            award: '디지털카메라 부문 [금상]',
            keywords: ['강릉', '야경', '바다'],
            originalImageUrl: 'https://tour.example/award-original.jpg',
            thumbnailUrl: 'https://tour.example/award-thumb.jpg',
          },
        ],
        page: 0,
        size: 100,
        totalElements: 1,
        totalPages: 1,
      }),
    ).toEqual([
      {
        id: 'kto-award:award-1',
        name: '강릉의 밤',
        region: '강릉시 경포대',
        tags: ['디지털카메라 부문 [금상]', '강릉', '야경'],
        cat: 'nature',
        lat: 0,
        lng: 0,
        thumbnailUrl: 'https://tour.example/award-original.jpg',
      },
    ]);
  });

  it('uses the thumbnail when the original is missing and filters image-less entries', () => {
    expect(
      mapAwardPhotosResponse({
        content: [
          {
            id: 'award-2',
            title: '썸네일만 있음',
            location: '강릉시',
            award: '입선',
            keywords: ['바다'],
            originalImageUrl: ' ',
            thumbnailUrl: 'https://tour.example/award-fallback.jpg',
          },
          {
            id: 'award-3',
            title: '이미지 없음',
            location: '강릉시',
            award: '입선',
            keywords: [],
            originalImageUrl: null,
            thumbnailUrl: null,
          },
        ],
        page: 0,
        size: 100,
        totalElements: 2,
        totalPages: 1,
      }),
    ).toEqual([
      {
        id: 'kto-award:award-2',
        name: '썸네일만 있음',
        region: '강릉시',
        tags: ['입선', '바다'],
        cat: 'nature',
        lat: 0,
        lng: 0,
        thumbnailUrl: 'https://tour.example/award-fallback.jpg',
      },
    ]);
  });
});

describe('fetchAwardPhotos', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests the award photo endpoint with the Gangwon picker parameters', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ content: [], page: 0, size: 100, totalElements: 0, totalPages: 0 }),
          { status: 200 },
        ),
      );
    vi.stubGlobal('fetch', fetchMock);

    await fetchAwardPhotos('http://localhost:8080/api/v1');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/award-photos?region=51&page=0&size=100',
    );
  });

  it('rejects a failed backend response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Unavailable', { status: 502 })));

    await expect(fetchAwardPhotos('http://localhost:8080/api/v1')).rejects.toThrow(
      'Award photo request failed (502)',
    );
  });
});
