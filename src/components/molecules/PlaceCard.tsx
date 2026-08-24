import type { KeyboardEvent, MouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Place } from '../../types/domain';
import { getNextPlaceImageIndex, getPlaceImageSelection } from '../../lib/placeImages';
import { ImageSlot } from '../atoms/ImageSlot';
import { Tag } from '../atoms/Tag';

type PlaceCardProps = {
  place: Place;
  picked: boolean;
  order: number;
  imageIndex: number;
  onImageIndexChange: (imageIndex: number) => void;
  onToggle: () => void;
};

/** Screen 1 grid card: pick order badge, 4:3 photo, name/region/tags. */
export function PlaceCard({
  place,
  picked,
  order,
  imageIndex,
  onImageIndexChange,
  onToggle,
}: PlaceCardProps) {
  const selection = getPlaceImageSelection(place, imageIndex);
  const hasCarousel = selection.totalImages > 1;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') onToggle();
  };

  const handleImageChange = (e: MouseEvent, direction: number) => {
    e.stopPropagation();
    onImageIndexChange(
      getNextPlaceImageIndex(selection.imageIndex, direction, selection.totalImages),
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      className="relative cursor-pointer overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] bg-fill">
        <ImageSlot
          src={selection.imageUrl}
          alt={`${place.name} 사진 ${selection.imageIndex + 1}`}
          placeholder="사진"
        />
        {picked && (
          <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[13px] font-bold text-white shadow-[0_2px_8px_rgba(16,24,40,.3)]">
            {order}
          </span>
        )}
        {hasCarousel && (
          <>
            <button
              type="button"
              aria-label={`${place.name} 이전 사진`}
              onClick={(e) => handleImageChange(e, -1)}
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
            >
              <ChevronLeft size={18} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              aria-label={`${place.name} 다음 사진`}
              onClick={(e) => handleImageChange(e, 1)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
            >
              <ChevronRight size={18} strokeWidth={2.2} />
            </button>
            <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-1 text-[11px] font-semibold text-white">
              {selection.imageIndex + 1} / {selection.totalImages}
            </span>
          </>
        )}
      </div>
      <div className="px-4 pb-4 pt-3.5">
        <div className="text-[17px] font-bold -tracking-[.4px]">{place.name}</div>
        <div className="mt-1 text-[13px] text-ink-soft">{place.region}</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {place.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>
      {picked && (
        <span className="pointer-events-none absolute inset-0 rounded-2xl border-[2.5px] border-brand" />
      )}
    </div>
  );
}
