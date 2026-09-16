import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '@/app/core/models';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-card.component.html'
})
export class ProjectCardComponent {
  project = input.required<Project>();
}