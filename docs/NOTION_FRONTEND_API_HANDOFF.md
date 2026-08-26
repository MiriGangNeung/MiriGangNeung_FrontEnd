# 미리강릉 프론트엔드 및 백엔드 API 연동 문서

> 작성일: 2026-08-09  
> 기준 브랜치: `develop`  
> 기준 커밋: `aaf9d84`

---

## 1. 서비스 개요

미리강릉은 사용자가 강릉 여행 장소를 선택하고, 원픽 장소와 본인 사진을 조합한 뒤 여행 조건에 맞는 코스를 확인하는 웹 서비스입니다.

현재 사용자 흐름은 아래와 같습니다.

```text
장소 선택
→ 원픽 장소 선택
→ 사진 업로드 및 합성 진행
→ 합성 결과 확인
→ 여행 조건 선택
→ 코스 및 지도 확인
```

---

## 2. 현재 프론트엔드 구현 상태

| 영역             | 상태        | 현재 구현 내용                                             |
| ---------------- | ----------- | ---------------------------------------------------------- |
| 화면 흐름        | 구현 완료   | 6개 화면이 React Router로 연결됨                           |
| 장소 선택        | 구현 완료   | 최대 3개 장소 선택, 카테고리 필터, 원픽 선택               |
| 사진 업로드      | 일부 구현   | 로컬 파일 선택·미리보기·동의 UI 구현, 실제 합성 API 미연결 |
| 합성 결과        | 일부 구현   | 결과 화면 UI 구현, 결과 이미지는 placeholder               |
| 코스 조건        | 구현 완료   | 여행 타입·동행·기간·직접 날짜 선택 가능                    |
| 코스 결과        | 대부분 구현 | 일정 카드·지도 마커 동기화 구현, 코스 데이터는 정적 mock   |
| 카카오 지도      | 구현 완료   | SDK 로드, 마커, 지도 이동, 도보 경로 polyline 표시         |
| 도보 경로 API    | 구현 완료   | `/api/walking-route` 서버 프록시를 통해 카카오 API 호출    |
| 장소/코스 API    | 미연결      | 현재 정적 `PLACES`, `COURSE_STOPS` 사용                    |
| 로그인/저장 기능 | 미구현      | 인증 및 사용자별 데이터 저장 API 없음                      |

---

## 3. 화면별 사용자 흐름

### 3.1 장소 선택 (`/`)

사용자는 강릉 장소를 최대 3개까지 선택합니다.

- 카테고리 탭을 선택해 장소를 필터링합니다.
- 장소 카드 클릭 시 선택 순서가 표시됩니다.
- 최소 1개를 선택해야 다음 단계로 이동할 수 있습니다.
- 선택값은 Zustand의 `picks`에 저장됩니다.

### 3.2 원픽 장소 선택 (`/one-pick`)

선택한 장소 중 사진 합성 배경으로 사용할 원픽 장소를 고릅니다.

- 선택값은 Zustand의 `onePick`에 저장됩니다.
- 원픽은 이후 사진 합성과 코스 생성 요청에 함께 전달됩니다.

### 3.3 사진 업로드 및 합성 (`/photo-upload`)

사용자는 본인 사진을 업로드하고 필수 동의 후 합성을 시작합니다.

- 파일 선택 또는 드래그앤드롭을 지원합니다.
- 현재는 타이머로 진행 단계를 표시합니다.
- 실제 연동 시 사진 합성 Job 생성 API와 Job 상태 조회 API가 필요합니다.

### 3.4 합성 결과 (`/composite-result`)

합성된 결과 이미지와 원픽 장소 정보를 표시합니다.

- 실제 연동 시 Job 조회 응답의 `resultUrl`을 이미지에 표시합니다.
- 재생성 버튼은 업로드 화면으로 돌아갑니다.

### 3.5 여행 조건 설정 (`/course-options`)

사용자는 여행 타입, 동행, 기간을 선택합니다.

