# Kakao Walking Route Design

## Goal

Replace the straight-line course overlay with Kakao's walking-route geometry while preserving the existing Kakao map, numbered markers, card-to-marker selection, and marker-to-card selection.

## Architecture

The browser calls a same-origin `GET /api/walking-route` endpoint with the ordered course stops. A Vercel serverless function validates that input, requests Kakao's walking-route REST API using the server-only `KAKAO_REST_API_KEY`, and returns only the route coordinates required by the map. The REST key is never included in Vite environment variables or client bundles.

The function sends the first stop as `start_x/start_y`, the last stop as `end_x/end_y`, and up to five intermediate stops as `via_x/via_y/v_name`. A course of more than seven stops is split into overlapping batches of at most seven stops so every request stays within Kakao's five-waypoint limit. It flattens each successful response's `legs[].steps[].path.points` into ordered `[longitude, latitude]` pairs, removing duplicated junction points.

`CourseMap` renders markers immediately but does not draw a straight-line route. After a successful response it draws only the returned walking geometry as a solid Kakao Maps `Polyline`. If routing fails, the markers and selection behavior remain available without showing a misleading straight route.

Vercel serves the endpoint in production. The Vite development server mounts the same handler at `/api/walking-route`, loading `KAKAO_REST_API_KEY` on the server side so `npm run dev` exercises the same route contract without exposing the REST key to browser code.

## API Contract

`GET /api/walking-route?stops=<JSON>` receives an array of `{ name, lat, lng }` values. It returns `{ points: Array<{ lat: number; lng: number }> }` with at least two points on success. Invalid input returns 400; a missing server key returns 500; Kakao failures return 502. The route mode is `SHORTEST`.

## Testing

- Unit-test route-point flattening and duplicate-junction removal.
- Unit-test input validation, waypoint query construction, batching, and API response handling without making a live Kakao request.
- Unit-test the client route fetcher error contract.
- Verify the local Vite endpoint returns Kakao walking geometry with the configured REST key.
- Run the full Vitest suite, ESLint, and production build.
