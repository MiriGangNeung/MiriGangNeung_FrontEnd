import { describe, expect, it, vi } from 'vitest';

import { fetchWalkingRoute, flattenWalkingRoute } from './walkingRoute';

describe('flattenWalkingRoute', () => {
  it('converts Kakao step coordinates to ordered map coordinates without duplicate joins', () => {
    expect(
      flattenWalkingRoute({
        status: 'OK',
        route: {
          legs: [
            {
              steps: [
                {
                  path: {
                    points: [
                      [128.8, 37.9],
                      [128.81, 37.91],
                    ],
                  },
                },
                {
                  path: {
                    points: [
                      [128.81, 37.91],
                      [128.82, 37.92],
                    ],
                  },
                },
              ],
            },
          ],
        },
      }),
    ).toEqual([
      { lat: 37.9, lng: 128.8 },
      { lat: 37.91, lng: 128.81 },
      { lat: 37.92, lng: 128.82 },
    ]);
  });
});

describe('fetchWalkingRoute', () => {
  it('rejects an unsuccessful route response so the map can retain its fallback', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Unavailable', { status: 502 })));

    await expect(
      fetchWalkingRoute([
        { name: 'Start', lat: 37.9, lng: 128.8 },
        { name: 'End', lat: 37.91, lng: 128.81 },
      ]),
    ).rejects.toThrow('Walking route request failed');

    vi.unstubAllGlobals();
  });
});
