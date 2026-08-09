import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchBackgroundPhotos } from './backgroundPhotosApi';

const awardResponse = () =>
  new Response(
    JSON.stringify({
      content: [
        {
          id: 'award-1',
          title: '공모전 사진',
          location: '강릉시',
          award: '금상',
          keywords: ['강릉'],
          originalImageUrl: 'https://tour.example/award.jpg',
          thumbnailUrl: null,
        },
      ],
      page: 0,
      size: 100,
      totalElements: 1,
      totalPages: 1,
    }),
    { status: 200 },
  );

const galleryResponse = () =>
  new Response(
    JSON.stringify({
      content: [
        {
          id: 'gallery-1',
          title: '갤러리 사진',
          location: '강릉시',
          photographyMonth: '202405',
          keywords: ['바다'],
          originalImageUrl: 'https://tour.example/gallery.jpg',
          thumbnailUrl: null,
          photographer: '촬영자',
        },
      ],
      page: 0,
      size: 100,
      totalElements: 1,
      totalPages: 1,
    }),
    { status: 200 },
  );

describe('fetchBackgroundPhotos', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests both sources concurrently and merges successful results', async () => {
    const fetchMock = vi.fn((input: string | URL | Request) => {
      const endpoint = String(input);
      return Promise.resolve(
        endpoint.includes('/award-photos?') ? awardResponse() : galleryResponse(),
      );
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchBackgroundPhotos('http://localhost:8080/api/v1');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/award-photos?page=0&size=100',
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/tourism-photos?page=0&size=100',
    );
    expect(result.map((place) => place.id)).toEqual(['kto-award:award-1', 'kto-gallery:gallery-1']);
  });

  it('keeps one source available when the other source fails', async () => {
    const fetchMock = vi.fn((input: string | URL | Request) => {
      const endpoint = String(input);
      if (endpoint.includes('/award-photos?')) {
        return Promise.reject(new Error('award unavailable'));
      }
      return Promise.resolve(galleryResponse());
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchBackgroundPhotos('http://localhost:8080/api/v1');

    expect(result.map((place) => place.id)).toEqual(['kto-gallery:gallery-1']);
  });

  it('rejects when both sources fail', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('sources unavailable')));

    await expect(fetchBackgroundPhotos('http://localhost:8080/api/v1')).rejects.toThrow(
      'Background photo requests failed',
    );
  });
});
