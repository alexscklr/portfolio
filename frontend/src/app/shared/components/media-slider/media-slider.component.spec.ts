import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProjectMedia } from '@/app/core/models';
import { MediaSliderComponent } from './media-slider.component';

const media = (
  id: string,
  contentType: string,
  extra: Partial<ProjectMedia> = {},
): ProjectMedia => ({
  id,
  fileName: id,
  fileUrl: `/media/${id}`,
  contentType,
  displayOrder: 1,
  ...extra,
});

describe('MediaSliderComponent', () => {
  let fixture: ComponentFixture<MediaSliderComponent>;
  let element: HTMLElement;

  const render = async (items: ProjectMedia[], fallbackUrl?: string): Promise<void> => {
    fixture.componentRef.setInput('media', items);
    fixture.componentRef.setInput('fallbackUrl', fallbackUrl);
    fixture.componentRef.setInput('label', 'Demo');
    await fixture.whenStable();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MediaSliderComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(MediaSliderComponent);
    element = fixture.nativeElement as HTMLElement;
  });

  it('renders images and videos and loads only the first image eagerly', async () => {
    await render([
      media('a.png', 'image/png', { altText: 'A' }),
      media('b.gif', 'image/gif'),
      media('c.mp4', 'video/mp4', { posterUrl: '/poster.png' }),
    ]);

    const images = element.querySelectorAll('img');
    expect(images.length).toBe(2);
    expect(images[0].getAttribute('loading')).toBe('eager');
    expect(images[0].alt).toBe('A');
    expect(images[1].getAttribute('loading')).toBe('lazy');
    expect(images[1].alt).toBe('Demo');

    const video = element.querySelector('video');
    expect(video?.getAttribute('poster')).toBe('/poster.png');
    expect(video?.muted).toBe(true);
  });

  it('shows no controls for a single slide', async () => {
    await render([media('a.png', 'image/png')]);

    expect(element.querySelectorAll('button').length).toBe(0);
  });

  it('falls back to the preview image when there is no media', async () => {
    await render([], '/preview.png');

    expect(element.querySelector('img')?.getAttribute('src')).toBe('/preview.png');
    expect(element.querySelectorAll('button').length).toBe(0);
  });

  it('shows a placeholder without media and fallback', async () => {
    await render([]);

    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('[role="region"]')).toBeNull();
  });

  it('navigates with the arrow buttons and respects the bounds', async () => {
    await render([media('a.png', 'image/png'), media('b.png', 'image/png')]);
    const track = element.querySelector<HTMLElement>('ul') as HTMLElement;
    const scrollTo = vi.fn();
    Object.defineProperty(track, 'scrollTo', { value: scrollTo });
    Object.defineProperty(track, 'clientWidth', { value: 300 });

    const [previous, next] = Array.from(element.querySelectorAll<HTMLButtonElement>('button'));
    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(false);

    next.click();
    await fixture.whenStable();

    expect(scrollTo).toHaveBeenCalledWith({ left: 300, behavior: 'smooth' });
    expect(next.disabled).toBe(true);
    expect(previous.disabled).toBe(false);
    expect(element.querySelector('[aria-current="true"]')).not.toBeNull();
  });

  it('follows the scroll position of the track', async () => {
    await render([media('a.png', 'image/png'), media('b.png', 'image/png')]);
    const track = element.querySelector<HTMLElement>('ul') as HTMLElement;
    Object.defineProperty(track, 'clientWidth', { value: 300 });
    track.scrollLeft = 300;

    track.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();

    const dots = Array.from(element.querySelectorAll('button[aria-current]'));
    expect(dots[1].getAttribute('aria-current')).toBe('true');
  });
});
