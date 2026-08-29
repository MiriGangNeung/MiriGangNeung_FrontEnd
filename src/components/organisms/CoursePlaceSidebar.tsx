import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Coffee,
  Landmark,
  Search,
  Utensils,
  X,
} from 'lucide-react';
import { Command } from 'cmdk';
import type { NearbyStopOption } from '../../lib/courseNearbyFilter';
import { COURSE_PLACE_CATEGORIES } from '../../lib/coursePlacePreferences';
import type {
  CoursePlaceMode,
  CourseStop,
  NearbyPlace,
  NearbyPlaceCategory,
  NearbyPlaceSort,
} from '../../types/domain';
import { NearbyPlaceCard } from './NearbyPlaceCard';
import type { KakaoPlacePreviewTarget } from './KakaoPlaceReviewButton';

type CoursePlaceSidebarProps = {
  courseStops: CourseStop[];
  nearbyCategory: NearbyPlaceCategory;
  nearbyScope: CoursePlaceMode;
  nearbyStopId: string;
  nearbyStopOptions: NearbyStopOption[];
  nearbySort: NearbyPlaceSort;
  nearbySearchRadiusMeters?: number | null;
  nearbyKeyword: string;
  keywordDraft: string;
  nearbyPlaces: NearbyPlace[];
  nearbyHasNextPage: boolean;
  nearbyIsFetchingNextPage: boolean;
  isNearbyLoading: boolean;
  nearbyError: string | null;
  actionError: string | null;
  selectedPlace: NearbyPlace | null;
  onClose: () => void;
  onNearbyScope: (scope: CoursePlaceMode) => void;
  onNearbyCategory: (category: NearbyPlaceCategory) => void;
  onNearbyStop: (stopId: string) => void;
  onNearbySort: (sort: NearbyPlaceSort) => void;
  onKeywordDraftChange: (keyword: string) => void;
  onNearbyKeyword: (keyword: string) => void;
  onNearbyLoadMore: () => void;
  onSelectPlace: (place: NearbyPlace) => void;
  onOpenPlaceDetails: (target: KakaoPlacePreviewTarget) => void;
  onConfirmPlace: () => void;
};

