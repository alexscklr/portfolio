import { booleanAttribute, Directive, HostBinding, input } from '@angular/core';

export type LinkVariant = 'primary' | 'boxed' | 'secondary' | 'nav' | 'muted';

@Directive({
  selector: 'a[appLink]',
  standalone: true,
})
export class LinkDirective {
  variant = input<LinkVariant>('primary');

  isExternal = input(false, { transform: booleanAttribute });

  // Shows the ↗ arrow; always on for external links
  arrow = input(false, { transform: booleanAttribute });

  @HostBinding('class')
  get classes(): string {
    const baseClasses =
      'app-link inline-flex items-center gap-1 font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)]/50 rounded-sm';

    const variantClasses: Record<LinkVariant, string> = {
      primary:
        'text-accent-primary hover:text-accent-primary underline underline-offset-4 decoration-accent-primary/40 hover:decoration-accent-primary',

      boxed: 'border border-[var(--text-color-primary)] text-[var(--text-color-primary)] px-2 py-1 rounded-sm hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]',

      secondary:
        'text-slate-300 hover:text-white underline underline-offset-4 decoration-slate-600 hover:decoration-slate-300',

      nav: 'text-slate-300 hover:text-white py-1 px-2',

      muted: 'text-slate-400 hover:text-accent-primary font-mono text-xs',
    };

    const selectedVariant = this.variant() in variantClasses ? this.variant() : 'primary';

    const externalClass = this.isExternal() ? ' app-link--external' : '';
    const arrowClass = this.isExternal() || this.arrow() ? ' app-link--arrow' : '';

    return `${baseClasses} app-link--${selectedVariant}${externalClass}${arrowClass} ${variantClasses[selectedVariant]}`;
  }

  @HostBinding('attr.target')
  get target(): string | null {
    return this.isExternal() ? '_blank' : null;
  }

  @HostBinding('attr.rel')
  get rel(): string | null {
    return this.isExternal() ? 'noopener noreferrer' : null;
  }
}
