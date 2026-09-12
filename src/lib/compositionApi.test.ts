import { afterEach, describe, expect, it, vi } from 'vitest';

describe('compositionApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates a composition job with the selected photo and backend metadata', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          jobId: 'composition-1',
          status: 'QUEUED',
          progress: 0,
          stage: '요청 접수',
          resultAvailable: false,
          downloadUrl: null,
          place: null,
          error: null,
          safety: null,
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const api = await import('./compositionApi').catch(() => null);
    expect(api).not.toBeNull();
    if (!api) return;

    // eslint-disable-next-line no-undef -- File is provided by the Vitest browser-compatible runtime.
    const photo = new File(['image-data'], 'portrait.jpg', { type: 'image/jpeg' });
    const job = await api.createComposition(
      {
        photo,
        onePickId: 'place-uuid',
        aspectRatio: '4:5',
        backgroundImageUrl: 'https://images.example/anmok-original.jpg',
      },
      'http://localhost:8080/api/v1',
    );

    expect(job).toMatchObject({ jobId: 'composition-1', status: 'QUEUED', progress: 0 });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/compositions',
      expect.objectContaining({ method: 'POST' }),
    );
    // eslint-disable-next-line no-undef -- RequestInit is a TS DOM lib type, not a runtime global.
    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    // eslint-disable-next-line no-undef -- FormData is provided by the Vitest browser-compatible runtime.
    expect(request.body).toBeInstanceOf(FormData);
    // eslint-disable-next-line no-undef -- FormData is provided by the Vitest browser-compatible runtime.
    const body = request.body as FormData;
    expect(body.get('photo')).toBe(photo);
    expect(body.get('onePickId')).toBe('place-uuid');
    expect(body.get('aspectRatio')).toBe('4:5');
    expect(body.get('backgroundImageUrl')).toBe('https://images.example/anmok-original.jpg');
  });

  it('retrieves the latest server status for a composition job', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          jobId: 'composition-1',
          status: 'COMPOSITING',
          progress: 55,
          stage: '이미지 합성 중',
          resultAvailable: false,
          downloadUrl: null,
          place: null,
          error: null,
          safety: null,
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const api = await import('./compositionApi');
    const fetchComposition = (
      api as { fetchComposition?: (jobId: string, baseUrl: string) => unknown }
    ).fetchComposition;

    expect(fetchComposition).toBeTypeOf('function');
    if (!fetchComposition) return;

    const job = await fetchComposition('composition-1', 'http://localhost:8080/api/v1');

    expect(job).toMatchObject({ status: 'COMPOSITING', progress: 55 });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/compositions/composition-1',
    );
  });

  it('sends a preset model without a photo', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          jobId: 'composition-preset-1',
          status: 'QUEUED',
          progress: 0,
          stage: '요청 접수',
          resultAvailable: false,
          downloadUrl: null,
          error: null,
          safety: null,
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);
    const api = await import('./compositionApi');
    await api.createComposition(
      { modelPresetId: 'default-female-01', onePickId: 'place-uuid' },
      'http://localhost:8080/api/v1',
    );
    // eslint-disable-next-line no-undef -- FormData is provided by the Vitest runtime.
    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(body.get('modelPresetId')).toBe('default-female-01');
    expect(body.get('photo')).toBeNull();
  });
});

describe('compositionApi session id', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('always sends a sessionId so the AI rate limit is per user, not per server', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          jobId: 'composition-1',
          status: 'QUEUED',
          progress: 0,
          stage: '요청 접수',
          resultAvailable: false,
          downloadUrl: null,
          place: null,
          error: null,
          safety: null,
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const api = await import('./compositionApi');
    // eslint-disable-next-line no-undef -- File is provided by the Vitest runtime.
    const photo = new File(['image-data'], 'portrait.jpg', { type: 'image/jpeg' });
    await api.createComposition({ photo, onePickId: 'place-uuid' }, 'http://localhost:8080/api/v1');

    // eslint-disable-next-line no-undef -- FormData is a TS DOM lib type.
    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(body.get('sessionId')).toBeTruthy();
  });
});
