# Kakao Walking Route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Draw a Kakao walking route between the ordered course stops without exposing the Kakao REST API key.

**Architecture:** A shared server handler owns Kakao REST API communication and returns normalized route points through both Vercel and the Vite development server. It sends up to five intermediate stops through Kakao's waypoint parameters, batches larger courses, and the React map draws only the returned walking geometry.

**Tech Stack:** React 18, TypeScript, Vite, Vercel serverless functions, Kakao Maps JavaScript SDK, Kakao Mobility REST API, Vitest.

## Global Constraints

- Keep `VITE_KAKAO_MAP_API_KEY` limited to the Kakao Maps JavaScript SDK.
- Use server-only `KAKAO_REST_API_KEY` for the walking-route API.
- Preserve the existing `CourseMap` props and card/marker selection behavior.
- Use Kakao walking `route_mode=SHORTEST` and preserve stop order.
- Never draw a straight-line route as a substitute for walking geometry.

---

### Task 1: Route geometry helpers

**Files:**

- Create: `src/lib/walkingRoute.ts`
- Create: `src/lib/walkingRoute.test.ts`

**Interfaces:**

- Produces: `flattenWalkingRoute(response): RoutePoint[]` and `fetchWalkingRoute(stops): Promise<RoutePoint[]>`.

- [ ] **Step 1: Write failing tests** for flattening steps in order, converting `[lng, lat]` to `{ lat, lng }`, and removing a duplicated junction point.
- [ ] **Step 2: Run** `npm test -- --run src/lib/walkingRoute.test.ts` and confirm the module is absent.
- [ ] **Step 3: Implement** the exported types, pure flattening function, and same-origin fetcher that rejects non-OK responses and malformed payloads.
- [ ] **Step 4: Re-run** the focused test and confirm it passes.

### Task 2: Server-side Kakao REST proxy

**Files:**

- Create: `api/walking-route.ts`
- Create: `api/walking-route.test.ts`
- Modify: `vercel.json`

**Interfaces:**

- Consumes: `GET /api/walking-route?stops=<JSON>` and `KAKAO_REST_API_KEY`.
- Produces: `200 { points: RoutePoint[] }`, or status 400/500/502 with an error message.

- [ ] **Step 1: Write failing tests** for invalid stops (400), missing server key (500), Kakao's non-OK status (502), and a successful two-stop request producing flattened points.
- [ ] **Step 2: Run** `npm test -- --run api/walking-route.test.ts` and confirm failure before implementation.
- [ ] **Step 3: Implement** parsing, numeric-coordinate validation, overlapping batches of at most seven stops, `via_x/via_y/v_name`, `Authorization: KakaoAK`, `route_mode=SHORTEST`, status validation, and point flattening.
- [ ] **Step 4: Configure** Vercel routing so `/api/*` is served by the function and the SPA rewrite remains a fallback.
- [ ] **Step 5: Re-run** the focused tests and confirm they pass.

### Task 3: Local development endpoint and map overlay integration

**Files:**

- Modify: `src/components/organisms/CourseMap.tsx`
- Modify: `src/types/kakao-maps.d.ts`
- Modify: `vite.config.ts`
- Test: `src/lib/walkingRoute.test.ts`

**Interfaces:**

- Consumes: `fetchWalkingRoute(stops)` and `RoutePoint[]`.
- Produces: a Vite `/api/walking-route` middleware and a removable Kakao `Polyline` created only from successful walking-route points.

- [ ] **Step 1: Write failing tests** proving waypoint parameters and the client non-OK response contract.
- [ ] **Step 2: Run** the focused test and confirm the expected failure.
- [ ] **Step 3: Mount the shared handler in Vite and refactor CourseMap** to create a solid polyline only after non-empty walking geometry arrives, retain markers on failure, and ignore stale requests during cleanup.
- [ ] **Step 4: Re-run** focused tests and `npm run build`.

### Task 4: Full verification

**Files:** none

- [ ] **Step 1: Run** `npm test -- --run`.
- [ ] **Step 2: Run** `npm run lint`.
- [ ] **Step 3: Run** `npm run build`.
- [ ] **Step 4: Inspect** `git diff --check` and the changed file list for accidental key exposure.
