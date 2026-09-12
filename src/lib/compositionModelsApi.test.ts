import { afterEach, describe, expect, it, vi } from 'vitest';

describe('compositionModelsApi', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('loads model metadata from the backend and resolves its image URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 'default-female-01',
            name: '기본 AI 모델',
            imageUrl: '/api/v1/composition-models/default-female-01/image',
          },
        ]),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);
    const api = await import('./compositionModelsApi');
    await expect(api.fetchCompositionModels('http://localhost:8080/api/v1')).resolves.toHaveLength(
      1,
    );
    expect(
      api.toCompositionModelImageUrl(
        '/api/v1/composition-models/default-female-01/image',
        'http://localhost:8080/api/v1',
      ),
    ).toBe('http://localhost:8080/api/v1/composition-models/default-female-01/image');
  });
});
