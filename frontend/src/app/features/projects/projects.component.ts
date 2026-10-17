import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProjectService } from '@/app/core/services/project.service';
import { ProjectCardComponent } from '@/app/shared/components/project-card/project-card.component';
import { ButtonDirective } from '@/app/shared/directives/button.directive';
import { TranslatePipe } from '@/app/shared/pipes/translate.pipe';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCardComponent, ButtonDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {
  protected readonly projectService = inject(ProjectService);
}
