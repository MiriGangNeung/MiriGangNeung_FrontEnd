import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createWalkingRouteDevMiddleware } from './walking-route-dev';

const servers: ReturnType<typeof createServer>[] = [];

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) =>
        new Promise<void>((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        }),
    ),
  );
});

describe('createWalkingRouteDevMiddleware', () => {
  it('serves the shared walking route handler from a local HTTP server', async () => {
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
              ],
            },
          ],
        },
      }),
    );
    const middleware = createWalkingRouteDevMiddleware({ apiKey: 'secret', fetch: kakaoFetch });
    const server = createServer((request, response) => {
      void middleware(request, response, () => {
        response.statusCode = 404;
        response.end();
      });
    });
    servers.push(server);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address() as AddressInfo;
    const stops = encodeURIComponent(
      JSON.stringify([
        { name: 'Start', lat: 37.9, lng: 128.8 },
        { name: 'End', lat: 37.91, lng: 128.81 },
      ]),
    );

    const response = await fetch(`http://127.0.0.1:${port}/api/walking-route?stops=${stops}`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      points: [
        { lat: 37.9, lng: 128.8 },
        { lat: 37.91, lng: 128.81 },
      ],
    });
  });
});
