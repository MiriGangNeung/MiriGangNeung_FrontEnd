const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080/api/v1';

export type CompositionStatus =
  'QUEUED' | 'ANALYZING' | 'COMPOSITING' | 'QUALITY_CHECK' | 'DONE' | 'FAILED';

export interface CompositionJob {
  jobId: string;
  status: CompositionStatus;
  progress: number;
  stage: string;
  resultAvailable: boolean;
  downloadUrl: string | null;
  error: CompositionError | null;
  safety: CompositionSafety | null;
}

export interface CompositionError {
  code: string;
  message: string | null;
  retryable: boolean;
}

/**
 * 결과를 막지 않는 품질 경고. 서버가 `severity: warn`으로 판정한 것만 내려온다
 * (예: 얼굴이 업로드 사진과 덜 닮게 나온 경우). 거부는 `error`로 온다.
 */
export interface CompositionWarning {
  code: string;
  message: string | null;
}

export interface CompositionSafety {
  status: string | null;
  reasonCode: string | null;
  warnings: CompositionWarning[];
}

export interface CreateCompositionRequest {
  // eslint-disable-next-line no-undef -- File is a TS DOM lib type, not a runtime global.
  photo: File;
  onePickId: string;
  aspectRatio?: '1:1' | '4:5' | '9:16';
  backgroundImageUrl?: string;
}

export class CompositionApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string | null,
    message: string,
  ) {
    super(message);
    this.name = 'CompositionApiError';
  }
}

export async function createComposition(
  request: CreateCompositionRequest,
  baseUrl = API_BASE_URL,
): Promise<CompositionJob> {
  // eslint-disable-next-line no-undef -- FormData is a browser runtime global.
  const body = new FormData();
  body.append('photo', request.photo);
  body.append('onePickId', request.onePickId);
  if (request.aspectRatio) body.append('aspectRatio', request.aspectRatio);
  if (request.backgroundImageUrl) body.append('backgroundImageUrl', request.backgroundImageUrl);

  return requestComposition(`${normalizeBaseUrl(baseUrl)}/compositions`, {
    method: 'POST',
    body,
  });
}

export async function fetchComposition(
  jobId: string,
  baseUrl = API_BASE_URL,
): Promise<CompositionJob> {
  return requestComposition(
    `${normalizeBaseUrl(baseUrl)}/compositions/${encodeURIComponent(jobId)}`,
  );
}

async function requestComposition(
  url: string,
  // eslint-disable-next-line no-undef -- RequestInit is a TS DOM lib type, not a runtime global.
  init?: RequestInit,
): Promise<CompositionJob> {
  const response = init ? await fetch(url, init) : await fetch(url);
  const payload = (await response.json().catch(() => null)) as
    CompositionJob | { code?: string; message?: string } | null;

  if (!response.ok) {
    const error = payload as { code?: string; message?: string } | null;
    throw new CompositionApiError(
      response.status,
      error?.code ?? null,
      error?.message ?? `이미지 합성 요청에 실패했습니다. (${response.status})`,
    );
  }

  if (!isCompositionJob(payload)) {
    throw new CompositionApiError(
      502,
      'INVALID_COMPOSITION_RESPONSE',
      '이미지 합성 응답이 올바르지 않습니다.',
    );
  }
  return payload;
}

function isCompositionJob(value: unknown): value is CompositionJob {
  return (
    !!value &&
    typeof value === 'object' &&
    'jobId' in value &&
    'status' in value &&
    'progress' in value &&
    'stage' in value &&
    'resultAvailable' in value
  );
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, '');
}
