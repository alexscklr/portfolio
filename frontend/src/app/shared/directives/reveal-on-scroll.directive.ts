import { Directive, ElementRef, OnDestroy, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true,
  host: { class: 'reveal-item' }
})
export class RevealOnScrollDirective implements OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;

    this.renderer.addClass(this.element.nativeElement, 'is-visible');
    this.observer.disconnect();
  }, { threshold: 0.12 });

  constructor() {
    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}