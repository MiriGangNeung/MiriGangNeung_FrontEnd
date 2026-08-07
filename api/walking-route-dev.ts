import type { IncomingMessage, ServerResponse } from 'node:http';

import { handleWalkingRoute } from './walking-route.ts';

type WalkingRouteDependencies = Parameters<typeof handleWalkingRoute>[1];

export function createWalkingRouteDevMiddleware(dependencies: WalkingRouteDependencies) {
  return async function walkingRouteDevMiddleware(
    request: IncomingMessage,
    response: ServerResponse,
    next: () => void,
  ): Promise<void> {
    const requestUrl = request.url ?? '';
    if (request.method !== 'GET' || !requestUrl.startsWith('/api/walking-route')) {
      next();
      return;
    }

    const host = request.headers.host ?? 'localhost';
    const routeResponse = await handleWalkingRoute(
      new Request(new URL(requestUrl, `http://${host}`)),
      dependencies,
    );
    response.statusCode = routeResponse.status;
    routeResponse.headers.forEach((value, name) => response.setHeader(name, value));
    response.end(await routeResponse.text());
  };
}