export function CoursePlaceSidebar({
  courseStops,
  nearbyCategory,
  nearbyScope,
  nearbyStopId,
  nearbyStopOptions,
  nearbySort,
  nearbySearchRadiusMeters = null,
  nearbyKeyword,
  keywordDraft,
  nearbyPlaces,
  nearbyHasNextPage,
  nearbyIsFetchingNextPage,
  isNearbyLoading,
  nearbyError,
  actionError,
  selectedPlace,
  onClose,
  onNearbyScope,
  onNearbyCategory,
  onNearbyStop,
  onNearbySort,
  onKeywordDraftChange,
  onNearbyKeyword,
  onNearbyLoadMore,
  onSelectPlace,
  onOpenPlaceDetails,
  onConfirmPlace,
}: CoursePlaceSidebarProps) {
  const selectedStopName =
    nearbyStopOptions.find((option) => option.id === nearbyStopId)?.name ?? '전체';

  return (
    <section
      data-course-place-adder
      role="region"
      aria-label="장소 추가"
      className="flex h-full min-h-0 flex-col rounded-2xl border border-brand/15 bg-white p-3 shadow-[0_8px_24px_rgba(16,24,40,.08)]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-base font-extrabold text-ink">장소 추가</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-full p-1.5 text-ink-muted transition hover:bg-fill hover:text-ink"
          aria-label="장소 추가 닫기"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-3 border-b border-line pb-1">
        <div className="grid grid-cols-4 gap-1" role="tablist" aria-label="장소 카테고리">
          {COURSE_PLACE_CATEGORIES.map((category) => {
            const Icon = getCategoryIcon(category.id);
            const selected = nearbyCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={selected}
                data-nearby-category={category.id}
                onClick={() => onNearbyCategory(category.id)}
                className={`relative inline-flex h-10 min-w-0 items-center justify-center gap-1 px-1 text-[11px] font-bold transition after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:transition ${selected ? 'text-brand after:bg-brand' : 'text-ink-muted after:bg-transparent hover:text-brand'}`}
              >
                <Icon size={14} />
                <span className="truncate">{category.label}</span>
              </button>
            );
          })}
        </div>

        {nearbyScope === 'nearby' ? (
          <div
            data-nearby-scope-panel
            role="group"
            aria-label="장소 탐색"
            className="mt-3 flex items-center justify-between gap-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              <span className="text-xs font-extrabold text-ink">주변 추천</span>
              <span className="truncate text-[10px] font-medium text-ink-muted">
                선택한 관광지 주변
              </span>
            </div>
            <button
              type="button"
              data-nearby-search-trigger
              aria-label="장소 검색"
              title="강릉 장소 검색"
              onClick={() => onNearbyScope('all')}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink-muted transition hover:border-brand/40 hover:bg-brand-tint hover:text-brand"
            >
              <Search size={15} />
            </button>
          </div>
        ) : null}
      </div>

      {nearbyScope === 'nearby' ? (
        <div className="mt-3 flex gap-1.5">
          <select
            id="nearby-stop-filter"
            aria-label="기준 관광지"
            value={nearbyStopId}
            onChange={(event) => onNearbyStop(event.target.value)}
            className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-white px-2.5 text-xs font-semibold text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
          >
            {nearbyStopOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <div
            className="flex h-9 shrink-0 rounded-lg bg-fill p-0.5"
            role="group"
            aria-label="주변 장소 정렬"
          >
            <button
              type="button"
              aria-pressed={nearbySort === 'recommended'}
              data-nearby-sort="recommended"
              onClick={() => onNearbySort('recommended')}
              className={`rounded-md px-2 text-[10px] font-bold ${nearbySort === 'recommended' ? 'bg-white text-brand shadow-sm' : 'text-ink-muted'}`}
            >
              추천순
            </button>
            <button
              type="button"
              aria-pressed={nearbySort === 'distance'}
              data-nearby-sort="distance"
              onClick={() => onNearbySort('distance')}
              className={`rounded-md px-2 text-[10px] font-bold ${nearbySort === 'distance' ? 'bg-white text-brand shadow-sm' : 'text-ink-muted'}`}
            >
              거리순
            </button>
          </div>
        </div>
      ) : nearbyScope === 'all' ? (
        <form
          data-place-search-command
          role="search"
          aria-label="강릉 장소 검색"
          className="mt-3 flex gap-1.5"
          onSubmit={(event) => {
            event.preventDefault();
            onNearbyKeyword(keywordDraft.trim());
          }}
        >
          <button
            type="button"
            data-place-search-back
            aria-label="주변 추천으로 돌아가기"
            onClick={() => onNearbyScope('nearby')}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-ink-muted transition hover:border-brand/40 hover:bg-brand-tint hover:text-brand"
          >
            <ArrowLeft size={16} />
          </button>
          <Command
            shouldFilter={false}
            label="강릉 장소 검색"
            className="min-w-0 flex-1 rounded-xl border border-line bg-white transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15"
          >
            <div className="flex h-10 items-center gap-2 px-2.5">
              <Search size={15} className="shrink-0 text-ink-muted" aria-hidden="true" />
              <Command.Input
                id="all-place-keyword"
                value={keywordDraft}
                onValueChange={onKeywordDraftChange}
                placeholder="강릉에서 장소명을 검색하세요"
                aria-label="강릉 장소 검색"
                className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-ink-muted"
              />
              {keywordDraft && (
                <button
                  type="button"
                  data-place-search-clear
                  aria-label="검색어 지우기"
                  onClick={() => {
                    onKeywordDraftChange('');
                    onNearbyKeyword('');
                  }}
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink-muted transition hover:bg-fill hover:text-ink"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <Command.List className="hidden" />
          </Command>
          <button
            type="submit"
            aria-label="검색"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition hover:bg-brand-dark"
          >
            <ArrowRight size={16} />
          </button>
        </form>
      ) : null}

      {nearbyScope === 'nearby' && nearbySearchRadiusMeters && nearbySearchRadiusMeters > 2_000 ? (
        <p
          data-nearby-radius-notice
          role="status"
          className="mt-2 rounded-lg bg-brand-tint px-2.5 py-1.5 text-[10px] font-semibold text-brand"
        >
          조건에 맞는 장소가 적어 {nearbySearchRadiusMeters / 1_000}km까지 자동으로 넓혔어요.
        </p>
      ) : null}

      <div className="mt-3 flex min-h-0 flex-1 flex-col">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-xs font-extrabold text-ink">
            {nearbyScope === 'nearby' ? '추천 장소' : '검색 결과'}
          </h3>
          {nearbyScope === 'nearby' && (
            <span className="truncate text-[10px] font-medium text-ink-muted">
              {selectedStopName} 주변
            </span>
          )}
          {nearbyScope === 'all' && nearbyKeyword && (
            <span className="truncate text-[10px] font-medium text-ink-muted">
              “{nearbyKeyword}” 검색 결과
            </span>
          )}
        </div>

        <div
          data-course-place-results
          className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5"
        >
          {isNearbyLoading && (
            <p className="rounded-lg bg-fill px-3 py-5 text-center text-xs font-semibold text-ink-muted">
              장소를 찾는 중...
            </p>
          )}
          {!isNearbyLoading && nearbyError && (
            <p className="rounded-lg bg-coral-tint px-3 py-5 text-center text-xs font-semibold text-coral">
              장소를 불러오지 못했어요.
            </p>
          )}
          {!isNearbyLoading && !nearbyError && nearbyPlaces.length === 0 && (
            <p className="rounded-lg bg-fill px-3 py-5 text-center text-xs font-semibold text-ink-muted">
              조건에 맞는 장소가 없어요.
            </p>
          )}
          {!isNearbyLoading &&
            !nearbyError &&
            nearbyPlaces.map((place) => (
              <NearbyPlaceCard
                key={place.externalPlaceId}
                place={place}
                alreadyAdded={courseStops.some(
                  (stop) => stop.externalPlaceId === place.externalPlaceId,
                )}
                selected={selectedPlace?.externalPlaceId === place.externalPlaceId}
                showDistance={nearbyScope === 'nearby'}
                onSelect={onSelectPlace}
                onOpenDetails={onOpenPlaceDetails}
              />
            ))}
        </div>

        {nearbyScope === 'all' && nearbyHasNextPage && (
          <button
            type="button"
            onClick={onNearbyLoadMore}
            disabled={nearbyIsFetchingNextPage}
            className="mt-2 h-8 shrink-0 rounded-lg border border-line text-[11px] font-bold text-brand hover:bg-brand-tint disabled:cursor-wait disabled:opacity-60"
          >
            {nearbyIsFetchingNextPage ? '불러오는 중...' : '더 불러오기'}
          </button>
        )}
      </div>

      {(actionError || (isNearbyLoading && nearbyScope === 'representative')) && (
        <p
          className="mt-2 rounded-lg bg-coral-tint px-2.5 py-2 text-[10px] font-semibold text-coral"
          role="alert"
        >
          {actionError ?? '강릉 대표 장소는 준비 중이에요.'}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
        <span className="min-w-0 truncate text-[10px] font-semibold text-ink-muted">
          {selectedPlace ? `${selectedPlace.name} 선택됨` : '장소를 선택하세요'}
        </span>
        <button
          type="button"
          disabled={!selectedPlace}
          onClick={onConfirmPlace}
          className="h-9 shrink-0 rounded-lg bg-brand px-3 text-xs font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-fill disabled:text-ink-muted"
        >
          코스에 추가
        </button>
      </div>
    </section>
  );
}

function getCategoryIcon(category: NearbyPlaceCategory) {
  switch (category) {
    case 'cafe':
      return Coffee;
    case 'restaurant':
      return Utensils;
    case 'culture':
      return Building2;
    case 'attraction':
      return Landmark;
  }
}
