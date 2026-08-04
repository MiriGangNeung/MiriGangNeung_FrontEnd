import type { KeyboardEvent } from 'react';
import type { Place } from '../../types/domain';
import { ImageSlot } from '../atoms/ImageSlot';
import { Tag } from '../atoms/Tag';
import { PLACE_PHOTOS } from '../../data/placePhotos';

type PlaceCardProps = {
  place: Place;
  picked: boolean;
  order: number;
  onToggle: () => void;
};

/** Screen 1 grid card: pick order badge, 4:3 photo, name/region/tags. */
export function PlaceCard({ place, picked, order, onToggle }: PlaceCardProps) {
  // eslint-disable-next-line no-undef -- HTMLDivElement is a TS DOM lib type, not a runtime global
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') onToggle();
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
        <ImageSlot src={PLACE_PHOTOS[place.id]} alt={place.name} placeholder="사진" />
        {picked && (
          <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[13px] font-bold text-white shadow-[0_2px_8px_rgba(16,24,40,.3)]">
            {order}
          </span>
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
