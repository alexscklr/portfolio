import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';

@Component({
  selector: 'app-avatar-orbit',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './avatar-orbit.component.html',
  styleUrls: ['./avatar-orbit.component.scss']
})
export class AvatarOrbitComponent {}
