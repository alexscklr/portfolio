import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectService } from '@/app/core/services/project.service';
import { ProjectCardComponent } from '@/app/shared/components/project-card/project-card.component';
import { ButtonDirective } from '@/app/shared/directives/button.directive';
import { RevealOnScrollDirective } from '@/app/shared/directives/reveal-on-scroll.directive';
import { AvatarOrbitComponent } from './components/avatar-orbit/avatar-orbit.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProjectCardComponent, ButtonDirective, RevealOnScrollDirective, AvatarOrbitComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  projectService = inject(ProjectService);

  ngOnInit(): void {
    this.projectService.loadFeaturedProjects();
  }
}