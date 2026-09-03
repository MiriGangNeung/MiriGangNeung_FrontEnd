import { Plus, Sparkles } from 'lucide-react';

type CourseResultActionBarProps = {
  isPlaceAdderOpen: boolean;
  canConfirmPlace: boolean;
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function CourseResultActionBar({
  isPlaceAdderOpen,
  canConfirmPlace,
  onBack,
  onClose,
  onConfirm,
}: CourseResultActionBarProps) {
  return (
    <div className="fixed bottom-3 left-1/2 z-[700] flex w-[calc(100%-2rem)] max-w-[560px] -translate-x-1/2 items-center justify-center gap-1.5 rounded-full border border-line bg-white p-2 shadow-[0_10px_30px_rgba(16,24,40,.16)] sm:bottom-6 sm:w-auto sm:gap-2 sm:p-3.5">
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
          <button className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-4 text-sm font-bold text-white shadow-cta hover:bg-brand-dark sm:flex-none sm:px-6 sm:text-[15px]">
            <Sparkles size={18} strokeWidth={1.8} /> 스토리 카드 만들기
          </button>
          <button className="h-11 shrink-0 whitespace-nowrap rounded-full px-3 text-sm font-semibold text-ink-muted hover:text-brand sm:px-[18px]">
            저장 · 공유
          </button>
        </>
      )}
    </div>
  );
}
