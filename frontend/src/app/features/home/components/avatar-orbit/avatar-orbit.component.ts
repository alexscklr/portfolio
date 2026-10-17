import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';
import { LanguageService } from '@/app/core/services/language.service';
import { SocialLink} from '@/app/core/models/profile.model';

@Component({
  selector: 'app-avatar-orbit',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './avatar-orbit.component.html',
  styleUrls: ['./avatar-orbit.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AvatarOrbitComponent {
  readonly languageService = inject(LanguageService);
  readonly sociallinks = input.required<SocialLink[]>();
  readonly avatarurl = input.required<string>();

  iconFor(link: SocialLink): string {
    const key = link.iconKey?.trim();
    if (!key) return 'lucide:code-2';
    return key.includes(':') ? key : `simple-icons:${key}`;
  }
}
