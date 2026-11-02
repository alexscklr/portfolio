import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, TemplateRef } from '@angular/core';
import {
  ContainerContentBlock,
  ProjectContentBlock,
  SectionBlock,
  SplitContainerBlock,
} from '@/app/core/models';

export interface ProjectChildrenContext {
  $implicit: readonly ProjectContentBlock[];
}

const SAFE_GRID_TRACKS =
  /^(?:(?:\d+(?:\.\d+)?fr)|(?:\d+(?:\.\d+)?(?:px|rem|em|%))|auto|min-content|max-content)(?:\s+(?:(?:\d+(?:\.\d+)?fr)|(?:\d+(?:\.\d+)?(?:px|rem|em|%))|auto|min-content|max-content))*$/;
const SAFE_LENGTH = /^\d+(?:\.\d+)?(?:px|rem|em|%)$/;

/** Rendert Layout-Container; die Kinder liefert der Dispatcher über `children`. */
@Component({
  selector: 'app-project-container-block',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './project-container-block.component.html',
  styleUrl: './project-container-block.component.scss',
})
export class ProjectContainerBlockComponent {
  readonly block = input.required<ContainerContentBlock>();
  readonly children = input.required<TemplateRef<ProjectChildrenContext>>();

  protected readonly sectionBlock = computed<SectionBlock | undefined>(() => {
    const block = this.block();
    return block.type === 'Section' ? block : undefined;
  });
  protected readonly splitBlock = computed<SplitContainerBlock | undefined>(() => {
    const block = this.block();
    return block.type === 'SplitContainer' ? block : undefined;
  });

  protected sectionClasses(cssClass?: string): string {
    const safeClasses = cssClass
      ?.split(/\s+/)
      .filter(className => /^[a-zA-Z0-9:_/-]+$/.test(className))
      .join(' ');

    return `project-section my-8 ${safeClasses ?? ''}`;
  }

  protected columns(value?: string): string {
    return value && SAFE_GRID_TRACKS.test(value) ? value : 'minmax(0, 1fr) minmax(0, 1fr)';
  }

  protected gap(value?: string): string {
    if (!value) {
      return '1.5rem';
    }

    if (/^\d+(?:\.\d+)?$/.test(value)) {
      return `${Number(value) * 0.25}rem`;
    }

    return SAFE_LENGTH.test(value) ? value : '1.5rem';
  }
}
