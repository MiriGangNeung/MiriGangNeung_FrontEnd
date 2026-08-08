import { Clock, MapPin, Plus, Search, Sparkles, Star, X } from 'lucide-react';
import { useState } from 'react';
import { CourseMap } from './CourseMap';
import { ImageSlot } from '../atoms/ImageSlot';
import { CROWD_LABEL, COMPANIONS, DURATIONS, TRIP_TYPES, findPlace } from '../../data/places';
import { searchPlaces } from '../../lib/coursePlaceAddition';
import type { CourseStop, Place } from '../../types/domain';

type CourseResultProps = {
  courseStops: CourseStop[];
  mapStops: CourseStop[];
  places: Place[];
  onePick: string;
  types: string[];
  companion: string;
  duration: string;
  activeStop: number;
  onActiveStop: (index: number) => void;
  onPreviewPlace: (place: Place | null) => void;
  onAddPlace: (place: Place) => void;
  onBack: () => void;
};

/** Screen 6 — itinerary list (left, scrolls) synced with the real map (right). */
export function CourseResult({
  courseStops,
  mapStops,
  places,
  onePick,
  types,
  companion,
  duration,
  activeStop,
  onActiveStop,
  onPreviewPlace,
  onAddPlace,
  onBack,
}: CourseResultProps) {
  const [isPlaceAdderOpen, setIsPlaceAdderOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const tags = [
    `원픽 ${findPlace(onePick).name}`,
    TRIP_TYPES.filter((t) => types.includes(t.id))
      .map((t) => t.label)
      .join(' · '),
    COMPANIONS.find((c) => c.id === companion)?.label,
    DURATIONS.find((d) => d.id === duration)?.label,
    '이동 42km',
  ].filter(Boolean);
  const searchResults = searchPlaces(places, query);

  function closePlaceAdder() {
    setIsPlaceAdderOpen(false);
    setQuery('');
    setSelectedPlace(null);
    onPreviewPlace(null);
  }

  function selectPlace(place: Place) {
    if (courseStops.some((stop) => stop.id === place.id)) return;

    setSelectedPlace(place);
    onPreviewPlace(place);
  }

  function confirmPlace() {
    if (!selectedPlace) return;

    onAddPlace(selectedPlace);
    closePlaceAdder();
  }

  return (
    <div className="grid min-h-[calc(100vh-74px)] grid-cols-1 lg:h-[calc(100vh-74px)] lg:grid-cols-[minmax(420px,40fr)_60fr]">
      <div className="pb-30 overflow-y-auto border-r border-line bg-canvas px-[26px] pt-[26px]">
        <h1 className="m-0 text-[22px] font-extrabold -tracking-[.6px]">나만의 강릉 코스</h1>
        <p className="mt-2 text-[13px] text-ink-soft">
          2026. 8. 8 · 당일 · 총 {courseStops.length}곳 · 이동 42km
        </p>
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
          {tags.map((t) => (
            <span
              key={t}
              className="shrink-0 whitespace-nowrap rounded-full bg-brand-tint px-3 py-1.5 text-xs font-semibold text-brand"
            >
              {t}
            </span>
          ))}
        </div>

        {isPlaceAdderOpen && (
          <section
            className="mt-5 rounded-2xl border border-brand/20 bg-white p-4 shadow-[0_10px_28px_rgba(47,111,237,.12)]"
            aria-label="장소 추가"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-bold">새 장소 찾기</h2>
                <p className="mt-1 text-xs text-ink-soft">
                  선택하면 오른쪽 지도에서 먼저 확인할 수 있어요.
                </p>
              </div>
              <button
                type="button"
                onClick={closePlaceAdder}
                className="rounded-full p-1.5 text-ink-muted hover:bg-fill hover:text-ink"
                aria-label="장소 추가 닫기"
              >
                <X size={17} />
              </button>
            </div>

            <label className="relative mt-4 block">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <span className="sr-only">장소 검색</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="장소명, 지역, 태그로 검색"
                className="h-11 w-full rounded-xl border border-line bg-canvas pl-9 pr-3 text-sm outline-none placeholder:text-ink-muted focus:border-brand focus:ring-4 focus:ring-brand/10"
              />
            </label>

            <div className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
              {searchResults.length === 0 ? (
                <p className="rounded-xl bg-fill px-3 py-5 text-center text-sm text-ink-muted">
                  검색 결과가 없어요.
                </p>
              ) : (
                searchResults.map((place) => {
                  const alreadyAdded = courseStops.some((stop) => stop.id === place.id);
                  const selected = selectedPlace?.id === place.id;
                  return (
                    <button
                      key={place.id}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => selectPlace(place)}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        selected
                          ? 'border-brand bg-brand-tint ring-2 ring-brand/10'
                          : 'border-line bg-white hover:border-brand/50 hover:bg-brand-tint/40'
                      } ${alreadyAdded ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-ink">{place.name}</span>
                        {alreadyAdded && (
                          <span className="text-[11px] font-semibold text-ink-muted">
                            이미 코스에 있어요
                          </span>
                        )}
                        {selected && (
                          <span className="text-[11px] font-bold text-brand">지도에서 확인 중</span>
                        )}
                      </span>
                      <span className="mt-1 block text-xs text-ink-soft">{place.region}</span>
                      <span className="mt-2 flex flex-wrap gap-1">
                        {place.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-fill px-2 py-0.5 text-[10px] font-medium text-ink-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={closePlaceAdder}
                className="h-10 flex-1 rounded-xl border border-line text-sm font-semibold text-ink-muted hover:bg-fill"
              >
                취소
              </button>
              <button
                type="button"
                disabled={!selectedPlace}
                onClick={confirmPlace}
                className="h-10 flex-1 rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-muted"
              >
                코스에 추가
              </button>
            </div>
          </section>
        )}

        <ol className="mt-[22px]">
          {courseStops.map((s, i) => {
            const active = activeStop === i;
            const crowd = CROWD_LABEL[s.crowd];
            return (
              <li key={s.id} className="flex gap-3.5">
                <span className="flex w-[30px] shrink-0 flex-col items-center">
                  <span
                    className={`flex h-[30px] w-[30px] items-center justify-center rounded-full text-sm font-bold ${
                      active
                        ? 'bg-brand-dark text-white ring-[5px] ring-brand/15'
                        : 'border-[1.5px] border-line bg-white text-ink-muted'
                    }`}
                  >
                    {s.n}
                  </span>
                  {i < courseStops.length - 1 && (
                    <span className="my-1.5 min-h-[34px] flex-1 border-l-2 border-dashed border-line-dashed" />
                  )}
                </span>

                <button
                  onClick={() => onActiveStop(i)}
                  className="relative mb-3.5 flex flex-1 gap-3.5 rounded-2xl border border-line bg-white p-4 text-left transition hover:shadow-[0_8px_22px_rgba(16,24,40,.1)]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-brand">{s.time}</span>
                      {s.onePick && (
                        <span className="flex items-center gap-1 rounded-full bg-coral-tint px-2 py-0.5 text-[11px] font-bold text-coral">
                          <Star size={10} className="fill-current" /> 원픽
                        </span>
                      )}
                    </span>
                    <span className="mt-1.5 block text-base font-bold -tracking-[.3px]">
                      {s.name}
                    </span>
                    <span className="mt-1.5 block text-xs leading-[1.6] text-ink-soft">
                      {s.note}
                    </span>
                    <span className="mt-2.5 flex items-center gap-1.5">
                      <span className="flex items-center gap-1 rounded-full bg-fill px-2 py-1 text-[11px] font-semibold text-ink-muted">
                        <Clock size={12} strokeWidth={2} /> {s.stay}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-bold ${crowd.className}`}
                      >
                        {crowd.text}
                      </span>
                    </span>
                  </span>
                  <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-fill">
                    <ImageSlot placeholder="사진" />
                  </span>
                  {active && (
                    <span className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-brand" />
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={() => setIsPlaceAdderOpen(true)}
          className="ml-11 flex h-[52px] w-[calc(100%-44px)] items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-line-dashed bg-white text-sm font-semibold text-ink-muted hover:border-brand hover:text-brand"
        >
          <Plus size={17} strokeWidth={1.8} /> 새로운 장소 추가
        </button>
      </div>

      <div className="relative h-[420px] bg-slot lg:h-full">
        <CourseMap courseStops={mapStops} activeIndex={activeStop} onSelect={onActiveStop} />
        <div className="pointer-events-none absolute left-[18px] top-[18px] z-[500] flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2.5 text-xs font-semibold text-ink-muted shadow-[0_4px_14px_rgba(16,24,40,.12)]">
          <MapPin size={15} strokeWidth={1.8} className="text-brand" /> 왼쪽 카드를 누르면 지도가
          이동해요
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 z-[700] flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-white p-3.5 shadow-[0_10px_30px_rgba(16,24,40,.16)]">
        <button
          onClick={onBack}
          className="h-11 rounded-full px-[18px] text-sm font-semibold text-ink-muted hover:text-brand"
        >
          다른 코스 보기
        </button>
        <button className="flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[15px] font-bold text-white shadow-cta hover:bg-brand-dark">
          <Sparkles size={18} strokeWidth={1.8} /> 스토리 카드 만들기
        </button>
        <button className="h-11 rounded-full px-[18px] text-sm font-semibold text-ink-muted hover:text-brand">
          코스 저장 · 공유
        </button>
      </div>
    </div>
  );
}
