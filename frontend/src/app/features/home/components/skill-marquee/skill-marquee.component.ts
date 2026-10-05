import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from "@angular/core";
import { TranslatePipe } from "@/app/shared/pipes/translate.pipe";
import { Skill } from "@/app/core/models/skill.model";

@Component({
  selector: 'app-skill-marquee',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './skill-marquee.component.html',
  styleUrls: ['./skill-marquee.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SkillMarqueeComponent {
  readonly skills = input.required<Skill[]>();
}