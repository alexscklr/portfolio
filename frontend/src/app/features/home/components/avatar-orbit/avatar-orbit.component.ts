import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';
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
  readonly sociallinks = input.required<SocialLink[]>();
  readonly avatarurl = input.required<string>();

  iconFor(link: SocialLink): string {
    const key = link.iconKey?.trim();
    if (!key) return 'lucide:code-2';
    return key.includes(':') ? key : `simple-icons:${key}`;
  }
}
