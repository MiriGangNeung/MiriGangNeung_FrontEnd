import { Download, X } from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';
import { downloadImage } from '../../lib/downloadImage';

type CompositeImageModalProps = {
  imageUrl: string;
  filename?: string;
  onClose: () => void;
};

export function CompositeImageModal({
  imageUrl,
  filename = '미리강릉-합성사진.png',
  onClose,
}: CompositeImageModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  function closeOnBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  async function handleSave() {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await downloadImage(imageUrl, filename);
    } catch {
      setSaveError('이미지를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-[2px] sm:p-8"
      onMouseDown={closeOnBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="AI 합성 이미지"
    >
      <div className="relative flex max-h-full max-w-3xl flex-col items-center gap-4">
        <img
          src={imageUrl}
          alt="AI 합성 결과 이미지"
          className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-[0_24px_70px_rgba(0,0,0,.5)]"
        />
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-ink shadow-cta hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download size={16} strokeWidth={1.8} /> {isSaving ? '저장 중...' : '이미지 저장'}
        </button>
        {saveError && (
          <p className="text-center text-xs text-coral" role="alert">
            {saveError}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="합성 이미지 닫기"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink hover:bg-white"
      >
        <X size={20} />
      </button>
    </div>
  );
}
