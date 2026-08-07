import { describe, expect, it, vi } from 'vitest';

import { handleWalkingRoute } from './walking-route';

const requestFor = (stops: unknown) =>
  new Request(
    `https://example.test/api/walking-route?stops=${encodeURIComponent(JSON.stringify(stops))}`,
  );

describe('handleWalkingRoute', () => {
  it('rejects malformed stop input before calling Kakao', async () => {
    const kakaoFetch = vi.fn();

    const response = await handleWalkingRoute(requestFor([{ name: 'Only', lat: 37.9 }]), {
      apiKey: 'secret',
      fetch: kakaoFetch,
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'At least two valid stops are required' });
    expect(kakaoFetch).not.toHaveBeenCalled();
  });

  it('rejects requests when the server REST key is unavailable', async () => {
    const response = await handleWalkingRoute(
      requestFor([
        { name: 'Start', lat: 37.9, lng: 128.8 },
        { name: 'End', lat: 37.91, lng: 128.81 },
      ]),
      { apiKey: '', fetch: vi.fn() },
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'KAKAO_REST_API_KEY is not configured' });
  });

  it('sends intermediate stops as Kakao waypoints in one route request', async () => {
    const kakaoFetch = vi.fn().mockResolvedValue(
      Response.json({
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
    );

    const response = await handleWalkingRoute(
      requestFor([
        { name: 'Start', lat: 37.9, lng: 128.8 },
        { name: 'Middle', lat: 37.91, lng: 128.81 },
        { name: 'End', lat: 37.92, lng: 128.82 },
      ]),
      { apiKey: 'secret', fetch: kakaoFetch },
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      points: [
        { lat: 37.9, lng: 128.8 },
        { lat: 37.91, lng: 128.81 },
        { lat: 37.92, lng: 128.82 },
      ],
    });
    expect(kakaoFetch).toHaveBeenCalledTimes(1);
    const requestUrl = new URL(kakaoFetch.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get('start_x')).toBe('128.8');
    expect(requestUrl.searchParams.get('start_y')).toBe('37.9');
    expect(requestUrl.searchParams.get('via_x')).toBe('128.81');
    expect(requestUrl.searchParams.get('via_y')).toBe('37.91');
    expect(requestUrl.searchParams.get('v_name')).toBe('Middle');
    expect(requestUrl.searchParams.get('end_x')).toBe('128.82');
    expect(requestUrl.searchParams.get('end_y')).toBe('37.92');
    expect(requestUrl.searchParams.get('route_mode')).toBe('SHORTEST');
  });

  it('splits courses that exceed five waypoints into overlapping route batches', async () => {
    const kakaoFetch = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          status: 'OK',
          route: {
            legs: [
              {
                steps: [
                  {
                    path: {
                      points: [
                        [128, 37],
                        [128.6, 37.6],
                      ],
                    },
                  },
                ],
              },
            ],
          },
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          status: 'OK',
          route: {
            legs: [
              {
                steps: [
                  {
                    path: {
                      points: [
                        [128.6, 37.6],
                        [128.7, 37.7],
                      ],
                    },
                  },
                ],
              },
            ],
          },
        }),
      );
    const stops = Array.from({ length: 8 }, (_, index) => ({
      name: `Stop ${index + 1}`,
      lat: 37 + index / 10,
      lng: 128 + index / 10,
    }));

    const response = await handleWalkingRoute(requestFor(stops), {
      apiKey: 'secret',
      fetch: kakaoFetch,
    });

    expect(response.status).toBe(200);
    expect(kakaoFetch).toHaveBeenCalledTimes(2);
    const firstUrl = new URL(kakaoFetch.mock.calls[0][0] as string);
    const secondUrl = new URL(kakaoFetch.mock.calls[1][0] as string);
    expect(firstUrl.searchParams.get('via_x')?.split(',')).toHaveLength(5);
    expect(firstUrl.searchParams.get('end_x')).toBe('128.6');
    expect(secondUrl.searchParams.get('start_x')).toBe('128.6');
    expect(secondUrl.searchParams.has('via_x')).toBe(false);
  });

  it('returns an upstream error when Kakao cannot calculate a segment', async () => {
    const response = await handleWalkingRoute(
      requestFor([
        { name: 'Start', lat: 37.9, lng: 128.8 },
        { name: 'End', lat: 37.91, lng: 128.81 },
      ]),
      { apiKey: 'secret', fetch: vi.fn().mockResolvedValue(new Response('', { status: 429 })) },
    );

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: 'Kakao walking route request failed' });
  });
});
