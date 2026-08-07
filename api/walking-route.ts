import { flattenWalkingRoute, type RoutePoint, type RouteStop } from '../src/lib/walkingRoute.ts';

type RouteHandlerDependencies = {
  apiKey: string | undefined;
  fetch: typeof globalThis.fetch;
};

const KAKAO_WALKING_ROUTE_URL = 'https://dapi.kakao.com/v2/routing/walk';
const MAX_STOPS_PER_REQUEST = 7;

export async function handleWalkingRoute(
  request: Request,
  { apiKey, fetch: requestFetch }: RouteHandlerDependencies,
): Promise<Response> {
  const stops = parseStops(new URL(request.url).searchParams.get('stops'));
  if (!stops) return json({ error: 'At least two valid stops are required' }, 400);
  if (!apiKey) return json({ error: 'KAKAO_REST_API_KEY is not configured' }, 500);

  try {
    const points: RoutePoint[] = [];
    for (const batch of toRouteBatches(stops)) {
      const segment = await requestWalkingRoute(batch, apiKey, requestFetch);
      if (segment.length < 2) return json({ error: 'Kakao walking route request failed' }, 502);
      appendUniquePoints(points, segment);
    }

    return json({ points });
  } catch {
    return json({ error: 'Kakao walking route request failed' }, 502);
  }
}

export default {
  fetch(request: Request) {
    return handleWalkingRoute(request, {
      apiKey: process.env.KAKAO_REST_API_KEY,
      fetch: globalThis.fetch,
    });
  },
};

async function requestWalkingRoute(stops: RouteStop[], apiKey: string, requestFetch: typeof fetch) {
  const start = stops[0];
  const end = stops[stops.length - 1];
  const waypoints = stops.slice(1, -1);
  const params = new URLSearchParams({
    start_x: String(start.lng),
    start_y: String(start.lat),
    end_x: String(end.lng),
    end_y: String(end.lat),
    s_name: start.name,
    e_name: end.name,
    input_coord: 'WGS84',
    output_coord: 'WGS84',
    route_mode: 'SHORTEST',
  });
  if (waypoints.length > 0) {
    params.set('via_x', waypoints.map((stop) => stop.lng).join(','));
    params.set('via_y', waypoints.map((stop) => stop.lat).join(','));
    params.set('v_name', waypoints.map((stop) => stop.name.replaceAll(',', ' ')).join(','));
  }
  const response = await requestFetch(`${KAKAO_WALKING_ROUTE_URL}?${params}`, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });
  if (!response.ok) throw new Error('Kakao walking route request failed');

  return flattenWalkingRoute(await response.json());
}

function toRouteBatches(stops: RouteStop[]): RouteStop[][] {
  const batches: RouteStop[][] = [];
  for (let index = 0; index < stops.length - 1; index += MAX_STOPS_PER_REQUEST - 1) {
    batches.push(stops.slice(index, index + MAX_STOPS_PER_REQUEST));
  }
  return batches;
}

function parseStops(rawStops: string | null): RouteStop[] | null {
  if (!rawStops) return null;

  try {
    const value: unknown = JSON.parse(rawStops);
    if (!Array.isArray(value) || value.length < 2) return null;
    if (!value.every(isRouteStop)) return null;
    return value;
  } catch {
    return null;
  }
}

function isRouteStop(value: unknown): value is RouteStop {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof value.name === 'string' &&
    value.name.length > 0 &&
    'lat' in value &&
    typeof value.lat === 'number' &&
    Number.isFinite(value.lat) &&
    'lng' in value &&
    typeof value.lng === 'number' &&
    Number.isFinite(value.lng)
  );
}

function appendUniquePoints(target: RoutePoint[], points: RoutePoint[]) {
  for (const point of points) {
    const previous = target[target.length - 1];
    if (!previous || previous.lat !== point.lat || previous.lng !== point.lng) target.push(point);
  }
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}
