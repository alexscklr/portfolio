import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, input, viewChild } from '@angular/core';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';
import { Skill } from '@/app/core/models/skill.model';

@Component({
  selector: 'app-skill-marquee',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './skill-marquee.component.html',
  styleUrls: ['./skill-marquee.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SkillMarqueeComponent {
  readonly skills = input.required<Skill[]>();

  private readonly skillsSlider = viewChild.required<ElementRef<HTMLElement>>('skillsSlider');

  private static readonly COPY_COUNT = 4;
  readonly copies = Array.from({ length: SkillMarqueeComponent.COPY_COUNT }, (_, index) => index);

  private durationScale: number = 8;
  readonly scrollDuration = computed(() => this.skills().length * this.durationScale + 's');

  scrollToPosition(direction: 'left' | 'right') {
    const slider = this.skillsSlider().nativeElement;
    const scrollAmount = slider.offsetWidth * 0.8;

    // Keep the position within the second group so there is always content on both sides.
    const groupWidth = slider.scrollWidth / this.copies.length;
    slider.scrollTo({ left: groupWidth + (slider.scrollLeft % groupWidth), behavior: 'instant' });

    if (direction === 'left') {
      slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}