- 여행 타입은 1~2개 선택합니다.
- 동행: 가족, 커플, 혼자, 친구.
- 기간: 당일, 1박 2일, 직접 설정.
- 값은 Zustand에 저장되며 코스 생성 요청 DTO로 전송됩니다.

### 3.6 코스 결과 (`/course-result`)

생성된 코스의 일정 카드, 지도 마커, 도보 경로를 표시합니다.

- 카드 선택과 지도 마커 선택은 `activeStop`으로 동기화됩니다.
- 코스 결과는 현재 정적 데이터입니다.
- 도보 경로만 실제 `/api/walking-route` API를 사용합니다.

---

## 4. 기술 구성

| 구분      | 기술                                    |
| --------- | --------------------------------------- |
| UI        | React 18 + TypeScript                   |
| 빌드      | Vite 5                                  |
| 스타일    | Tailwind CSS 3                          |
| 라우팅    | React Router DOM 7                      |
| 전역 상태 | Zustand 5                               |
| 서버 상태 | TanStack React Query 5                  |
| 지도      | 카카오맵 JavaScript SDK                 |
| 서버 API  | Vercel API handler + Vite 개발 미들웨어 |
| 아이콘    | Lucide React                            |

---

## 5. 필요한 백엔드 API

| 기능               | API                           | 사용 화면      | 연결 상태    |
| ------------------ | ----------------------------- | -------------- | ------------ |
| 장소 목록          | `GET /api/places`             | 장소 선택      | 필요, 미연결 |
| 사진 합성 Job 생성 | `POST /api/composite-jobs`    | 사진 업로드    | 필요, 미연결 |
| 사진 합성 Job 조회 | `GET /api/composite-jobs/:id` | 합성 진행/결과 | 필요, 미연결 |
| 여행 코스 생성     | `POST /api/courses`           | 코스 조건      | 필요, 미연결 |
| 도보 경로          | `GET /api/walking-route`      | 코스 결과 지도 | 연결 완료    |

---

## 6. 공통 DTO

```ts
type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'EXTERNAL_SERVICE_ERROR'
  | 'INTERNAL_ERROR';

interface ApiErrorResponse {
  error: {
    code: ApiErrorCode;
    message: string;
    fieldErrors?: Record<string, string>;
    requestId?: string;
  };
}

interface PaginationMeta {
  nextCursor?: string;
  hasNext: boolean;
}
```

---

## 7. API 상세 계약

### 7.1 장소 목록 조회

`GET /api/places`

Query DTO:

```ts
interface GetPlacesQuery {
  cat?: 'beach' | 'food' | 'nature' | 'culture';
  limit?: number; // 1~100
  cursor?: string;
}
```

응답 DTO:

```ts
interface PlaceDto {
  id: string;
  name: string;
  region: string;
  tags: string[];
  cat: 'beach' | 'food' | 'nature' | 'culture';
  photoUrl?: string;
}

interface GetPlacesResponse {
  places: PlaceDto[];
  page?: PaginationMeta;
}
```

예상 응답:

```json
{
  "places": [
    {
      "id": "jumunjin",
      "name": "주문진항",
      "region": "강릉시 주문진읍",
      "tags": ["항구", "해산물"],
      "cat": "food",
      "photoUrl": "https://cdn.example.com/places/jumunjin.jpg"
    }
  ],
  "page": {
    "nextCursor": "place_cursor_02",
    "hasNext": true
  }
}
```

프론트엔드 연결:

- `usePlacesQuery`의 정적 `PLACES` 반환을 실제 `fetch('/api/places')`로 교체합니다.
- 응답 `places`를 React Query 캐시에 저장합니다.
- 선택한 장소 ID는 기존 Zustand `picks`에 유지합니다.

---

### 7.2 사진 합성 Job 생성

`POST /api/composite-jobs`

Request는 `multipart/form-data`입니다.

```ts
interface CreateCompositeJobFormData {
  photo: File;
  onePickId: string;
}

interface CreateCompositeJobResponse {
  id: string;
  status: 'queued' | 'running';
  progress: number; // 0~100
  createdAt: string; // ISO 8601 UTC
}
```

예상 응답 (`202 Accepted`):

