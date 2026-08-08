import type {
  Companion,
  ComposeStage,
  CourseStop,
  Duration,
  Place,
  Tab,
  TripType,
} from '../types/domain';

export const PLACES: Place[] = [
  {
    id: 'jeongdongjin',
    name: '정동진',
    region: '강릉시 강동면',
    tags: ['해변', '일출 명소'],
    cat: 'beach',
    lat: 37.6898,
    lng: 129.0338,
  },
  {
    id: 'anmok',
    name: '안목해변',
    region: '강릉시 견소동',
    tags: ['해변', '카페거리'],
    cat: 'food',
    lat: 37.7718,
    lng: 128.9467,
  },
  {
    id: 'jumunjin',
    name: '주문진 항구',
    region: '강릉시 주문진읍',
    tags: ['항구', '어시장'],
    cat: 'food',
    lat: 37.8934,
    lng: 128.8298,
  },
  {
    id: 'daegwallyeong',
    name: '대관령 양떼목장',
    region: '평창군 대관령면',
    tags: ['자연', '목장'],
    cat: 'nature',
    lat: 37.6786,
    lng: 128.7195,
  },
  {
    id: 'haslla',
    name: '하슬라아트월드',
    region: '강릉시 강동면',
    tags: ['전시', '예술'],
    cat: 'culture',
    lat: 37.7065,
    lng: 129.0101,
  },
  {
    id: 'simgok',
    name: '심곡항 헌화로',
    region: '강릉시 강동면',
    tags: ['해변', '드라이브'],
    cat: 'beach',
    lat: 37.6601,
    lng: 129.0564,
  },
  {
    id: 'seongyojang',
    name: '선교장',
    region: '강릉시 운정길',
    tags: ['문화유산', '고택'],
    cat: 'culture',
    lat: 37.7857,
    lng: 128.879,
  },
  {
    id: 'gwaebangsan',
    name: '괘방산',
    region: '강릉시 강동면',
    tags: ['자연', '등산'],
    cat: 'nature',
    lat: 37.7038,
    lng: 129.0192,
  },
  {
    id: 'gyeongpo',
    name: '경포해변',
    region: '강릉시 강문동',
    tags: ['해변', '산책'],
    cat: 'beach',
    lat: 37.8036,
    lng: 128.9096,
  },
];

export const findPlace = (id: string): Place => PLACES.find((p) => p.id === id) || PLACES[0];

export const TABS: Tab[] = [
  { id: 'all', label: '전체' },
  { id: 'filter', label: '필터' },
  { id: 'beach', label: '해변' },
  { id: 'food', label: '맛집' },
  { id: 'nature', label: '자연' },
];

export const ROUTES = [
  '/',
  '/one-pick',
  '/photo-upload',
  '/composite-result',
  '/course-options',
  '/course-result',
] as const;

/** Header progress steps. NOTE: 6 routes map onto 4 steps — see ROUTE_TO_STEP. */
export const STEP_LABELS: string[] = ['배경 선택', '사진 합성', '코스 생성', '결과 확인'];
/** pathname -> [activeStep (1-based), completedStepCount] */
export const ROUTE_TO_STEP: Record<string, [number, number]> = {
  '/': [1, 0],
  '/one-pick': [1, 0],
  '/photo-upload': [2, 1],
  '/composite-result': [3, 2],
  '/course-options': [3, 2],
  '/course-result': [4, 3],
};

export const COMPOSE_STAGES: ComposeStage[] = [
  { label: '요청 접수', hint: '대기열에 등록했어요' },
  { label: '사진 · 배경 분석', hint: '인물과 배경의 광원을 맞춥니다' },
  { label: '이미지 합성', hint: '수채화 톤으로 렌더링 중' },
  { label: '품질 확인', hint: '경계선과 색감을 점검합니다' },
  { label: '완료', hint: '결과 이미지를 준비했어요' },
];

export const TRIP_TYPES: TripType[] = [
  { id: 'food', label: '식도락' },
  { id: 'rest', label: '휴식' },
  { id: 'active', label: '액티비티' },
  { id: 'culture', label: '문화 · 예술' },
  { id: 'nature', label: '자연 · 산책' },
];

export const COMPANIONS: Companion[] = [
  { id: 'family', label: '가족', hint: '이동 부담이 적은 코스' },
  { id: 'couple', label: '커플', hint: '분위기 좋은 장소 위주' },
  { id: 'solo', label: '솔로', hint: '자유로운 동선' },
  { id: 'friends', label: '친구', hint: '사진 찍기 좋은 곳 중심' },
];

export const DURATIONS: Duration[] = [
  { id: 'day', label: '당일' },
  { id: 'night1', label: '1박 2일' },
  { id: 'custom', label: '직접 설정' },
];

/** Generated course. lat/lng are real Gangneung coordinates — used by CourseMap. */
export const COURSE_STOPS: CourseStop[] = [
  {
    n: 1,
    id: 'jumunjin',
    name: '주문진 항구',
    time: '09:30',
    stay: '60분',
    crowd: 'easy',
    onePick: true,
    note: '어시장에서 아침 회 한 접시',
    lat: 37.8934,
    lng: 128.8298,
  },
  {
    n: 2,
    id: 'gyeongpo',
    name: '경포해변',
    time: '11:00',
    stay: '90분',
    crowd: 'mid',
    note: '해변 산책 후 카페에서 휴식',
    lat: 37.8036,
    lng: 128.9096,
  },
  {
    n: 3,
    id: 'seongyojang',
    name: '선교장',
    time: '14:00',
    stay: '60분',
    crowd: 'easy',
    note: '조선시대 고택과 정원 관람',
    lat: 37.7857,
    lng: 128.879,
  },
  {
    n: 4,
    id: 'anmok',
    name: '안목해변 카페거리',
    time: '16:00',
    stay: '90분',
    crowd: 'busy',
    note: '바다를 보며 커피 한 잔',
    lat: 37.7727,
    lng: 128.9483,
  },
];

export const CROWD_LABEL: Record<CourseStop['crowd'], { text: string; className: string }> = {
  easy: { text: '혼잡도 여유', className: 'bg-ok/10 text-ok' },
  mid: { text: '혼잡도 보통', className: 'bg-brand-tint text-brand' },
  busy: { text: '혼잡도 혼잡', className: 'bg-coral-tint text-coral' },
};
