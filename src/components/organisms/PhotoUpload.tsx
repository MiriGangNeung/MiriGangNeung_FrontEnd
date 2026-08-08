import { ArrowRight, ArrowUp, Check, Clock, Database, RotateCcw, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import type { ChangeEvent, DragEvent, ReactNode } from 'react';
import { ImageSlot } from '../atoms/ImageSlot';
import { COMPOSE_STAGES } from '../../data/places';
import type { ComposePhase } from '../../types/domain';

type PhotoUploadProps = {
  onePickName: string;
  onePickPhoto?: string;
  // eslint-disable-next-line no-undef -- File is a TS DOM lib type, not a runtime global
  photoFile: File | null;
  // eslint-disable-next-line no-undef -- File is a TS DOM lib type, not a runtime global
  onPhotoSelect: (file: File | null) => void;
  agreeA: boolean;
  agreeB: boolean;
  onToggleA: () => void;
  onToggleB: () => void;
  phase: ComposePhase;
  stageIndex: number;
  elapsed: number;
  onStart: () => void;
  onReset: () => void;
  onNext: () => void;
};

/**
 * Screen 3 — side-by-side background + user photo, consent, and the compose run.
 */
export function PhotoUpload({
  onePickName,
  onePickPhoto,
  photoFile,
  onPhotoSelect,
  agreeA,
  agreeB,
  onToggleA,
  onToggleB,
  phase,
  stageIndex,
  elapsed,
  onStart,
  onReset,
  onNext,
}: PhotoUploadProps) {
  const canGenerate = agreeA && agreeB && !!photoFile;
  // eslint-disable-next-line no-undef -- HTMLInputElement is a TS DOM lib type, not a runtime global
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line no-undef -- URL is a browser global, not a runtime global in the lint env
  const photoUrl = useMemo(
    () => (photoFile ? URL.createObjectURL(photoFile) : undefined),
    [photoFile],
  );
  useEffect(
    () => () => {
      // eslint-disable-next-line no-undef -- URL is a browser global, not a runtime global in the lint env
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    },
    [photoUrl],
  );

  const openFilePicker = () => fileInputRef.current?.click();
  // eslint-disable-next-line no-undef -- HTMLInputElement is a TS DOM lib type, not a runtime global
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onPhotoSelect(file);
    e.target.value = '';
  };
  const myPhotoMeta = photoFile
    ? `${photoFile.name} · ${(photoFile.size / (1024 * 1024)).toFixed(1)}MB`
    : '아직 선택된 사진이 없어요';

  return (
    <div className="pb-15 min-h-[calc(100vh-74px)] px-6 pt-10">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-7 lg:grid-cols-[1fr_380px]">
        <div>
          <h1 className="m-0 text-2xl font-extrabold -tracking-[.6px]">
            내 사진을 올리고 합성을 시작하세요
          </h1>
          <p className="mt-2.5 text-sm text-ink-muted">
            원픽 배경과 내 사진을 나란히 확인한 뒤 합성을 요청할 수 있어요.
          </p>

          <div className="mt-[22px] rounded-[20px] border border-line bg-white p-[22px]">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="grid grid-cols-2 gap-[18px]">
              <Pane
                badge="원픽 배경"
                badgeTone="coral"
                meta={onePickName}
                placeholder="원픽 배경 사진"
                src={onePickPhoto}
              />
              <Pane
                badge="내 사진"
                badgeTone="brand"
                meta={myPhotoMeta}
                placeholder="내 사진을 끌어다 놓거나 클릭해서 선택하세요"
                src={photoUrl}
                onClick={openFilePicker}
                onDropFile={onPhotoSelect}
              />
            </div>
            <div className="mt-[18px] flex items-center gap-2 border-t border-line pt-[18px]">
              <button
                onClick={openFilePicker}
                className="flex h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-[13px] font-semibold text-ink-muted hover:border-brand hover:text-brand"
              >
                <ArrowUp size={16} strokeWidth={1.8} /> 사진 교체
              </button>
              <button
                onClick={() => onPhotoSelect(null)}
                disabled={!photoFile}
                className="flex h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-[13px] font-semibold text-ink-muted hover:border-coral hover:text-coral disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={16} strokeWidth={1.8} /> 삭제
              </button>
              <div className="flex-1" />
              <span className="text-xs text-ink-soft">
                JPG · PNG · 10MB 이하 · 얼굴이 정면으로 보이는 사진을 권장합니다
              </span>
            </div>
          </div>
        </div>

        <aside className="sticky top-[98px] rounded-[20px] border border-line bg-white p-6 shadow-panel">
          {phase === 'ready' && (
            <>
              <h2 className="m-0 text-lg font-extrabold -tracking-[.4px]">AI 사진 만들기</h2>
              <p className="mt-2 text-[13px] leading-[1.7] text-ink-muted">
                합성에는 약 30초가 걸려요. 아래 항목에 동의하면 시작할 수 있습니다.
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <Consent checked={agreeA} onToggle={onToggleA}>
                  사진이 AI 합성에 사용되는 것에 동의합니다.
                </Consent>
                <Consent checked={agreeB} onToggle={onToggleB}>
                  결과 이미지가 실제 장소와 다를 수 있음을 확인했습니다.
                </Consent>
              </div>
              <button
                onClick={onStart}
                disabled={!canGenerate}
                className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-bold text-white shadow-cta hover:bg-brand-dark disabled:bg-fill disabled:text-ink-soft disabled:shadow-none"
              >
                <Sparkles size={18} strokeWidth={1.8} /> AI 사진 만들기
              </button>
            </>
          )}

          {phase === 'running' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="m-0 text-lg font-extrabold -tracking-[.4px]">합성 중이에요</h2>
                <span className="flex items-center gap-1.5 rounded-full bg-brand-tint px-2.5 py-1 text-xs font-bold text-brand">
                  <Clock size={13} strokeWidth={2} /> 경과 {elapsed.toFixed(1)}초
                </span>
              </div>
              <p className="mt-2 text-[13px] text-ink-muted">창을 닫지 않고 기다려 주세요.</p>
              <ol className="mt-[22px] flex flex-col">
                {COMPOSE_STAGES.map((g, i) => (
                  <li key={g.label} className="flex gap-3.5">
                    <span className="flex w-[22px] shrink-0 flex-col items-center">
                      {i < stageIndex ? (
                        <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-ok text-white">
                          <Check size={13} strokeWidth={3} />
                        </span>
                      ) : i === stageIndex ? (
                        <span className="h-[22px] w-[22px] animate-spin rounded-full border-[2.5px] border-brand-tint border-t-brand" />
                      ) : (
                        <span className="h-[22px] w-[22px] rounded-full border-[1.5px] border-line bg-white" />
                      )}
                      {i < COMPOSE_STAGES.length - 1 && (
                        <span className="min-h-[26px] w-0.5 flex-1 bg-line" />
                      )}
                    </span>
                    <span className="pb-3.5">
                      <span className="block text-sm font-semibold text-ink">{g.label}</span>
                      <span className="mt-0.5 block text-xs text-ink-soft">{g.hint}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </>
          )}

          {phase === 'done' && (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ok text-white">
                <Check size={24} strokeWidth={2.6} />
              </span>
              <h2 className="mt-4 text-lg font-extrabold -tracking-[.4px]">합성이 완료되었어요</h2>
              <p className="mt-2 text-[13px] leading-[1.7] text-ink-muted">
                {onePickName} 배경에 내 사진을 합성했어요. 결과를 확인해 보세요.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-fill px-3.5 py-3 text-xs text-ink-muted">
                <Database size={13} strokeWidth={1.8} /> 총 소요 시간 {elapsed.toFixed(1)}초
              </div>
              <button
                onClick={onNext}
                className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-bold text-white shadow-cta hover:bg-brand-dark"
              >
                결과 확인하기 <ArrowRight size={18} strokeWidth={1.8} />
              </button>
              <button
                onClick={onReset}
                className="mt-2.5 flex h-[46px] w-full items-center justify-center gap-2 rounded-full border border-line bg-white text-sm font-semibold text-ink-muted hover:border-brand hover:text-brand"
              >
                <RotateCcw size={16} strokeWidth={1.8} /> 다시 만들기
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

type PaneProps = {
  badge: string;
  badgeTone: 'coral' | 'brand';
  meta: string;
  placeholder: string;
  src?: string;
  onClick?: () => void;
  // eslint-disable-next-line no-undef -- File is a TS DOM lib type, not a runtime global
  onDropFile?: (file: File) => void;
};

function Pane({ badge, badgeTone, meta, placeholder, src, onClick, onDropFile }: PaneProps) {
  // eslint-disable-next-line no-undef -- HTMLDivElement is a TS DOM lib type, not a runtime global
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (onDropFile) e.preventDefault();
  };
  // eslint-disable-next-line no-undef -- HTMLDivElement is a TS DOM lib type, not a runtime global
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    if (!onDropFile) return;
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onDropFile(file);
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeTone === 'coral' ? 'bg-coral-tint text-coral' : 'bg-brand-tint text-brand'}`}
        >
          {badge}
        </span>
        <span className="text-[13px] font-semibold text-ink-muted">{meta}</span>
      </div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={onClick}
        className={`relative aspect-[4/3] overflow-hidden rounded-xl bg-fill ${onClick ? 'cursor-pointer' : ''}`}
      >
        <ImageSlot src={src} placeholder={placeholder} />
      </div>
    </div>
  );
}

type ConsentProps = { checked: boolean; onToggle: () => void; children: ReactNode };

function Consent({ checked, onToggle, children }: ConsentProps) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-xl bg-fill p-3.5">
      <input type="checkbox" checked={checked} onChange={onToggle} className="peer sr-only" />
      <span
        className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${checked ? 'bg-brand text-white' : 'border-[1.5px] border-line bg-white'}`}
      >
        {checked && <Check size={13} strokeWidth={3} />}
      </span>
      <span className="text-[13px] font-medium leading-[1.6] text-ink">
        {children} <span className="font-normal text-ink-soft">(필수)</span>
      </span>
    </label>
  );
}