```json
{
  "id": "cmp_01JQ8GZ2N7",
  "status": "queued",
  "progress": 0,
  "createdAt": "2026-08-09T12:34:56.000Z"
}
```

프론트엔드 연결:

- `photoFile`과 Zustand의 `onePick`을 전송합니다.
- 반환된 `id`를 Job ID로 저장합니다.
- 현재 `useComposeRun` 타이머는 서버 Job 상태 기반 UI로 교체합니다.

---

### 7.3 사진 합성 Job 조회

`GET /api/composite-jobs/:id`

응답 DTO:

```ts
type CompositeJobStatus = 'queued' | 'running' | 'done' | 'failed';

interface GetCompositeJobResponse {
  id: string;
  status: CompositeJobStatus;
  progress: number;
  resultUrl?: string;
  error?: {
    code: 'COMPOSITE_FAILED' | 'SOURCE_IMAGE_INVALID' | 'JOB_EXPIRED';
    message: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

진행 중 응답:

```json
{
  "id": "cmp_01JQ8GZ2N7",
  "status": "running",
  "progress": 64,
  "createdAt": "2026-08-09T12:34:56.000Z",
  "updatedAt": "2026-08-09T12:35:14.000Z"
}
```

완료 응답:

```json
{
  "id": "cmp_01JQ8GZ2N7",
  "status": "done",
  "progress": 100,
  "resultUrl": "https://cdn.example.com/composites/cmp_01JQ8GZ2N7.jpg",
  "createdAt": "2026-08-09T12:34:56.000Z",
  "updatedAt": "2026-08-09T12:35:30.000Z"
}
```

실패 응답:

```json
{
  "id": "cmp_01JQ8GZ2N7",
  "status": "failed",
  "progress": 64,
  "error": {
    "code": "COMPOSITE_FAILED",
    "message": "이미지 합성에 실패했습니다."
  },
  "createdAt": "2026-08-09T12:34:56.000Z",
  "updatedAt": "2026-08-09T12:35:30.000Z"
}
```

상태 규칙:

- `done`이면 `resultUrl`은 필수입니다.
- `failed`이면 `error`는 필수입니다.
- `queued`, `running`에서는 `resultUrl`, `error`를 포함하지 않습니다.
- 프론트엔드는 1~2초 간격 polling, unmount 취소, timeout, 재시도 UI를 처리합니다.

---

### 7.4 여행 코스 생성

`POST /api/courses`

요청 DTO:

```ts
interface CreateCourseRequest {
  placeIds: string[]; // 1~3개
  onePickId: string; // placeIds 중 하나
  types: ('food' | 'rest' | 'active' | 'culture' | 'nature')[]; // 1~2개
  companion: 'family' | 'couple' | 'solo' | 'friends';
  duration: 'day' | 'night1' | 'custom';
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}
```

응답 DTO:

```ts
interface CourseStopDto {
  n: number;
  id: string;
  name: string;
  time: string; // HH:mm
  stay: string;
  crowd: 'easy' | 'mid' | 'busy';
  onePick?: boolean;
  note: string;
  lat: number;
  lng: number;
  photoUrl?: string;
}

interface CreateCourseResponse {
  stops: CourseStopDto[];
  summary?: {
    totalDistanceKm?: number;
    estimatedDurationMinutes?: number;
  };
}
```

예상 응답 (`201 Created`):

```json
{
  "stops": [
    {
      "n": 1,
      "id": "jumunjin",
      "name": "주문진항",
      "time": "09:30",
      "stay": "60분",
      "crowd": "easy",
      "onePick": true,
      "note": "아침 시간에 항구 산책을 시작합니다.",
      "lat": 37.8934,
      "lng": 128.8298,
      "photoUrl": "https://cdn.example.com/places/jumunjin.jpg"
    }
  ],
  "summary": {
    "totalDistanceKm": 42.0,
    "estimatedDurationMinutes": 480
  }
}
```

프론트엔드 연결:

- Zustand의 `picks`, `onePick`, `types`, `companion`, `duration`, 날짜를 요청 DTO로 만듭니다.
- `duration === 'custom'`이면 `startDate`, `endDate`를 필수로 보냅니다.
- 응답 `stops`는 코스 카드와 지도 입력으로 사용합니다.

---

### 7.5 도보 경로 조회

`GET /api/walking-route?stops=<JSON>`

현재 실제 연결된 API입니다.

```ts
interface WalkingRouteStopDto {
  name: string;
  lat: number;
  lng: number;
}

