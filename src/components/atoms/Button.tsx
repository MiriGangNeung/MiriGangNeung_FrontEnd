import { type VariantProps, cva } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors disabled:opacity-45 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'h-[54px] px-7 text-base bg-brand text-white shadow-cta hover:bg-brand-dark',
        secondary:
          'h-[50px] px-5 text-[15px] font-semibold bg-white border border-line text-ink-muted hover:border-brand hover:text-brand',
        ghost: 'h-11 px-4 text-sm font-semibold bg-transparent text-ink-soft hover:text-brand',
        chip: 'h-[42px] shrink-0 whitespace-nowrap px-5 text-sm bg-white border border-line font-semibold text-ink-muted hover:border-brand hover:text-brand',
      },
      active: { true: '' },
    },
    compoundVariants: [
      {
        variant: 'chip',
        active: true,
        class: 'border-none bg-brand text-white shadow-[0_4px_12px_rgba(47,111,237,.28)]',
      },
    ],
    defaultVariants: { variant: 'primary' },
  },
);

// eslint-disable-next-line no-undef -- HTMLButtonElement is a TS DOM lib type, not a runtime global
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ variant, active, className, ...props }: ButtonProps) {
  return <button {...props} className={cn(buttonVariants({ variant, active }), className)} />;
}
