# 미리강릉 (Miri Gangneung) - FrontEnd

AI 기반 강릉 여행 사진 합성 + 맞춤 여행 코스 추천 서비스 **"미리강릉"**의 웹 프론트엔드다.
사용자가 강릉의 여행지를 고르고, 자기 사진을 그 배경에 합성한 "AI 인생샷"을 받은 뒤, 고른
장소들로 도보 경로가 그려진 여행 코스를 만든다.

---

## 서비스 흐름

```
IntroPage ─▶ ① 배경 선택 ─▶ ② 원픽 확인 ─▶ ③ 사진 업로드·합성 ─▶ ④ 합성 결과 ─▶ ⑤ 코스 조건 ─▶ ⑥ 코스 결과·지도
   /          /background-    /one-pick       /photo-upload        /composite-      /course-       /course-result
                picker                                              result           options
```

| 화면        | 경로                 | 하는 일                                                                               |
| ----------- | -------------------- | ------------------------------------------------------------------------------------- |
| Intro       | `/`, `/intro`        | 서비스 소개, 스크롤 모션, 시작 CTA                                                    |
| ① 배경 선택 | `/background-picker` | 백엔드가 내려준 장소·사진 중 최대 3곳 선택                                            |
| ② 원픽 확인 | `/one-pick`          | 선택한 곳 중 AI 합성에 쓸 **원픽 배경**과 그 사진 결정. 나머지는 코스 후보로 유지     |
| ③ 사진 합성 | `/photo-upload`      | 내 사진 업로드(또는 기본 AI 모델 선택), 약관 동의, 합성 진행 타임라인                 |
| ④ 합성 결과 | `/composite-result`  | 결과 확인·저장, **품질 경고** 표시, 다시 만들기                                       |
| ⑤ 코스 조건 | `/course-options`    | 여행 유형·동반자·기간 선택                                                            |
| ⑥ 코스 결과 | `/course-result`     | 추천 코스 타임라인 + 카카오 지도 도보 경로, 주변 장소 추가·삭제·순서 변경·경로 최적화 |

---

## 사진 합성 파이프라인 (프론트 관점)

프론트는 AI 서비스를 직접 부르지 않고 백엔드(`VITE_API_BASE_URL`)만 부른다.

```
PhotoUploadPage
  │ 1. POST /compositions   multipart: photo | modelPresetId(택일), onePickId,
  │                          aspectRatio(4:5), backgroundImageUrl, sessionId
  │                          → { jobId, status: QUEUED }
  │ 2. GET  /compositions/{jobId}  을 1.5초마다 폴링
  │        status: QUEUED → ANALYZING → COMPOSITING → QUALITY_CHECK → DONE | FAILED
  │        타임라인: 요청 접수 → 사진·배경 분석 → 이미지 합성 → 품질 확인 → 완료
  │ 3. DONE → downloadUrl 로 결과 이미지 표시 (safety.warnings 함께 보관)
  ▼
CompositeResultPage   결과 이미지 + 경고 문구 + 다시 만들기
```

- **`sessionId`는 프론트가 항상 붙인다** (`lib/browserSession.ts`). 임의 UUID를 `sessionStorage`에
  저장해 쓴다(스토리지를 못 쓰면 메모리 폴백). 서버가 이 값으로 사용자별 시간당 생성 횟수를
  세는데, 빠지면 서버가 IP로 대체해 **전 사용자가 카운터를 공유**하게 된다. 신원 확인용이 아니다.
- **품질 경고는 실패가 아니다.** 서버가 `safety.warnings`로 내려주는 경고(예: 얼굴이 실제와
  조금 다르게 표현됨, 배경이 원본과 다소 다르게 표현됨)는 결과를 막지 않는다. 결과 화면이
  이미지와 함께 문구를 보여주고 "다시 만들어 보세요"를 안내한다. 거부는 `error`로 온다.
- **오류.** 사진 검증 실패(얼굴 없음·여러 명·흐림 등)와 생성 실패는 `error.code`/`message`로
  오고, `retryable`이면 재시도를 안내한다(`POST /compositions/{id}/retry`). 생성 횟수를 넘으면
  `error.code`가 `RATE_LIMITED`(시간당) / `BUDGET_EXCEEDED`(일일)다. 백엔드는 Agent의 오류 코드를
  그대로 Job의 `error`로 전달한다. 결과는 서버에서 24시간 뒤 만료된다(410).
- 합성 한 번에 수십 초가 걸린다. 얼굴 유사도가 낮으면 서버가 내부적으로 다시 합성해서
  더 걸릴 수 있다 — 진행 타임라인이 그동안 사용자에게 상태를 보여준다.

