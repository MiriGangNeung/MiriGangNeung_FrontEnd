export type RoutePoint = { lat: number; lng: number };

export type RouteStop = RoutePoint & { name: string };

type KakaoWalkingRoute = {
  status: string;
  route?: {
    legs?: Array<{
      steps?: Array<{
        path?: { points?: unknown };
      }>;
    }>;
  };
};

export function flattenWalkingRoute(response: KakaoWalkingRoute): RoutePoint[] {
  if (response.status !== 'OK' || !response.route?.legs) return [];

  const points: RoutePoint[] = [];
  for (const leg of response.route.legs) {
    for (const step of leg.steps ?? []) {
      const stepPoints = step.path?.points;
      if (!Array.isArray(stepPoints)) continue;

      for (const point of stepPoints) {
        if (
          !Array.isArray(point) ||
          point.length < 2 ||
          typeof point[0] !== 'number' ||
          typeof point[1] !== 'number'
        ) {
          continue;
        }

        const nextPoint = { lng: point[0], lat: point[1] };
        const previousPoint = points[points.length - 1];
        if (
          !previousPoint ||
          previousPoint.lat !== nextPoint.lat ||
          previousPoint.lng !== nextPoint.lng
        ) {
          points.push(nextPoint);
        }
      }
    }
  }

  return points;
}

export async function fetchWalkingRoute(stops: RouteStop[]): Promise<RoutePoint[]> {
  const params = new URLSearchParams({ stops: JSON.stringify(stops) });
  const response = await fetch(`/api/walking-route?${params}`);
  if (!response.ok) throw new Error(`Walking route request failed (${response.status})`);

  const body: unknown = await response.json();
  if (!isRoutePointsResponse(body)) throw new Error('Walking route response was invalid');
  return body.points;
}

function isRoutePointsResponse(value: unknown): value is { points: RoutePoint[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'points' in value &&
    Array.isArray(value.points) &&
    value.points.every(
      (point) =>
        typeof point === 'object' &&
        point !== null &&
        'lat' in point &&
        typeof point.lat === 'number' &&
        'lng' in point &&
        typeof point.lng === 'number',
    )
  );
}
