type RadioOptionProps = {
  label: string;
  hint?: string;
  selected: boolean;
  onSelect: () => void;
};

/** Screen 5 radio card (companion / duration). */
export function RadioOption({ label, hint, selected, onSelect }: RadioOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={`flex items-center gap-3 rounded-xl p-4 text-left transition ${
        selected
          ? 'border-[1.5px] border-brand bg-brand-tint'
          : 'border border-line bg-white hover:border-brand'
      }`}
    >
      <span
        className={`h-5 w-5 shrink-0 rounded-full bg-white ${selected ? 'border-[6px] border-brand' : 'border-[1.5px] border-line'}`}
      />
      <span>
        <span
          className={`block text-[15px] ${selected ? 'font-bold text-ink' : 'font-semibold text-ink'}`}
        >
          {label}
        </span>
        {hint && (
          <span className={`mt-0.5 block text-xs ${selected ? 'text-ink-muted' : 'text-ink-soft'}`}>
            {hint}
          </span>
        )}
      </span>
    </button>
  );
}
