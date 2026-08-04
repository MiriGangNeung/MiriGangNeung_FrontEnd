type ImageSlotProps = {
  src?: string;
  alt?: string;
  placeholder?: string;
  className?: string;
};

/**
 * Placeholder for a photograph. In the prototype this was a drag-and-drop slot;
 * in production replace with your <Image> component / CDN URL.
 */
export function ImageSlot({ src, alt = '', placeholder = '사진', className = '' }: ImageSlotProps) {
  if (src) return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />;
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-slot text-xs font-medium text-ink-soft ${className}`}
    >
      {placeholder}
    </div>
  );
}
