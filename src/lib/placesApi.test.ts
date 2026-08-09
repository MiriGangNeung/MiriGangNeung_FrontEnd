import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchPlaces, mapPlacesResponse } from './placesApi';

describe('mapPlacesResponse', () => {
  it('maps backend place content to the frontend place shape and keeps image URLs', () => {
    expect(
      mapPlacesResponse({
        content: [
          {
            id: 'place-uuid',
            name: '경포대',
            region: '강릉시',
            category: 'nature',
            tags: [],
            thumbnailUrl: 'https://tour.example/gyeongpo.jpg',
            latitude: 37.8,
            longitude: 128.9,
          },
        ],
        page: 0,
        size: 100,
        totalElements: 1,
        totalPages: 1,
      }),
    ).toEqual([
      {
        id: 'place-uuid',
        name: '경포대',
        region: '강릉시',
        tags: ['자연'],
        cat: 'nature',
        lat: 37.8,
        lng: 128.9,
        thumbnailUrl: 'https://tour.example/gyeongpo.jpg',
      },
    ]);
  });
});

describe('fetchPlaces', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests the backend place list with the maximum picker page size', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ content: [], page: 0, size: 100, totalElements: 0, totalPages: 0 }),
          { status: 200 },
        ),
      );
    vi.stubGlobal('fetch', fetchMock);

    await fetchPlaces('http://localhost:8080/api/v1');

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/v1/places?page=0&size=100');
  });

  it('rejects a failed backend response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Unavailable', { status: 502 })));

    await expect(fetchPlaces('http://localhost:8080/api/v1')).rejects.toThrow(
      'Place request failed (502)',
    );
  });
});
