import { Directive, input, computed } from '@angular/core';
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Directive({
  selector: 'button[appButton]',
  standalone: true,
  host: {
    '[class]': 'computedClasses()',
  },
})
export class ButtonDirective {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');

  computedClasses = computed(() => {
    const base =
      'inline-flex items-center justify-center font-medium rounded-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-accent-primary-strong text-[var(--color-text-primary)] font-semibold hover:bg-accent-primary shadow-lg shadow-red-950/20 active:scale-95',
      accent:
        'bg-accent-secondary-strong text-[var(--color-text-primary)] font-semibold hover:bg-accent-secondary shadow-lg shadow-lime-950/10 active:scale-95',
      secondary:
        'bg-primary-900/80 text-slate-200 border border-secondary-700/60 hover:bg-secondary-800 hover:border-secondary-700 active:scale-95 backdrop-blur-sm',
      ghost: 'bg-transparent text-slate-300 hover:bg-primary-900 hover:text-white',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    const selectedVariant = this.variant() as ButtonVariant;
    const selectedSize = this.size() as ButtonSize;

    return `${base} ${variants[selectedVariant]} ${sizes[selectedSize]}`;
  });
}
