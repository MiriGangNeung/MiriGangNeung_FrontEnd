import { afterEach, describe, expect, it, vi } from 'vitest';
import { downloadImage } from './downloadImage';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('downloadImage', () => {
  it('fetches the url and clicks a download anchor', async () => {
    const blob = { type: 'image/png' };
    const anchor = { href: '', download: '', click: vi.fn(), remove: vi.fn() };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, blob: () => Promise.resolve(blob) }),
    );
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:mock'),
      revokeObjectURL: vi.fn(),
    });
    vi.stubGlobal('document', {
      createElement: vi.fn().mockReturnValue(anchor),
      body: { appendChild: vi.fn() },
    });

    await downloadImage('http://example.test/a.png', 'a.png');

    expect(anchor.download).toBe('a.png');
    expect(anchor.click).toHaveBeenCalledOnce();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock');
  });

  it('throws when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    await expect(downloadImage('http://example.test/a.png', 'a.png')).rejects.toThrow(
      '다운로드 실패',
    );
  });
});