코스 쪽은 `lib/courseApi.ts`가 `/courses`, `/courses/{id}/nearby-places`, `/stops/external`,
`/stops/order`, `/stops/optimize`를 호출하고, 도보 경로 선은 카카오 REST API를 서버리스
함수(`api/walking-route.ts`, 로컬은 Vite 개발 서버 미들웨어)로 감싸 호출한다.

---

## 기술 스택

- **Core**: React 18 + TypeScript + Vite
- **상태/데이터**: Zustand(앱 상태, `store/useAppStore.ts`), TanStack Query(서버 상태), React Router
- **스타일**: Tailwind CSS, `src/styles/index.css`
- **아이콘**: Lucide React
- **지도**: Kakao Maps JavaScript SDK, 카카오 도보 경로 REST API
- **품질**: ESLint, Prettier, Vitest, Husky + lint-staged
- **배포**: Vercel (`vercel.json`은 SPA rewrite)

---

## 폴더 구조

```text
├── api/                         # 카카오 도보 경로 서버리스 함수 (Vercel) + 개발용 어댑터
├── docs/                        # 설계·API 핸드오프·상태 문서
├── public/images/               # 배경 선택 화면 등 정적 이미지
├── src/
│   ├── pages/                   # 라우트 단위 페이지 (Intro + 6개 화면)
│   ├── components/
│   │   ├── atoms/ molecules/    # Tag, ImageSlot, PlaceCard, RadioOption
│   │   ├── layout/              # PageLayout, ProgressHeader
│   │   └── organisms/           # BackgroundPicker, OnePickConfirm, PhotoUpload,
│   │                            #   CompositeResult, CourseOptions, CourseResult, CourseMap,
│   │                            #   CourseSheet, intro/* 등 화면 단위 컴포넌트
│   ├── hooks/                   # useComposeRun(진행 상태), 스크롤 훅
│   ├── lib/                     # API 클라이언트·순수 로직
│   │   ├── compositionApi.ts    #   합성 생성·조회·재시도·다운로드
│   │   ├── compositionProgress.ts # 서버 status → 타임라인 단계 매핑
│   │   ├── browserSession.ts    #   익명 세션 ID
│   │   ├── placesApi.ts · courseApi.ts · walkingRoute.ts · kakaoMaps.ts
│   ├── queries/                 # TanStack Query 훅
│   ├── store/                   # Zustand 스토어
│   ├── data/                    # 타임라인 단계, 코스 옵션 등 정적 데이터
│   ├── types/                   # API·도메인 타입
│   └── App.tsx                  # 라우터·QueryClient
└── vite.config.ts
```

---

## 로컬 실행

백엔드를 먼저 띄운 뒤 프론트를 띄운다. 합성까지 확인하려면 백엔드 → Agent도 필요하다
(`MiriGangNeung_BackEnd` / `MiriGangNeung_Agent` README 참고). 기본 주소는 백엔드
`http://localhost:8080`, 프론트 `http://localhost:5173`.

```bash
npm install                       # 또는 CI와 같게: npm ci
cp .env.example .env.local
npm run dev
```

```dotenv
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_KAKAO_MAP_API_KEY=카카오_JavaScript_키
KAKAO_REST_API_KEY=카카오_REST_키
```

`VITE_KAKAO_MAP_API_KEY`는 브라우저용 지도 SDK 키(카카오 콘솔에 **프론트 도메인**을 등록해야
한다)이고, `KAKAO_REST_API_KEY`는 도보 경로 서버 함수에서만 쓴다. REST 키에는 `VITE_`
접두사를 붙이지 않는다. 백엔드 포트를 바꿨다면 `VITE_API_BASE_URL`도 맞춘다.

### 검증

```bash
npm test -- --run
npm run lint
npm run build        # tsc --noEmit + vite build
```

---

## 배포 (Vercel)

1. 백엔드가 HTTPS 주소로 떠 있어야 한다.
2. Vercel 프로젝트 환경변수에 `VITE_API_BASE_URL=https://<백엔드 도메인>/api/v1`,
   `VITE_KAKAO_MAP_API_KEY`, `KAKAO_REST_API_KEY`를 넣는다.
3. 환경변수를 바꾼 뒤에는 **재배포(Redeploy)** 해야 반영된다(빌드 시점에 박힌다).
4. 백엔드 `CORS_ORIGINS`에 Vercel 주소를, 카카오 개발자 콘솔의 Web 플랫폼에도
   같은 주소를 등록한다.

---

## 디자인 토큰

- **Brand**: `#2F6FED` (Primary), `#1E54C4` (Dark), `#E8F0FE` (Tint)
- **Accent**: `#F0573F` (Coral), `#1F9E56` (Success)
- **Typography**: Noto Sans KR (400, 500, 700, 800)
- **Radius**: `999px` (Pill), `20px` (Panel), `16px` (Card)
