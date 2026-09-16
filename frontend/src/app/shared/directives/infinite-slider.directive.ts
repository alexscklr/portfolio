import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appInfiniteSlider]',
  standalone: true
})
export class InfiniteSliderDirective implements OnInit, OnDestroy {
  @Input() slideWidth = 300;
  @Input() slideHeight = 200;
  @Input() speed = 40;
  @Input() autoPlay = true;

  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly document = inject(DOCUMENT);
  private track: HTMLElement | null = null;
  private originalSlides: HTMLElement[] = [];
  private isDragging = false;
  private startX = 0;
  private position = 0;
  private slideGroupWidth = 0;
  private lastTimestamp = 0;
  private pointerId: number | null = null;
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private isVisible = true;
  private positionAtDragStart = 0;

  ngOnInit() {
    this.initSlider();
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
  }

  private initSlider() {
    const slider = this.element;
    this.originalSlides = Array.from(slider.children) as HTMLElement[];

    if (this.originalSlides.length === 0) return;

    const computedStyle = getComputedStyle(slider);
    const track = this.document.createElement('div');
    const gap = computedStyle.columnGap || computedStyle.gap;

    track.className = 'infinite-slider-track';
    track.style.display = 'flex';
    track.style.width = 'max-content';
    track.style.gap = gap;
    track.style.willChange = 'transform';

    const leadingClones = this.originalSlides.map(slide => this.createClone(slide));
    const trailingClones = this.originalSlides.map(slide => this.createClone(slide));

    this.originalSlides.forEach(slide => this.styleSlide(slide));
    track.append(...leadingClones, ...this.originalSlides, ...trailingClones);
    slider.replaceChildren(track);
    slider.style.display = 'block';
    slider.style.overflow = 'hidden';
    slider.style.position = 'relative';
    slider.style.touchAction = 'pan-y';

    this.track = track;
    this.measureTrack();

    this.resizeObserver = new ResizeObserver(() => this.measureTrack());
    this.resizeObserver.observe(slider);

    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(([entry]) => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible) this.startAutoPlay();
        else this.stopAutoPlay();
      });
      this.intersectionObserver.observe(slider);
    }
  }

  private styleSlide(slide: HTMLElement): void {
    slide.style.width = `${this.slideWidth}px`;
    slide.style.height = `${this.slideHeight}px`;
    slide.style.flexShrink = '0';
    slide.style.position = 'relative';
  }

  private createClone(slide: HTMLElement): HTMLElement {
    const clone = slide.cloneNode(true) as HTMLElement;
    clone.setAttribute('aria-hidden', 'true');
    this.styleSlide(clone);
    return clone;
  }

  private measureTrack() {
    if (!this.track || this.originalSlides.length === 0) return;

    const previousGroupWidth = this.slideGroupWidth;
    const firstOriginalSlide = this.originalSlides[0];
    const firstTrailingClone = this.track.children[this.originalSlides.length * 2] as HTMLElement;
    this.slideGroupWidth = firstTrailingClone.offsetLeft - firstOriginalSlide.offsetLeft;

    if (this.slideGroupWidth === 0) return;

    this.position = previousGroupWidth === 0
      ? this.slideGroupWidth
      : (this.position / previousGroupWidth) * this.slideGroupWidth;
    this.normalizePosition();
    this.render();
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    this.isDragging = true;
    this.pointerId = event.pointerId;
    this.startX = event.clientX;
    this.positionAtDragStart = this.position;
    this.element.setPointerCapture(event.pointerId);
    this.stopAutoPlay();
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    if (!this.isDragging || event.pointerId !== this.pointerId) return;

    event.preventDefault();
    this.position = this.positionAtDragStart - (event.clientX - this.startX);
    this.normalizePosition();
    this.render();
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(event: PointerEvent) {
    if (event.pointerId !== this.pointerId) return;

    this.isDragging = false;
    this.pointerId = null;
    this.releasePointer(event.pointerId);
    this.startAutoPlay();
  }

  @HostListener('pointercancel', ['$event'])
  onPointerCancel(event: PointerEvent) {
    if (event.pointerId !== this.pointerId) return;

    this.isDragging = false;
    this.pointerId = null;
    this.releasePointer(event.pointerId);
    this.startAutoPlay();
  }

  private releasePointer(pointerId: number): void {
    if (this.element.hasPointerCapture(pointerId)) {
      this.element.releasePointerCapture(pointerId);
    }
  }

  private startAutoPlay() {
    if (!this.autoPlay || !this.isVisible || this.slideGroupWidth === 0 || this.animationFrameId !== null) return;

    this.lastTimestamp = 0;
    const animate = (timestamp: number) => {
      if (this.lastTimestamp !== 0) {
        const elapsedSeconds = Math.min(timestamp - this.lastTimestamp, 100) / 1000;
        this.position += this.speed * elapsedSeconds;
        this.normalizePosition();
        this.render();
      }
      this.lastTimestamp = timestamp;
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private stopAutoPlay() {
    if (this.animationFrameId === null) return;

    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
    this.lastTimestamp = 0;
  }

  private normalizePosition() {
    if (this.slideGroupWidth === 0) return;

    while (this.position >= this.slideGroupWidth * 2) this.position -= this.slideGroupWidth;
    while (this.position < 0) this.position += this.slideGroupWidth;
  }

  private render() {
    if (this.track) {
      this.track.style.transform = `translate3d(${-this.position}px, 0, 0)`;
    }
  }
}
