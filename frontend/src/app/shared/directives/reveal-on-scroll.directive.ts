import {
  afterNextRender,
  Directive,
  ElementRef,
  HostBinding,
  OnDestroy,
  Renderer2,
  inject,
  input,
} from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true,
  host: { class: 'reveal-item' },
})
export class RevealOnScrollDirective implements OnDestroy {
  reveal = input('', {
    alias: 'appRevealOnScroll',
    transform: (value: string) => value || 'fade slide-up',
  });

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => {
      if (typeof IntersectionObserver !== 'function') {
        this.renderer.addClass(this.element.nativeElement, 'is-visible');
        return;
      }

      this.renderer.addClass(this.element.nativeElement, 'reveal-ready');
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;

          this.renderer.addClass(this.element.nativeElement, 'is-visible');
          this.observer?.disconnect();
        },
        { threshold: 0.12 },
      );
      this.observer.observe(this.element.nativeElement);
    });
  }

  @HostBinding('class.reveal-item')
  readonly revealItem = true;

  @HostBinding('attr.data-reveal')
  get revealAnimations(): string {
    return this.reveal();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
