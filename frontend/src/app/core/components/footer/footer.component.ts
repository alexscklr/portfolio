import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileService } from '@/app/core/services/profile.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  profileService = inject(ProfileService);
  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.profileService.loadProfile();
  }
}