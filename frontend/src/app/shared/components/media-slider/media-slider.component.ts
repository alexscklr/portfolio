import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProjectMedia } from '@/app/core/models';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';

export interface MediaSlide {
  id: string;
  url: string;
  posterUrl?: string;
  alt: string;
  isVideo: boolean;
}

@Component({
  selector: 'app-media-slider',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './media-slider.component.html',
})
export class MediaSliderComponent {
  readonly media = input<readonly ProjectMedia[]>([]);
  readonly fallbackUrl = input<string>();
  readonly label = input.required<string>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');

  protected readonly activeIndex = signal(0);
  private readonly isVisible = signal(false);
  protected readonly prefersReducedMotion = signal(false);

  protected readonly slides = computed<MediaSlide[]>(() => {
    const items = this.media();
    if (items.length > 0) {
      return items.map(item => ({
        id: item.id,
        url: item.fileUrl,
        posterUrl: item.posterUrl,
        alt: item.altText ?? this.label(),
        isVideo: item.contentType.startsWith('video/'),
      }));
    }

    const fallback = this.fallbackUrl();
    return fallback ? [{ id: 'fallback', url: fallback, alt: this.label(), isVideo: false }] : [];
  });
  protected readonly hasMultipleSlides = computed(() => this.slides().length > 1);
  protected readonly canGoPrevious = computed(() => this.activeIndex() > 0);
  protected readonly canGoNext = computed(() => this.activeIndex() < this.slides().length - 1);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (typeof matchMedia === 'function') {
        this.prefersReducedMotion.set(matchMedia('(prefers-reduced-motion: reduce)').matches);
      }

      if (typeof IntersectionObserver !== 'function') {
        this.isVisible.set(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => this.isVisible.set(entry.isIntersecting),
        {
          threshold: 0.4,
        },
      );
      observer.observe(this.host.nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
    });

    // Only the visible slide plays; with reduced motion the user starts videos via controls.
    effect(() => {
      if (!this.isBrowser) return;

      const active = this.activeIndex();
      const shouldPlay = this.isVisible() && !this.prefersReducedMotion();
      const videos =
        this.host.nativeElement.querySelectorAll<HTMLVideoElement>('video[data-index]');

      videos.forEach(video => {
        if (shouldPlay && Number(video.dataset['index']) === active) {
          void video.play()?.catch(() => undefined);
        } else {
          video.pause();
        }
      });
    });
  }

  protected onScroll(): void {
    const element = this.track()?.nativeElement;
    if (!element || element.clientWidth === 0) return;

    const index = Math.round(element.scrollLeft / element.clientWidth);
    this.activeIndex.set(Math.min(Math.max(index, 0), this.slides().length - 1));
  }

  protected onArrowKey(event: Event, step: -1 | 1): void {
    event.preventDefault();
    this.goTo(this.activeIndex() + step);
  }

  protected previous(): void {
    this.goTo(this.activeIndex() - 1);
  }

  protected next(): void {
    this.goTo(this.activeIndex() + 1);
  }

  protected goTo(index: number): void {
    const element = this.track()?.nativeElement;
    if (!element || index < 0 || index >= this.slides().length) return;

    this.activeIndex.set(index);
    element.scrollTo({
      left: index * element.clientWidth,
      behavior: this.prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }
}
