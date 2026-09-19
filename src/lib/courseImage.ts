import type { CourseStop } from '../types/domain';

const COURSE_CARD_WIDTH = 1600;
const COURSE_CARD_HEIGHT = 1000;

type CourseCardBase = {
  title: string;
  stops: CourseStop[];
  totalDistanceMeters: number;
  totalTravelMinutes: number;
  tags: string[];
};

export type CourseCardSvgInput = CourseCardBase & {
  compositeImageDataUrl?: string;
};

export type CourseImageDownloadInput = CourseCardBase & {
  compositeImageUrl?: string;
};

export function buildCourseCardSvg({
  title,
  stops,
  totalDistanceMeters,
  totalTravelMinutes,
  tags,
  compositeImageDataUrl,
}: CourseCardSvgInput): string {
  const visibleStops = stops.slice(0, 10);
  const remainingStopCount = Math.max(0, stops.length - visibleStops.length);
  const rowHeight = Math.min(72, Math.max(44, Math.floor(420 / visibleStops.length || 1)));
  const stopListStartY = 484;
  const tagText = tags.filter(Boolean).join('  |  ');
  const stopMarkup = visibleStops
    .map((stop, index) => {
      const circleX = 1002;
      const textX = 1040;
      const y = stopListStartY + index * rowHeight;
      const location = stop.address || stop.note;
      const category = getCourseStopCategoryLabel(stop);
      const line = index < visibleStops.length - 1;
      const secondary = rowHeight >= 54 ? `${category} · ${truncate(location, 31)}` : category;

      return `
        ${line ? `<line x1="${circleX}" y1="${y + 32}" x2="${circleX}" y2="${y + rowHeight - 4}" stroke="#cbd9f4" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 7"/>` : ''}
        <circle cx="${circleX}" cy="${y + 18}" r="18" fill="#2f6fed"/>
        <text x="${circleX}" y="${y + 24}" text-anchor="middle" font-size="17" font-weight="800" fill="#ffffff">${index + 1}</text>
        <text x="${textX}" y="${y + 16}" font-size="22" font-weight="800" fill="#101828">${escapeXml(truncate(stop.name, 26))}</text>
        <text x="${textX}" y="${y + 40}" font-size="14" font-weight="600" fill="#7a869f">${escapeXml(secondary)}</text>
      `;
    })
    .join('');
  const remainingStopMarkup = remainingStopCount
    ? `<text x="1040" y="${stopListStartY + visibleStops.length * rowHeight + 12}" font-size="15" font-weight="700" fill="#2f6fed">외 ${remainingStopCount}곳이 더 있어요</text>`
    : '';

  const heroImage = compositeImageDataUrl
    ? `<image href="${escapeXml(compositeImageDataUrl)}" x="40" y="40" width="880" height="920" preserveAspectRatio="xMidYMid slice" clip-path="url(#heroClip)"/>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${COURSE_CARD_WIDTH}" height="${COURSE_CARD_HEIGHT}" viewBox="0 0 ${COURSE_CARD_WIDTH} ${COURSE_CARD_HEIGHT}">
    <defs>
      <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#eef4ff"/>
        <stop offset="1" stop-color="#f8faff"/>
      </linearGradient>
      <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#16489e"/>
        <stop offset="0.55" stop-color="#2f6fed"/>
        <stop offset="1" stop-color="#69a7ff"/>
      </linearGradient>
      <linearGradient id="heroShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#07152d" stop-opacity="0.12"/>
        <stop offset="1" stop-color="#07152d" stop-opacity="0.76"/>
      </linearGradient>
      <clipPath id="heroClip"><rect x="40" y="40" width="880" height="920" rx="40"/></clipPath>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#284779" flood-opacity="0.12"/>
      </filter>
    </defs>
    <rect width="1600" height="1000" fill="url(#background)"/>
    <rect x="40" y="40" width="880" height="920" rx="40" fill="url(#hero)" filter="url(#shadow)"/>
    ${heroImage}
    <rect x="40" y="40" width="880" height="920" rx="40" fill="url(#heroShade)"/>
    <text x="88" y="102" font-size="20" font-weight="800" letter-spacing="3" fill="#dfeaff">MIRI GANGNEUNG · AI COMPOSITE</text>
    <text x="88" y="874" font-size="23" font-weight="700" fill="#e8f0ff">사진으로 먼저 만나는 나의 강릉</text>
    <text x="88" y="925" font-size="52" font-weight="900" letter-spacing="-2" fill="#ffffff">${escapeXml(title)}</text>

    <rect x="950" y="40" width="610" height="920" rx="40" fill="#ffffff" filter="url(#shadow)"/>
    <text x="995" y="100" font-size="18" font-weight="800" letter-spacing="3" fill="#2f6fed">COURSE INFO</text>
    <text x="995" y="157" font-size="39" font-weight="900" letter-spacing="-1.5" fill="#101828">${escapeXml(title)}</text>
    <text x="995" y="196" font-size="17" font-weight="600" fill="#7a869f">사진으로 시작해 코스로 완성한 강릉 여행</text>

    <rect x="995" y="230" width="150" height="94" rx="20" fill="#f1f5ff"/>
    <rect x="1160" y="230" width="170" height="94" rx="20" fill="#f1f5ff"/>
    <rect x="1345" y="230" width="170" height="94" rx="20" fill="#f1f5ff"/>
    <text x="1017" y="261" font-size="14" font-weight="700" fill="#7a869f">장소</text>
    <text x="1017" y="301" font-size="29" font-weight="900" fill="#2f6fed">총 ${stops.length}곳</text>
    <text x="1182" y="261" font-size="14" font-weight="700" fill="#7a869f">도보 거리</text>
    <text x="1182" y="301" font-size="29" font-weight="900" fill="#2f6fed">${escapeXml(formatDistance(totalDistanceMeters))}</text>
    <text x="1367" y="261" font-size="14" font-weight="700" fill="#7a869f">소요 시간</text>
    <text x="1367" y="301" font-size="29" font-weight="900" fill="#2f6fed">${totalTravelMinutes}분</text>

    <rect x="995" y="344" width="520" height="52" rx="18" fill="#f8faff"/>
    <text x="1020" y="377" font-size="16" font-weight="700" fill="#50617e">${escapeXml(truncate(tagText || '강릉 맞춤 여행', 42))}</text>
    <line x1="995" y1="425" x2="1515" y2="425" stroke="#e7ecf5" stroke-width="2"/>
    <text x="995" y="458" font-size="21" font-weight="850" fill="#101828">코스 일정</text>
    ${stopMarkup}
    ${remainingStopMarkup}

    <text x="1255" y="925" text-anchor="middle" font-size="14" font-weight="700" letter-spacing="2" fill="#8ea1c2">MIRI GANGNEUNG · 나만의 강릉 코스</text>
  </svg>`;
}

export async function downloadCourseImage(
  input: CourseImageDownloadInput,
  filename = '미리강릉-나만의-코스.png',
): Promise<void> {
  const compositeImageDataUrl = input.compositeImageUrl
    ? await fetchImageAsDataUrl(input.compositeImageUrl).catch(() => undefined)
    : undefined;
  const svg = buildCourseCardSvg({ ...input, compositeImageDataUrl });
  const png = await rasterizeSvg(svg);
  triggerBlobDownload(png, filename);
}

function formatDistance(meters: number): string {
  if (meters <= 0) return '거리 확인 중';
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

function getCourseStopCategoryLabel(stop: CourseStop): string {
  if (!stop.external) return stop.onePick ? '원픽 관광지' : '관광지';
  switch (stop.category) {
    case 'restaurant':
      return '음식점';
    case 'cafe':
      return '카페';
    case 'culture':
      return '문화시설';
    case 'attraction':
      return '관광명소';
    default:
      return '추천 장소';
  }
}

function truncate(value: string, maxLength: number): string {
  const normalized = value.trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}…` : normalized;
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

async function fetchImageAsDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`코스 이미지 다운로드 실패 (${response.status})`);
  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('이미지를 읽지 못했어요.'));
    reader.readAsDataURL(blob);
  });
}

async function rasterizeSvg(svg: string) {
  if (document.fonts?.ready) await document.fonts.ready;
  const svgUrl = URL.createObjectURL(
    new window.Blob([svg], { type: 'image/svg+xml;charset=utf-8' }),
  );
  try {
    const image = await loadImage(svgUrl);
    const canvas = document.createElement('canvas');
    canvas.width = COURSE_CARD_WIDTH;
    canvas.height = COURSE_CARD_HEIGHT;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('이미지 캔버스를 만들지 못했어요.');
    context.drawImage(image, 0, 0, COURSE_CARD_WIDTH, COURSE_CARD_HEIGHT);
    return await new Promise<globalThis.Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('PNG 이미지를 만들지 못했어요.'))),
        'image/png',
        0.96,
      );
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function loadImage(url: string): Promise<InstanceType<typeof window.Image>> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('코스 이미지를 렌더링하지 못했어요.'));
    image.src = url;
  });
}

function triggerBlobDownload(blob: globalThis.Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}
