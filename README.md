# 미리강릉 (Miri Gangneung) - FrontEnd

AI 기반 맞춤형 강릉 여행 코스 추천 및 사진 합성 서비스 **"미리강릉"**의 데스크톱 웹 프론트엔드 개발 저장소입니다.

---

## 📌 프로젝트 소개 (Overview)

"미리강릉"은 사용자가 강릉의 주요 여행지를 선택하고, AI를 이용해 원하는 배경에 자신의 사진을 합성한 뒤, 실제 지도 기반의 맞춤형 여행 코스를 생성해 주는 데스크톱 웹 서비스입니다.

전체 서비스 흐름은 총 6개의 주요 화면(스크린)으로 구성되어 있습니다:
`배경 선택` → `원픽 배경 확인` → `사진 업로드/합성` → `합성 결과` → `코스 조건 설정` → `코스 결과 및 지도`

---

## 🛠️ 기술 스택 (Tech Stack)

- **Core Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS, Vanilla CSS (`src/index.css`)
- **Icons**: Lucide React (`lucide-react`)
- **Map & Route**: Leaflet, Kakao Map API, 도보 경로 시각화 모듈
- **Code Quality**: ESLint, Prettier, Vitest

---

## 📁 주요 폴더 및 파일 구조 (Directory Structure)

```text
├── api/                        # 카카오 도보 경로 및 서버리스 API 모듈
├── docs/                       # 프로젝트 설계 문서 및 구현 계획
├── src/
│   ├── components/             # 재사용 가능한 UI 컴포넌트
│   │   ├── ProgressHeader.tsx  # 상단 공통 진행 단계 헤더
│   │   ├── PlaceCard.tsx       # 여행지 장소 카드
│   │   ├── CourseMap.tsx       # 지도 및 도보 경로 시각화 컴포넌트
│   │   └── ...
│   ├── screens/                # 6개 핵심 화면 스크린 컴포넌트
│   │   ├── BackgroundPicker.tsx  # 1. 배경 고르기
│   │   ├── OnePickConfirm.tsx    # 2. 원픽 배경 확인
│   │   ├── PhotoUpload.tsx       # 3. 사진 합성 진행
│   │   ├── CompositeResult.tsx   # 4. 합성 결과 확인
│   │   ├── CourseOptions.tsx     # 5. 코스 조건 설정
│   │   └── CourseResult.tsx      # 6. 코스 결과 및 지도
│   ├── data/places.ts          # 장소 데이터, 테마 탭, 코스 경유지 데이터 (실제 위경도 포함)
│   ├── lib/                    # Kakao Map 및 도보 경로 계산 관련 유틸리티
│   ├── App.tsx                 # 전체 애플리케이션 상태 및 스크린 전환 관리
│   └── main.tsx                # 엔트리 포인트
├── index.html
├── vite.config.ts
└── README.md
```

---

## 🚀 로컬 실행 방법 (Getting Started)

백엔드를 먼저 실행한 뒤 프론트를 실행한다. 기본 주소는 백엔드 `http://localhost:8080`, 프론트 `http://localhost:5173`이다.

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 `.env.local`로 복사하고 값을 입력한다.

```bash
cp .env.example .env.local
```

```dotenv
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_KAKAO_MAP_API_KEY=카카오_JavaScript_키
KAKAO_REST_API_KEY=카카오_REST_키
```

`VITE_KAKAO_MAP_API_KEY`는 브라우저용 지도 SDK 키이고, `KAKAO_REST_API_KEY`는 개발 서버가 도보 경로 API를 호출할 때만 사용한다. REST 키에는 `VITE_` 접두사를 붙이지 않는다.

백엔드의 호스트 포트를 `APP_PORT=8081`로 바꿨다면 `VITE_API_BASE_URL`도 `http://localhost:8081/api/v1`로 맞춘다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173)을 연다.

### 4. 종료 및 검증

프론트 터미널에서 `Ctrl+C`를 누르면 개발 서버가 종료된다.

```bash
npm test -- --run
npm run lint
npm run build
```

---

## 🖥️ 주요 화면 구성 및 흐름 (Screens & Flow)

### 1. 배경 고르기 (`BackgroundPicker`)

- 최대 3개의 강릉 여행지를 선택할 수 있습니다.
- 카테고리 필터 칩 지원 및 카드 hover 효과가 적용되어 있습니다.

### 2. 원픽 배경 확인 (`OnePickConfirm`)

- 선택한 여행지 중 AI 합성에 사용할 1개의 **원픽 배경**을 결정합니다.
- 나머지 장소는 여행 코스 후보지로 유지됩니다.

### 3. 사진 합성 (`PhotoUpload`)

- 사용자 사진을 업로드하고 필수 약관에 동의합니다.
- AI 생성 5단계 프로세스가 실시간 타임라인으로 표시됩니다.

### 4. 합성 결과 (`CompositeResult`)

- 완성된 AI 합성 이미지를 확인하고, 코스 생성 단계로 이동합니다.

### 5. 코스 조건 설정 (`CourseOptions`)

- 여행 유형(힐링/맛집 등), 동반자 구성, 여행 기간 등을 선택하여 나만의 맞춤 조건을 설정합니다.

### 6. 코스 결과 + 지도 (`CourseResult`)

- AI가 추천하는 순서대로 정렬된 여행 코스를 타임라인 형태로 보여줍니다.
- Leaflet 및 카카오 지도를 통해 각 장소의 위치와 실제 도보 경로를 지도 상에 시각적으로 표시합니다.

---

## 🎨 디자인 시스템 (Design Tokens)

- **Brand Color**: `#2F6FED` (Primary Blue), `#1E54C4` (Brand Dark), `#E8F0FE` (Tint)
- **Accent Color**: `#F0573F` (Coral Accent), `#1F9E56` (Success Green)
- **Typography**: Noto Sans KR (400, 500, 700, 800)
- **Border Radius**: `999px` (Pill), `20px` (Panel), `16px` (Card)
