import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { BlockType, ProjectContentBlock, ProjectMedia } from '@/app/core/models';
import { ProjectContainerBlockComponent } from './container/project-container-block.component';
import { ProjectMediaBlockComponent } from './content/project-media-block.component';
import { ProjectTextBlockComponent } from './content/project-text-block.component';

@Component({
  selector: 'app-project-blocks',
  standalone: true,
  imports: [
    ProjectContainerBlockComponent,
    ProjectTextBlockComponent,
    ProjectMediaBlockComponent,
    forwardRef(() => ProjectBlocksComponent),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-blocks.component.html',
  // Kinder sollen direkte Grid-Items des Containers sein
  styles: ':host { display: contents; }',
})
export class ProjectBlocksComponent {
  readonly blocks = input.required<readonly ProjectContentBlock[]>();
  readonly media = input.required<readonly ProjectMedia[]>();
  readonly label = input.required<string>();

  protected readonly blockType = BlockType;
}
