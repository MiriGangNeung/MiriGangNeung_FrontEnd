import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * 이 값은 AI 서비스의 시간당 생성 한도 카운터 키가 된다. 요청마다 값이 달라지면
 * 한도가 사실상 무력화되고, 반대로 모두가 같은 값을 쓰면 서로의 한도를 잡아먹는다.
 */
describe('browserSessionId', () => {
  beforeEach(() => {
    vi.resetModules();
    globalThis.sessionStorage?.clear?.();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the same id across calls', async () => {
    const { getBrowserSessionId } = await import('./browserSession');

    expect(getBrowserSessionId()).toBe(getBrowserSessionId());
  });

  it('reuses the id already in sessionStorage', async () => {
    const store = new Map<string, string>([['mirigangneung-session-id', 'existing-id']]);
    vi.stubGlobal('sessionStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    });

    const { getBrowserSessionId } = await import('./browserSession');

    expect(getBrowserSessionId()).toBe('existing-id');
  });

  it('stays stable when storage throws (private mode)', async () => {
    vi.stubGlobal('sessionStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    });

    const { getBrowserSessionId } = await import('./browserSession');
    const first = getBrowserSessionId();

    expect(first).toBeTruthy();
    expect(getBrowserSessionId()).toBe(first);
  });
});
