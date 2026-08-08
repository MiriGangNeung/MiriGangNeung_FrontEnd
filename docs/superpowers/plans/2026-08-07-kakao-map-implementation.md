# 카카오맵 전환 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 코스 결과의 Leaflet 지도를 카카오맵으로 교체하면서 카드, 핀, 경로의 선택 동작을 보존한다.

**Architecture:** 카카오 SDK는 모듈 단위 Promise로 한 번 로드한다. `CourseMap`은 지도 객체를 소유하고, 부모의 `activeStop` 상태를 이용해 카드와 핀의 선택을 동기화한다.

**Tech Stack:** React 18, TypeScript, Vite, Kakao Maps JavaScript SDK, Vitest

## Global Constraints

- 키는 `VITE_KAKAO_MAP_API_KEY`만 사용하고 값은 소스에 기록하지 않는다.
- `CourseMap` props와 코스 배열의 순서를 변경하지 않는다.
- 최초 화면은 모든 핀이 보이는 전체 경계를 사용한다.
- 기존 `.gitignore`, `vercel.json`은 수정하거나 스테이징하지 않는다.

---

### Task 1: 순서 기반 좌표와 테스트 환경

**Files:**

- Create: `src/components/organisms/courseMapHelpers.ts`
- Create: `src/components/organisms/courseMapHelpers.test.ts`
- Modify: `package.json`, `package-lock.json`

**Interfaces:**

- Produces: `toCourseCoordinates(stops: CourseStop[]): Array<{ lat: number; lng: number }>`

- [ ] **Step 1: 실패하는 테스트를 작성한다**

```ts
expect(
  toCourseCoordinates([
    { lat: 37.9, lng: 128.8 },
    { lat: 37.8, lng: 128.9 },
  ] as never),
).toEqual([
  { lat: 37.9, lng: 128.8 },
  { lat: 37.8, lng: 128.9 },
]);
```

- [ ] **Step 2: 실패를 확인한다**

Run: `npm test -- --run src/components/organisms/courseMapHelpers.test.ts`

Expected: 테스트 명령 또는 대상 모듈이 없어 실패한다.

- [ ] **Step 3: 최소 구현을 작성한다**

```ts
export function toCourseCoordinates(stops: CourseStop[]) {
  return stops.map(({ lat, lng }) => ({ lat, lng }));
}
```

`vitest`를 개발 의존성으로 설치하고 `package.json`에 `test: vitest` 스크립트를 추가한다.

- [ ] **Step 4: 통과를 확인한다**

Run: `npm test -- --run src/components/organisms/courseMapHelpers.test.ts`

Expected: PASS.

### Task 2: SDK 로더와 타입

**Files:**

- Create: `src/lib/kakaoMaps.ts`, `src/lib/kakaoMaps.test.ts`, `src/types/kakao-maps.d.ts`
- Modify: `src/vite-env.d.ts`

**Interfaces:**

- Produces: `loadKakaoMaps(apiKey?: string): Promise<typeof window.kakao.maps>`

- [ ] **Step 1: 키 누락 실패 테스트를 작성한다**

```ts
await expect(loadKakaoMaps('')).rejects.toThrow('VITE_KAKAO_MAP_API_KEY');
```

- [ ] **Step 2: 실패를 확인한다**

Run: `npm test -- --run src/lib/kakaoMaps.test.ts`

Expected: 모듈이 없어 실패한다.

- [ ] **Step 3: SDK 로더를 최소 구현한다**

`autoload=false` 스크립트를 한 번만 추가하고 `kakao.maps.load`가 완료될 때 resolve한다. `Map`, `LatLng`, `LatLngBounds`, `Marker`, `MarkerImage`, `Polyline`, 이벤트 API의 필요한 타입을 선언한다.

- [ ] **Step 4: 통과를 확인한다**

Run: `npm test -- --run src/lib/kakaoMaps.test.ts`

Expected: PASS.

### Task 3: CourseMap 카카오맵 구현

**Files:**

- Modify: `src/components/organisms/CourseMap.tsx`, `src/main.tsx`

**Interfaces:**

- Consumes: `loadKakaoMaps`, `toCourseCoordinates`, 기존 `CourseMapProps`
- Produces: 번호 핀, 순서 기반 폴리라인, 초기 전체 경계, 양방향 선택

- [ ] **Step 1: 두 장소의 좌표 순서 테스트를 추가한다**

```ts
expect(toCourseCoordinates(stops)).toEqual([
  { lat: 37.8934, lng: 128.8298 },
  { lat: 37.8036, lng: 128.9096 },
]);
```

- [ ] **Step 2: 실패를 확인한다**

Run: `npm test -- --run src/components/organisms/courseMapHelpers.test.ts`

Expected: 추가한 순서 검증이 구현 전에는 실패한다.

- [ ] **Step 3: 지도를 구현한다**

`CourseMap`에서 경로를 `LatLng` 배열로 변환해 `Polyline`으로 생성한다. 각 좌표를 `LatLngBounds`에 추가한 뒤 `map.setBounds(bounds, 48, 48, 48, 48)`를 호출한다. SVG 데이터 URL 번호 핀의 클릭 이벤트는 `onSelect(index)`를 호출한다. `activeIndex` 변경 시 핀을 재설정하고 `map.setLevel(5)`와 `map.panTo(position)`로 포커스한다. 키 또는 SDK 오류는 한글 안내 문구로 표시한다. `src/main.tsx`의 Leaflet CSS import를 제거한다.

- [ ] **Step 4: 통과와 타입 검사를 확인한다**

Run: `npm test -- --run src/components/organisms/courseMapHelpers.test.ts && npm run build`

Expected: PASS 및 빌드 성공.

### Task 4: 최종 검증

**Files:**

- Modify: 없음

- [ ] **Step 1: 자동 검증을 실행한다**

Run: `npm test -- --run && npm run lint && npm run build`

Expected: 모두 성공.

- [ ] **Step 2: 브라우저 상호작용을 확인한다**

Run: `npm run dev -- --host 127.0.0.1`

Expected: 모든 핀이 초기 화면에 표시되고, 경로 순서와 카드-핀 양방향 선택이 정상 동작한다.
