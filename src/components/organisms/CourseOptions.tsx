import { ArrowRight, Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { ImageSlot } from '../atoms/ImageSlot';
import { RadioOption } from '../molecules/RadioOption';
import { COMPANIONS, DURATIONS, TRIP_TYPES, TRIP_TYPE_DETAILS } from '../../data/places';
import { findPlaceById } from '../../lib/placeLookup';
import type { Place } from '../../types/domain';

type CourseOptionsProps = {
  places: Place[];
  picks: string[];
  onePick: string;
  types: string[];
  detailTypes: string[];
  companion: string;
  duration: string;
  startDate: string;
  endDate: string;
  onToggleType: (id: string) => void;
  onToggleDetailType: (id: string) => void;
  onCompanion: (id: string) => void;
  onDuration: (id: string) => void;
  onStartDate: (value: string) => void;
  onEndDate: (value: string) => void;
  onNext: () => void | Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
};

/** Screen 5 — trip conditions (types / companion / duration) with a live summary panel. */
export function CourseOptions({
  places,
  picks,
  onePick,
  types,
  detailTypes,
  companion,
  duration,
  startDate,
  endDate,
  onToggleType,
  onToggleDetailType,
  onCompanion,
  onDuration,
  onStartDate,
  onEndDate,
  onNext,
  isSubmitting = false,
  error = null,
}: CourseOptionsProps) {
  const onePickPlace = findPlaceById(places, onePick);
  const typeNames = TRIP_TYPES.filter((t) => types.includes(t.id))
    .map((t) => t.label)
    .join(' · ');
  const selectedTypesWithDetails = TRIP_TYPES.filter((type) => types.includes(type.id))
    .map((type) => ({ type, details: TRIP_TYPE_DETAILS[type.id] ?? [] }))
    .filter(({ details }) => details.length > 0);
  const companionName = COMPANIONS.find((c) => c.id === companion)?.label ?? '';
  const durationName =
    duration === 'custom'
      ? `${startDate} ~ ${endDate}`
      : DURATIONS.find((d) => d.id === duration)?.label;

  const summary = [
    {
      k: '장소',
      v: `${onePickPlace?.name ?? '선택한 장소'} (원픽) 외 ${Math.max(0, picks.length - 1)}곳`,
    },
    { k: '여행 타입', v: typeNames },
    { k: '동행', v: companionName },
    { k: '기간', v: durationName },
  ];

  return (
    <div className="min-h-[calc(100vh-74px)] px-6 pb-[70px] pt-10">
      <div className="mx-auto max-w-[1120px]">
        <h1 className="m-0 text-[26px] font-extrabold -tracking-[.7px]">
          어떤 강릉 여행을 원하세요?
        </h1>
        <p className="mt-2.5 text-sm text-ink-muted">
          원하는 분위기와 동행 정보를 알려주시면 맞춤 코스를 만들어 드릴게요.
        </p>

        <div className="mt-[26px] grid grid-cols-1 items-start gap-[26px] lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-[18px]">
            <Section
              title="코스에 포함될 장소"
              hint="원픽 장소는 반드시 포함되며, 후보는 우선 반영됩니다."
            >
              <div className="grid grid-cols-3 gap-3.5">
                {picks.map((id) => {
                  const p = findPlaceById(places, id);
                  if (!p) return null;
                  const isOnePick = id === onePick;
                  return (
                    <div
                      key={id}
                      className="overflow-hidden rounded-xl border border-line bg-white"
                    >
                      <div className="relative aspect-[4/3] bg-fill">
                        <ImageSlot src={p.thumbnailUrl} alt={p.name} placeholder="사진" />
                      </div>
                      <div className="px-3 pb-3 pt-2.5">
                        <div className="truncate text-[13px] font-bold">{p.name}</div>
                        <span
                          className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${isOnePick ? 'bg-coral-tint text-coral' : 'bg-fill text-ink-soft'}`}
                        >
                          {isOnePick ? '원픽' : '후보'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="여행 타입" inlineHint="최소 1개 선택">
              <div
                data-trip-type-options
                className="rounded-2xl border border-line bg-canvas p-1.5"
              >
                <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4">
                  {TRIP_TYPES.map((t) => {
                    const on = types.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onToggleType(t.id)}
                        className={
                          on
                            ? 'flex h-11 items-center justify-center gap-1.5 rounded-xl bg-brand px-2 text-sm font-bold text-white shadow-sm'
                            : 'flex h-11 items-center justify-center gap-1.5 rounded-xl bg-white px-2 text-sm font-semibold text-ink-muted transition hover:text-brand'
                        }
                      >
                        {t.label} {on && <Check size={15} strokeWidth={2.4} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedTypesWithDetails.length > 0 && (
                <div
                  data-trip-type-details
                  className="mt-3 rounded-2xl border border-brand/15 bg-brand-tint/45 px-4 py-3.5"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-extrabold text-ink">세부 취향</span>
                    <span className="text-xs text-ink-soft">선택한 여행 타입별로 골라보세요</span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {selectedTypesWithDetails.map(({ type, details }) => (
                      <div
                        key={type.id}
                        data-trip-type-detail-group={type.id}
                        className="flex flex-col gap-2 sm:flex-row sm:items-center"
                      >
                        <span className="shrink-0 text-xs font-extrabold text-brand sm:w-[76px]">
                          {type.label}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {details.map((detail) => {
                            const selected = detailTypes.includes(detail.id);
                            return (
                              <button
                                key={detail.id}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => onToggleDetailType(detail.id)}
                                className={
                                  selected
                                    ? 'rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white'
                                    : 'rounded-full border border-brand/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink-muted transition hover:border-brand hover:text-brand'
                                }
                              >
                                {detail.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            <Section title="동행 유형">
              <div className="grid grid-cols-2 gap-3">
                {COMPANIONS.map((c) => (
                  <RadioOption
                    key={c.id}
                    label={c.label}
                    hint={c.hint}
                    selected={companion === c.id}
                    onSelect={() => onCompanion(c.id)}
                  />
                ))}
              </div>
            </Section>

            <Section title="여행 기간">
              <div className="flex flex-col gap-2.5">
                {DURATIONS.map((d) => (
                  <RadioOption
                    key={d.id}
                    label={d.label}
                    selected={duration === d.id}
                    onSelect={() => onDuration(d.id)}
                  />
                ))}
                {duration === 'custom' && (
                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-fill p-[18px]">
                    <Field label="시작일" value={startDate} onChange={onStartDate} />
                    <Field label="종료일" value={endDate} onChange={onEndDate} />
                  </div>
                )}
              </div>
            </Section>
          </div>

          <aside className="sticky top-[98px] rounded-[20px] border border-line bg-white p-6 shadow-panel">
            <h2 className="m-0 text-base font-extrabold">선택한 조건</h2>
            <dl className="mt-[18px] flex flex-col">
              {summary.map((r) => (
                <div key={r.k} className="flex gap-3 border-b border-line pb-4 pt-4 first:pt-0">
                  <dt className="w-16 shrink-0 pt-0.5 text-xs font-semibold text-ink-soft">
                    {r.k}
                  </dt>
                  <dd className="m-0 text-sm font-semibold leading-[1.6] text-ink">{r.v}</dd>
                </div>
              ))}
            </dl>
            <button
              onClick={() => void onNext()}
              disabled={isSubmitting}
              className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-bold text-white shadow-cta hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? '코스를 만드는 중...' : '선택한 조건 확인하기'}
              {!isSubmitting && <ArrowRight size={18} strokeWidth={1.8} />}
            </button>
            {error && <p className="mt-3 text-xs font-semibold text-coral">{error}</p>}
            <p className="mt-3 text-xs leading-[1.6] text-ink-soft">
              조건은 코스 생성 후에도 다시 수정할 수 있어요.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

type SectionProps = { title: string; hint?: string; inlineHint?: string; children: ReactNode };

function Section({ title, hint, inlineHint, children }: SectionProps) {
  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <div className="flex items-baseline gap-2.5">
        <h2 className="m-0 text-base font-bold">{title}</h2>
        {inlineHint && <span className="text-xs text-ink-soft">{inlineHint}</span>}
      </div>
      {hint && <p className="mt-1.5 text-[13px] text-ink-soft">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

type FieldProps = { label: string; value: string; onChange: (value: string) => void };

function Field({ label, value, onChange }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink-muted">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink"
      />
    </label>
  );
}
