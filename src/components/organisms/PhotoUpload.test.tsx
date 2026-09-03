import { renderToStaticMarkup } from 'react-dom/server';
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
});
