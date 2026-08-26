# 인트로 히어로 페이지 구현 프롬프트

브랜치: `feat/intro-hero-page` (main에서 분기, 이미 생성됨)
목표: 첨부 목업과 동일한 강릉 여행 인트로 페이지를 신규 라우트로 만들고, `시작하기` 클릭 시 기존 서비스 첫 화면(`/`, `BackgroundPickerPage`)으로 이동한다.

---

## 0. 라우팅 / 파일 구조

- 신규 라우트 `/intro`(랜딩) → 기존 `/`(BackgroundPickerPage, 사진/배경 선택 화면)는 그대로 서비스 첫 화면 역할 유지. 인트로는 `/intro`에 배치하고, 배포 시 루트 리다이렉트 여부는 별도 논의(우선 `/intro`로 개발).
- `src/pages/IntroPage.tsx` 신규 생성, `src/App.tsx` router 최상위(children 바깥, `PageLayout`을 감싸지 않는 형제 라우트)에 `{ path: '/intro', element: <IntroPage /> }` 추가. `PageLayout`은 4단계 진행 헤더 전용이라 인트로엔 맞지 않으므로 건드리지 않는다.
- 섹션 컴포넌트는 `src/components/organisms/intro/` 아래 분리:
  - `IntroHeader.tsx` (로고만 있는 투명→불투명 헤더)
  - `HeroSection.tsx` (S0)
  - `PlaceSelectSection.tsx` (S1)
  - `PhotoExperienceSection.tsx` (S2)
  - `CuratedTourSection.tsx` (S3)
  - `CtaSection.tsx` (S4)
- 스크롤 진행률/리빌 공용 로직은 `src/hooks/useScrollReveal.ts`, `src/hooks/useScrollProgress.ts` 로 분리해 여러 섹션이 재사용.

---

## 1. 데이터 재사용 (신규 하드코딩 금지)

`src/data/places.ts`의 `PLACES` 배열에 이미 정동진(해변·일출 명소)/안목해변(해변·카페거리)/주문진 항구(항구·어시장)가 목업과 동일한 이름·태그로 존재한다. S1 카드와 S3 타임라인 노드는 이 데이터를 **그대로 import해서 사용**한다. 새 상수 파일이나 별도 배열을 만들지 말 것.

S3의 시간(`09:00`, `14:30`, `18:20`)과 캡션(`강릉에서 시작하는 아침` 등)만 인트로 전용 데이터로 `src/data/places.ts`에 `INTRO_TOUR_STOPS` 형태로 추가하거나, 새 배열에서 `placeId`로 `PLACES`를 참조하는 방식으로 조인한다(기존 `Place` 타입 변경 최소화).

---

## 2. 디자인 토큰

기존 tailwind 토큰 재사용, 신규 컬러 추가 금지:

