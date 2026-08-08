# API Spec Draft

`docs/data-requirements.md`에서 도출한 데이터 요구사항을 기반으로 추정한 API 엔드포인트 초안. 타입 정의는 [`src/types/api.ts`](../src/types/api.ts)를 참고. 아직 구현되지 않은 초안이며, 실제 백엔드 설계 시작점으로 사용한다.

## `GET /api/places`

장소 목록 조회 (화면 1의 필터/카드 그리드).

응답:

```json
{
  "places": [
    {
      "id": "jumunjin",
      "name": "주문진 항구",
      "region": "강릉시 주문진읍",
      "tags": ["항구", "어시장"],
      "cat": "food"
    }
  ]
}
```

쿼리 파라미터: `cat`(카테고리 필터, 선택), 페이지네이션은 전체 장소 수가 적어(현재 9곳) 불필요할 가능성이 높음 — 실제 규모에 따라 `limit`/`cursor` 추가 검토.

## `POST /api/composite-jobs`

사진 합성 Job 생성 (화면 3, "AI 사진 만들기" 클릭 시).

요청: `multipart/form-data` — 사용자 사진 파일 + `{ onePickId: string }`.

응답:

```json
{ "id": "job_abc123", "status": "queued", "progress": 0 }
```

## `GET /api/composite-jobs/:id`

Job 상태 폴링 (화면 3의 running 단계, 1~2초 간격 권장).

응답:

```json
{ "id": "job_abc123", "status": "running", "progress": 42 }
```

완료 시:

```json
{
  "id": "job_abc123",
  "status": "done",
  "progress": 100,
  "resultUrl": "https://cdn.example.com/composites/job_abc123.jpg"
}
```

## `POST /api/courses`

여행 조건을 받아 코스(정거장 순서)를 생성 (화면 5 → 6 전환 시).

요청:

```json
{
  "placeIds": ["jumunjin", "anmok", "gyeongpo"],
  "onePickId": "jumunjin",
  "types": ["active"],
  "companion": "couple",
  "duration": "day"
}
```

응답:

```json
{
  "stops": [
    {
      "n": 1,
      "id": "jumunjin",
      "name": "주문진 항구",
      "time": "09:30",
      "stay": "60분",
      "crowd": "easy",
      "onePick": true,
      "note": "어시장에서 아침 회 한 접시",
      "lat": 37.8934,
      "lng": 128.8298
    }
  ]
}
```

## 추가 아이디어 (구현하지 않음, 제안만)

- **OpenAPI 스펙 자동 생성**: 위 초안을 `openapi.yaml`로 옮기고, `src/types/api.ts`를 `openapi-typescript` 같은 도구로 역생성/검증해서 프론트-백엔드 타입 불일치를 CI에서 잡기.
- **Zod 스키마를 계약으로 공유**: `types/api.ts`의 인터페이스를 Zod 스키마로 다시 쓰고, 프론트는 `z.infer`로 타입을 얻고 백엔드(Node 기반이라면)는 같은 스키마로 요청 바디를 검증 — 계약이 한 곳에만 존재하게 됨.
- **타입 기반 mock 서버**: `types/api.ts` + 위 JSON 예시를 이용해 MSW(Mock Service Worker) 핸들러를 만들면, 실제 백엔드 없이도 `usePlacesQuery`/`useCourseStopsQuery`의 `queryFn`을 그대로 두고 네트워크 레벨에서 mock 가능 — 지금의 `Promise.resolve(STATIC_DATA)` 방식보다 실제 API 연동 시 차이가 적음.
