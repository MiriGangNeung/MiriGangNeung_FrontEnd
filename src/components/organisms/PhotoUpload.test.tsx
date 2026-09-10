import { renderToStaticMarkup } from 'react-dom/server';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { PhotoUpload } from './PhotoUpload';

describe('PhotoUpload image selection guidance', () => {
  it('hides image names and uses the concise photo selection guidance', () => {
    const emptyUploadMarkup = renderToStaticMarkup(
      <PhotoUpload
        onePickName="경포해변"
        photoFile={null}
        onPhotoSelect={() => undefined}
        agreeA={false}
        agreeB={false}
        onToggleA={() => undefined}
        onToggleB={() => undefined}
        phase="ready"
        stageIndex={0}
        elapsed={0}
        onStart={() => undefined}
        onReset={() => undefined}
        onNext={() => undefined}
      />,
    );

    // eslint-disable-next-line no-undef -- Blob is available in the Vitest runtime.
    const selectedPhoto = Object.assign(new Blob(['photo'], { type: 'image/jpeg' }), {
      name: 'my-trip-photo.jpg',
      // eslint-disable-next-line no-undef -- File is a TypeScript DOM lib type.
    }) as File;
    const selectedUploadMarkup = renderToStaticMarkup(
      <PhotoUpload
        onePickName="경포해변"
        photoFile={selectedPhoto}
        onPhotoSelect={() => undefined}
        agreeA={false}
        agreeB={false}
        onToggleA={() => undefined}
        onToggleB={() => undefined}
        phase="ready"
        stageIndex={0}
        elapsed={0}
        onStart={() => undefined}
        onReset={() => undefined}
        onNext={() => undefined}
      />,
    );

    expect(emptyUploadMarkup).not.toContain('경포해변');
    expect(selectedUploadMarkup).not.toContain('경포해변');
    expect(selectedUploadMarkup).not.toContain('my-trip-photo.jpg');
    expect(emptyUploadMarkup).toContain('클릭해서 사진을 선택하세요');
    expect(emptyUploadMarkup).toContain('JPG PNG 10MB이하 사진을 권장합니다.');
  });

  it('shows the backend generation error with a way to start over', () => {
    const props = {
      onePickName: '경포해변',
      photoFile: null,
      onPhotoSelect: () => undefined,
      agreeA: true,
      agreeB: true,
      onToggleA: () => undefined,
      onToggleB: () => undefined,
      phase: 'failed' as never,
      stageIndex: 2,
      elapsed: 2,
      onStart: () => undefined,
      onReset: () => undefined,
      onNext: () => undefined,
      errorMessage: '사진 속 인물을 찾을 수 없습니다.',
    } as ComponentProps<typeof PhotoUpload> & { errorMessage: string };

    const markup = renderToStaticMarkup(<PhotoUpload {...props} />);

    expect(markup).toContain('사진 속 인물을 찾을 수 없습니다.');
    expect(markup).toContain('다시 시도하기');
  });
});

describe('PhotoUpload generative-AI expectation setting', () => {
  // 30초를 기다린 뒤에야 결과가 어색하다는 걸 알게 되면 실망이 크다.
  // 시작 버튼 앞에서 미리 말해 둔다.
  it('warns before starting that AI output can look off', () => {
    const markup = renderToStaticMarkup(
      <PhotoUpload
        onePickName="안반데기"
        photoFile={null}
        onPhotoSelect={() => undefined}
        agreeA={false}
        agreeB={false}
        onToggleA={() => undefined}
        onToggleB={() => undefined}
        phase="ready"
        stageIndex={0}
        elapsed={0}
        onStart={() => undefined}
        onReset={() => undefined}
        onNext={() => undefined}
      />,
    );

    expect(markup).toContain('어색하게');
    expect(markup).toContain('다시 만들 수 있습니다');
  });
});

describe('PhotoUpload background caution', () => {
  // 서버가 배경 변형을 감지해도 이제는 결과를 준다(BACKGROUND_ALTERED가 경고로 바뀜).
  // 결과물을 받는 대신, 사용자가 시작 전에 알고 있어야 하는 사실이 됐다.
  it('warns before starting that the background may differ from the original', () => {
    const markup = renderToStaticMarkup(
      <PhotoUpload
        onePickName="안반데기"
        photoFile={null}
        onPhotoSelect={() => undefined}
        agreeA={false}
        agreeB={false}
        onToggleA={() => undefined}
        onToggleB={() => undefined}
        phase="ready"
        stageIndex={0}
        elapsed={0}
        onStart={() => undefined}
        onReset={() => undefined}
        onNext={() => undefined}
      />,
    );

    expect(markup).toContain('배경이 원본 사진과 다소 다르게 표현됐을 수 있고');
  });
});
