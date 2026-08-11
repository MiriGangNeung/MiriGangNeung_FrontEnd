import { describe, expect, it } from 'vitest';

import { mapTourismPhotosResponse } from './tourismPhotosApi';

describe('mapTourismPhotosResponse', () => {
  it('maps gallery photos to picker places with gallery ids and source', () => {
    expect(
      mapTourismPhotosResponse({
        content: [
          {
            id: 'gallery-1',
            title: '강릉의 밤',
            location: '강릉시 경포대',
            photographyMonth: '202405',
            keywords: ['강릉', '야경', '바다'],
            originalImageUrl: 'http://tong.visitkorea.or.kr/cms/gallery-original.jpg',
            thumbnailUrl: null,
            photographer: '홍길동',
          },
        ],
        page: 0,
        size: 100,
        totalElements: 1,
        totalPages: 1,
      }),
    ).toEqual([
      {
        id: 'kto-gallery:gallery-1',
        name: '강릉의 밤',
        region: '강릉시 경포대',
        tags: ['강릉', '야경'],
        cat: 'nature',
        lat: 0,
        lng: 0,
        thumbnailUrl: 'https://tong.visitkorea.or.kr/cms/gallery-original.jpg',
        source: 'gallery',
      },
    ]);
  });

  it('uses the gallery thumbnail when the original is missing and filters image-less entries', () => {
    expect(
      mapTourismPhotosResponse({
        content: [
          {
            id: 'gallery-2',
            title: '썸네일만 있음',
            location: '강릉시',
            photographyMonth: '202406',
            keywords: [],
            originalImageUrl: ' ',
            thumbnailUrl: 'https://tour.example/gallery-fallback.jpg',
            photographer: null,
          },
          {
            id: 'gallery-3',
            title: '이미지 없음',
            location: '강릉시',
            photographyMonth: '202407',
            keywords: null,
            originalImageUrl: null,
            thumbnailUrl: null,
            photographer: null,
          },
        ],
        page: 0,
        size: 100,
        totalElements: 2,
        totalPages: 1,
      }),
    ).toEqual([
      {
        id: 'kto-gallery:gallery-2',
        name: '썸네일만 있음',
        region: '강릉시',
        tags: ['관광사진 갤러리'],
        cat: 'nature',
        lat: 0,
        lng: 0,
        thumbnailUrl: 'https://tour.example/gallery-fallback.jpg',
        source: 'gallery',
      },
    ]);
  });
});
