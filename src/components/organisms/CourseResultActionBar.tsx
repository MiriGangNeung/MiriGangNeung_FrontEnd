import { Download, Image as ImageIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import { CompositeImageModal } from './CompositeImageModal';
import { downloadImage } from '../../lib/downloadImage';

const COMPOSITE_FILENAME = '미리강릉-합성사진.png';

type CourseResultActionBarProps = {
  isPlaceAdderOpen: boolean;
  canConfirmPlace: boolean;
  compositeImageUrl?: string;
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function CourseResultActionBar({
  isPlaceAdderOpen,
  canConfirmPlace,
  compositeImageUrl,
  onBack,
  onClose,
  onConfirm,
}: CourseResultActionBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const hasCompositeImage = Boolean(compositeImageUrl);

  async function handleSave() {
    if (!compositeImageUrl || isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await downloadImage(compositeImageUrl, COMPOSITE_FILENAME);
    } catch {
      setSaveError('이미지를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="fixed bottom-3 left-1/2 z-[700] flex w-[calc(100%-2rem)] max-w-[560px] -translate-x-1/2 items-center justify-center gap-1.5 rounded-full border border-line bg-white p-2 shadow-[0_10px_30px_rgba(16,24,40,.16)] sm:bottom-6 sm:w-auto sm:gap-2 sm:p-3.5">
        {saveError && (
          <p
            role="alert"
            className="absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/90 px-4 py-2 text-xs font-semibold text-white"
          >
            {saveError}
          </p>
        )}
        {isPlaceAdderOpen ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="h-11 shrink-0 whitespace-nowrap rounded-full px-5 text-sm font-semibold text-ink-muted hover:text-brand"
            >
              취소
            </button>
            <button
              type="button"
              disabled={!canConfirmPlace}
              onClick={onConfirm}
              className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-6 text-sm font-bold text-white shadow-cta hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-fill disabled:text-ink-soft disabled:shadow-none sm:flex-none sm:text-[15px]"
            >
              <Plus size={18} strokeWidth={1.9} /> 코스에 추가
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onBack}
              className="hidden h-11 shrink-0 whitespace-nowrap rounded-full px-[18px] text-sm font-semibold text-ink-muted hover:text-brand sm:block"
            >
              다른 코스 보기
            </button>
            <button
              type="button"
              disabled={!hasCompositeImage}
              onClick={() => setIsModalOpen(true)}
              className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-4 text-sm font-bold text-white shadow-cta hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-fill disabled:text-ink-soft disabled:shadow-none sm:flex-none sm:px-6 sm:text-[15px]"
            >
              <ImageIcon size={18} strokeWidth={1.8} /> 합성 이미지 보기
            </button>
            <button
              type="button"
              disabled={!hasCompositeImage || isSaving}
              onClick={() => void handleSave()}
              className="flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-semibold text-ink-muted hover:text-brand disabled:cursor-not-allowed disabled:text-ink-soft disabled:hover:text-ink-soft sm:px-[18px]"
            >
              <Download size={16} strokeWidth={1.8} /> {isSaving ? '저장 중...' : '저장'}
            </button>
          </>
        )}
      </div>

      {isModalOpen && compositeImageUrl && (
        <CompositeImageModal
          imageUrl={compositeImageUrl}
          filename={COMPOSITE_FILENAME}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
