/**
 * 비로그인 상태에서 "같은 사람의 요청"을 묶기 위한 익명 브라우저 세션 ID.
 *
 * AI 합성 서비스는 이 값을 키로 시간당 생성 횟수를 센다. 값을 보내지 않으면 서버가
 * 호출자 IP로 대체하는데, AI 서비스를 부르는 것은 백엔드 서버 하나뿐이라 모든
 * 사용자가 카운터를 공유하게 된다 — "사용자당 10회"가 "서비스 전체 10회"가 된다.
 *
 * 신원 확인용이 아니다. 서버는 이 값으로 사용자를 식별하거나 권한을 확인하지 않고,
 * 같은 사람에게 같은 값이 오는지만 본다. 그래서 임의의 UUID로 충분하다.
 *
 * 저장은 `sessionStorage`를 쓴다 — 앱 상태 저장소(`useAppStore`)와 같은 수명이라
 * 탭을 닫으면 함께 사라진다. `localStorage`를 쓰면 더 오래 유지되지만, 비로그인
 * 개발 단계에서 기기에 식별자를 영구히 남길 이유가 없다.
 */
const STORAGE_KEY = 'mirigangneung-session-id';

/** 스토리지를 못 쓰는 환경(시크릿 모드, 차단 설정)에서 페이지 수명 동안만 쓰는 값. */
let inMemoryFallback: string | null = null;

function createId(): string {
  const webCrypto = typeof globalThis.crypto === 'undefined' ? undefined : globalThis.crypto;
  if (webCrypto?.randomUUID) return webCrypto.randomUUID();
  // randomUUID가 없는 구형 브라우저 폴백. 충돌 가능성은 rate limit 용도에 충분히 낮다.
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getBrowserSessionId(): string {
  try {
    const storage = globalThis.sessionStorage;
    const stored = storage.getItem(STORAGE_KEY);
    if (stored) return stored;

    const created = createId();
    storage.setItem(STORAGE_KEY, created);
    return created;
  } catch {
    // 스토리지 접근 자체가 예외를 던지는 환경이 있다. 그래도 한 번 만든 값은
    // 페이지가 살아 있는 동안 유지해야 요청마다 카운터가 새로 생기지 않는다.
    inMemoryFallback ??= createId();
    return inMemoryFallback;
  }
}
