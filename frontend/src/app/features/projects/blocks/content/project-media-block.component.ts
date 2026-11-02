import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ImageBlock, ImageGalleryBlock, ProjectMedia, VideoPlayerBlock } from '@/app/core/models';
import { MediaSliderComponent } from '@/app/shared/components/media-slider/media-slider.component';

type ProjectMediaBlock = ImageGalleryBlock | ImageBlock | VideoPlayerBlock;

@Component({
  selector: 'app-project-media-block',
  standalone: true,
  imports: [MediaSliderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './project-media-block.component.html',
})
export class ProjectMediaBlockComponent {
  readonly block = input.required<ProjectMediaBlock>();
  readonly media = input.required<readonly ProjectMedia[]>();
  readonly label = input.required<string>();

  protected readonly imageBlock = computed(() => {
    const block = this.block();
    return block.type === 'Image' ? block : undefined;
  });
  protected readonly galleryBlock = computed(() => {
    const block = this.block();
    return block.type === 'ImageGallery' ? block : undefined;
  });
  protected readonly videoBlock = computed(() => {
    const block = this.block();
    return block.type === 'VideoPlayer' ? block : undefined;
  });

  protected readonly galleryMedia = computed(() => {
    const block = this.galleryBlock();
    if (!block) {
      return [];
    }

    return block.mediaIds
      .map(id => this.findMedia(id))
      .filter((item): item is ProjectMedia => item !== undefined);
  });

  protected readonly selectedMedia = computed(() => {
    const block = this.imageBlock() ?? this.videoBlock();
    if (!block) {
      return undefined;
    }

    return this.findMedia(block.mediaId);
  });

  protected readonly image = computed(() => {
    const block = this.imageBlock();
    const media = this.selectedMedia();
    return block && media && !media.contentType.startsWith('video/') ? media : undefined;
  });

  protected readonly video = computed(() => {
    const block = this.videoBlock();
    const media = this.selectedMedia();
    return block && media?.contentType.startsWith('video/') ? media : undefined;
  });

  private findMedia(mediaId: string): ProjectMedia | undefined {
    return this.media().find(item => item.id === mediaId);
  }
}