- `brand`(#2F6FED, dark #1E54C4, tint, soft), `ink`, `line`, `canvas`, `coral`, `ok`
- 폰트는 현재 `Noto Sans KR` 단일. 목업의 세리프/스크립트 타이틀("Travel" 스타일)은 **삭제**하고 지시대로 국문 "미리 강릉" 타이틀로 대체하므로 별도 웹폰트(세리프/스크립트) 추가 불필요 — `font-sans` 유지, `font-extrabold` + 큰 사이즈로 임팩트를 낸다.
- 웨이브 컷 경계는 히어로 하단 1회만 SVG(`clip-path` 또는 `<svg>` wave)로 적용, 나머지 섹션 경계는 `canvas`↔`white` 배경색 전환으로 구분(신규 그래픽 에셋 불필요).

---

## 3. 헤더 — `IntroHeader.tsx`

**확정 사항**: 로고는 기존 앱 아이콘 스타일 그대로, 메뉴(여행 소개/강릉 추천/여행 코스/문의하기)는 전부 삭제.

- `src/components/layout/ProgressHeader.tsx`의 로고 마크업을 그대로 재사용/추출:
  ```tsx
  <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand text-white">
    <Waves size={18} strokeWidth={1.8} />
  </div>
  <span className="text-base font-extrabold -tracking-[.3px]">미리강릉</span>
  ```
  (`lucide-react`의 `Waves` 아이콘, 이미 의존성 있음 — 신규 아이콘 라이브러리 도입 금지)
- 레이아웃: `position: fixed; top:0; z-index:50`, 좌측에 로고만, 우측은 비움(내비 없음).
- 배경: 초기 `rgba(255,255,255,0)`(투명, 히어로 이미지 위에 얹힘) → 히어로 섹션을 벗어나는 스크롤 구간(0\~히어로 높이)에 맞춰 `background-color`, `border-bottom` 알파를 0→1로 보간. `useScrollProgress(heroRef)` 훅으로 progress 값 받아 인라인 style에 반영.
- 로고 텍스트/아이콘 컨테이너 색상도 함께 전환: 히어로 위에선 흰색 텍스트, 헤더가 불투명해지면 `text-ink`(threshold `progress > 0.5`에서 클래스 스위치 + `transition-colors duration-300`으로 단순화 — 트리플처럼 완전 프레임 단위 보간까지는 불필요).

---

## 4. S0. Hero — `HeroSection.tsx`

**확정 사항**: 타이틀을 "Travel / in Gangneung" 조합이 아니라 **"미리 강릉"** 으로 디자인.

- 배경: 정동진 해안 열차 이미지 풀블리드(`public/images/hero/`에 신규 에셋 필요 — 현재 `public/images`가 비어있으므로 착수 전 이미지 확보 필요, 9번 항목 참고).
- 하단 웨이브 컷(SVG, 1회성).
- 텍스트 블록(좌측 정렬, 헤더 아래):
  - 메인 타이틀: `미리 강릉` — `text-6xl md:text-7xl font-extrabold text-white`. 목업의 "Travel"만큼의 존재감을 내되 영문 스크립트 서브타이틀("in Gangneung")은 없앤다. 필요하면 `강릉` 부분만 `text-brand-soft`로 포인트 컬러 가능(선택, 과하면 생략).
  - 서브카피 2줄 유지: `미리 강릉에서의 특별한 여행을` / `가장 완벽하게 계획해보세요.`
- 좌하단: 마우스 스크롤 아이콘 + `SCROLL` 라벨, tailwind 기본 `animate-bounce` 유틸로 상하 루프(커스텀 keyframe 불필요).
- 모션: 헤더 진입 시 타이틀→서브카피 순서로 stagger fade+translateY(60→0) 리빌(`useScrollReveal` 훅, IntersectionObserver 1회 트리거). 배경 이미지는 스크롤에 따라 `translateY(scrollY * 0.15)` 패럴랙스.

---

## 5. S1. 장소 선택 — `PlaceSelectSection.tsx`

레이아웃 유지(합의됨): 좌측 텍스트 / 우측 카드 3장.

- 라벨 `01. CHOOSE YOUR PLACE`(`text-xs font-bold tracking-widest text-brand`)
- 헤드 `여러 강릉 관광지에서 / 가고 싶은 곳을 / 선택할 수 있어요.` (`text-3xl md:text-4xl font-extrabold`)
- 바디 `아름다운 바다부터 감성 가득한 골목까지, / 당신의 취향에 맞는 강릉을 골라보세요.` (`text-ink-soft`)
- 카드 3장: `PLACES.filter(p => ['jeongdongjin','anmok','jumunjin'].includes(p.id))`에서 `.map()`, 각 카드는 배경 이미지 + 그라데이션 오버레이 + 하단에 `name`/`region`/`tags`(`.map()`로 pill 배지).
- 카드 배치: 3장을 살짝 회전(`-rotate-6 / rotate-0 / rotate-6`)한 팬(fan) 모양, 겹치는 카드 레이어(`z-index`)와 우측 정렬.
- 모션: 그룹 진입 시 stagger(120ms 간격)로 각 카드가 `opacity 0→1, translateY 60→0, rotate(목표각±10°) → 목표각`. 호버 시 `translateY(-8px)` lift + `shadow-lift`.

---

## 6. S2. 사진 합성 체험 — `PhotoExperienceSection.tsx`

**레이아웃 변경(합의됨)**: 좌우 분할이 아니라 **텍스트를 상단 중앙에 배치하고 비포/애프터 슬라이더는 풀와이드**로 아래에 배치.

- 라벨 `02. YOUR PHOTO EXPERIENCE`, 헤드 `아직 떠나지 않았지만, / 먼저 만나보는 여행.`, 바디 그대로.
- 도식 `나의 사진` + `선택한 여행지` = `미리 보는 여행`: 아이콘 3개(`lucide-react`의 `User`/`Image`/`Camera` 등 기존 의존성 내에서 선택) + `+`, `=` 텍스트. 가로 배치, stagger 리빌.
- 비포/애프터 슬라이더: 풀와이드 컨테이너, 좌측 `clip-path: inset(0 X% 0 0)`로 BEFORE 이미지를 잘라 애프터 위에 겹치고, 중앙에 드래그 핸들(원형 버튼 + `<>` 아이콘). `BEFORE`/`IMAGINED` 뱃지는 좌상단/우상단 고정.
  - 인터랙션: `pointerdown/pointermove`로 핸들 드래그, `X`값(0~100%) state로 `clip-path` 갱신. 순수 React state + pointer events로 구현(ponytail: react-compare-slider 같은 신규 의존성 추가 금지, 30줄 내외 직접 구현으로 충분).
  - 진입 모션: 섹션 리빌 후 핸들이 자동으로 40%→60%→50% 정도 왕복 1회(조작 가능함을 알리는 힌트), `requestAnimationFrame` 기반 짧은 애니메이션 후 사용자 조작으로 넘김.
- 캡션 `이미지 비교 슬라이더를 움직여 합성 효과를 확인해보세요.` 슬라이더 하단 중앙, 작은 회색 텍스트.

**에셋 필요**: BEFORE(원본 거리 사진) / IMAGINED(합성 결과) 이미지 2장.

---

## 7. S3. 코스 추천 — `CuratedTourSection.tsx`

레이아웃 유지(합의됨) + **sticky 핀 고정 방식** 추가(합의됨: 트리플 모션 적용).

- 라벨 `03. YOUR CURATED TOUR`, 헤드 `한 장의 사진에서 / 하나의 여행으로.`, 바디 그대로. 좌측 고정 텍스트.
- 우측: `position: sticky; top: 90px`(헤더 높이만큼) 컨테이너 안에 타임라인. 섹션 전체 스크롤 높이는 뷰포트의 1.5~2배로 잡아 스크롤 여유 확보.
- 타임라인: `PLACES`에서 정동진/안목해변/주문진을 시간 순서(`09:00`/`14:30`/`18:20`)로 정렬한 배열(1번 항목의 `INTRO_TOUR_STOPS`)을 `.map()`으로 렌더링. 각 노드: 시간 라벨 + 장소명 + 캡션 + 썸네일(카드) + 점선 연결선.
- 모션: 점선 path를 SVG `<path>`로 그리고 `stroke-dasharray`/`stroke-dashoffset`을 스크롤 progress(0~1)에 비례해 갱신(`useScrollProgress` 재사용) → 스크롤할수록 선이 그려짐. 각 노드는 path가 해당 지점에 도달하면 `opacity/scale` 팝인(progress 구간 비교로 트리거 — sticky 컨테이너 내부라 IntersectionObserver보다 스크롤 progress 직접 계산이 안정적).
- 마지막 노드에 깃발 아이콘(목업의 🚩 대응, `lucide-react`의 `Flag`).

---

## 8. S4. CTA — `CtaSection.tsx`

레이아웃 유지.

- 배경: 강릉 카페/해변 이미지 풀블리드.
- 헤드 `이제, / 강릉으로 떠나볼까요?`, 바디 `당신만의 완벽한 강릉 여행을 시작해보세요.`
- 버튼 `시작하기 →`: `react-router-dom`의 `useNavigate()`로 `navigate('/')`(기존 서비스 첫 화면 `BackgroundPickerPage`로 이동). 버튼 스타일은 `src/components/atoms`에 기존 primary 버튼 컴포넌트가 있으면 재사용, 없으면 `brand` 배경의 최소 버튼 신규 작성.
- 모션: 화살표 호버 시 `translate-x-1` 이동(순수 CSS `group-hover`). 배경 미세 플로트는 과한 장식이라 생략 권장.

---

## 9. 공용 훅

### `useScrollReveal.ts`

IntersectionObserver로 요소가 뷰포트에 threshold(0.2) 이상 들어오면 `opacity-0 translate-y-[60px]` → `opacity-100 translate-y-0`로 1회 토글 후 unobserve. `prefers-reduced-motion: reduce`면 애니메이션 없이 즉시 최종 상태로 시작.
자식 여러 개를 순차 리빌해야 하는 곳(S1 카드, S2 도식)은 stagger delay를 인라인 style로 `index * 120ms` 부여.

### `useScrollProgress.ts`

헤더 알파 보간, 히어로 패럴랙스, S3 타임라인 path 진행률에 공용으로 쓰는 `[0,1]` progress 값을 특정 ref 기준으로 반환하는 훅. 신규 작성.

### 접근성

모든 스크롤 연동 애니메이션은 `window.matchMedia('(prefers-reduced-motion: reduce)')`로 패럴랙스·자동 왕복 데모·드로잉 애니메이션을 끄고 즉시 최종 상태로 렌더링.

---

## 9-1. 참고: triple.guide/intro 실측 데이터

브라우저로 직접 뜯어본 실측치(참고용, 그대로 베끼지 않아도 됨):

- 헤더: `position: fixed`, 초기 `background: rgba(0,0,0,0)`
- 리빌 초기 상태: `opacity: 0; transform: translateY(60px)`
- `transition-duration: 0s`(CSS 트랜지션이 아니라 JS가 매 프레임 값을 씀) — 이번 구현은 CSS `transition` + IntersectionObserver로 단순화해도 시각적으로 충분히 유사함(ponytail: JS rAF 애니메이터까지는 불필요).
- 섹션이 아니라 섹션 내부 블록(eyebrow/heading/visual) 각각이 독립적으로 리빌됨
- `position: sticky; top: 0` 컨테이너 존재 → 특정 섹션이 화면에 핀 고정된 채 내부 콘텐츠만 전환

---

## 10. 확인/준비가 필요한 것 (착수 전 체크)

1. **이미지 에셋 부재**: `public/images`가 비어 있음. 필요 이미지 최소 4종 — ① 히어로 정동진 기차 사진, ② S1 카드 3장(정동진/안목해변/주문진), ③ S2 BEFORE/AFTER 합성 이미지 2장, ④ S4 CTA 배경. 사용자가 원본 파일을 제공하거나, 임시 플레이스홀더로 진행할지 확인 필요.
2. `/intro` 라우트를 앱의 실제 진입점(`/`)으로 바꿀지, 별도 랜딩으로만 둘지 — 이번 작업 범위는 `/intro` 신설까지로 한정하고 라우트 스왑은 후속 논의로 둠.

---

## 11. 구현 순서 제안

1. `useScrollReveal`, `useScrollProgress` 훅
2. `IntroHeader` (로고만, 알파 보간)
3. `HeroSection` (S0, "미리 강릉" 타이틀)
4. `PlaceSelectSection` (S1, `PLACES` 재사용)
5. `PhotoExperienceSection` (S2, 슬라이더 직접 구현)
6. `CuratedTourSection` (S3, sticky + SVG path)
7. `CtaSection` (S4, `/`로 navigate)
8. `IntroPage`에서 6개 섹션 조립 + `App.tsx` 라우트 추가
9. reduce-motion 검증, 빌드(`npm run build`) 및 `npm run lint` 통과 확인
