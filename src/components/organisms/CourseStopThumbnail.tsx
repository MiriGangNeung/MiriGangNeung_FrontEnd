import { ImageSlot } from '../atoms/ImageSlot';
import type { CourseStop } from '../../types/domain';

type CourseStopThumbnailProps = {
  stop: Pick<CourseStop, 'external' | 'name' | 'thumbnailUrl'>;
  isCompact?: boolean;
};

export function CourseStopThumbnail({ stop, isCompact = false }: CourseStopThumbnailProps) {
  if (stop.external) return null;

  return (
    <span
      className={`relative shrink-0 overflow-hidden bg-fill ${isCompact ? 'h-12 w-12 rounded-lg' : 'h-20 w-20 rounded-xl'}`}
    >
      <ImageSlot src={stop.thumbnailUrl} alt={stop.name} placeholder="사진" />
    </span>
  );
}
