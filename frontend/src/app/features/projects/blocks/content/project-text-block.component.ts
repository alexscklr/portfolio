import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { marked } from 'marked';
import { CalloutBlock, CodeSnippetBlock, MarkdownTextBlock } from '@/app/core/models';

type ProjectTextBlock = MarkdownTextBlock | CalloutBlock | CodeSnippetBlock;

@Component({
  selector: 'app-project-text-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'block' },
  templateUrl: './project-text-block.component.html',
  styleUrl: './project-text-block.component.scss',
})
export class ProjectTextBlockComponent {
  readonly block = input.required<ProjectTextBlock>();

  protected readonly markdownBlock = computed(() => {
    const block = this.block();
    return block.type === 'MarkdownText' ? block : undefined;
  });
  protected readonly calloutBlock = computed(() => {
    const block = this.block();
    return block.type === 'Callout' ? block : undefined;
  });
  protected readonly codeBlock = computed(() => {
    const block = this.block();
    return block.type === 'CodeSnippet' ? block : undefined;
  });

  protected renderMarkdown(content: string): string {
    return marked.parse(content, { async: false });
  }
}