interface GetWalkingRouteResponse {
  points: Array<{
    lat: number;
    lng: number;
  }>;
}
```

예상 응답:

```json
{
  "points": [
    { "lat": 37.8934, "lng": 128.8298 },
    { "lat": 37.8891, "lng": 128.8412 }
  ]
}
```

- `stops`는 최소 2개 필요합니다.
- `points`는 이동 순서대로 정렬된 좌표 배열입니다.
- 브라우저는 서버 프록시만 호출하고, 카카오 REST 키는 서버에서만 사용합니다.

---

## 8. 공통 오류 응답

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "요청 값을 확인해 주세요.",
    "fieldErrors": {
      "onePickId": "placeIds에 포함된 장소여야 합니다."
    },
    "requestId": "req_01JQ8H1R3M"
  }
}
```

| 오류 코드                   | 프론트엔드 처리                            |
| --------------------------- | ------------------------------------------ |
| `VALIDATION_ERROR`          | 입력 필드 또는 조건별 오류 표시            |
| `UNAUTHORIZED`, `FORBIDDEN` | 인증/권한 안내 표시                        |
| `NOT_FOUND`                 | Job 또는 리소스를 찾을 수 없다는 안내 표시 |
| `CONFLICT`                  | 중복 요청 또는 상태 충돌 안내              |
| `RATE_LIMITED`              | 잠시 후 재시도 안내                        |
| `EXTERNAL_SERVICE_ERROR`    | 지도/합성 외부 서비스 오류 안내            |
| `INTERNAL_ERROR`            | 일반 오류와 재시도 동작 제공               |

---

## 9. 유효성 규칙

- `placeIds`: 1~3개.
- `onePickId`: 반드시 `placeIds` 안에 포함.
- `types`: 1~2개.
- `duration === 'custom'`: `startDate`, `endDate` 필수, 시작일은 종료일보다 늦을 수 없음.
- `photo`: 이미지 MIME type 검증, 최대 용량 검증. 프론트 안내 기준은 10MB.
- 모든 날짜/시간 및 좌표 형식은 API 계약과 동일하게 유지.

---

## 10. 프론트엔드 연동 순서

1. `GET /api/places`를 `usePlacesQuery`에 연결하고 loading/error/empty UI를 추가합니다.
2. 사진 업로드 시 `POST /api/composite-jobs`를 호출하고 Job ID를 저장합니다.
3. `GET /api/composite-jobs/:id` polling으로 진행 상태와 결과 URL을 반영합니다.
4. 코스 조건 확인 시 `POST /api/courses`를 호출하고 응답 stops를 결과 화면으로 전달합니다.
5. 기존 도보 경로 API는 생성된 stops를 받아 그대로 사용합니다.
6. 공통 API client에 base URL, JSON 파싱, abort signal, timeout, 오류 매핑을 추가합니다.

---

## 11. 참고 파일

| 파일                            | 역할                         |
| ------------------------------- | ---------------------------- |
| `src/App.tsx`                   | 전체 라우팅 구성             |
| `src/store/useAppStore.ts`      | 장소·여행 조건 전역 상태     |
| `src/queries/usePlacesQuery.ts` | 현재 정적 장소/코스 query    |
| `src/types/domain.ts`           | 화면 도메인 모델             |
| `src/types/api.ts`              | 기존 API 타입 초안           |
| `src/lib/walkingRoute.ts`       | 도보 경로 API 클라이언트     |
| `api/walking-route.ts`          | 카카오 도보 경로 API 프록시  |
| `docs/api-spec-draft.md`        | 상세 DTO 및 예상 응답 스키마 |
