import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { Marked } from 'marked';
import { CalloutBlock, CodeSnippetBlock, MarkdownTextBlock } from '@/app/core/models';

// Die Seite besitzt bereits ein h1; Markdown-Überschriften beginnen daher bei h2.
const markdown = new Marked({
  renderer: {
    heading({ tokens, depth }) {
      const level = Math.min(depth + 1, 6);
      return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`;
    },
  },
});

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
    return markdown.parse(content, { async: false });
  }
}
