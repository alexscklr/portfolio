import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileService } from '@/app/core/services/profile.service';
import { LinkDirective } from '@/app/shared/directives/link.directive';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LinkDirective, TranslatePipe],
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  profileService = inject(ProfileService);
  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.profileService.loadProfile();
  }
}