import { BlockType, CalloutVariant, ProjectBlock, ProjectContentBlock } from '@/app/core/models';

type Payload = Record<string, unknown>;

const CALLOUT_VARIANTS: readonly CalloutVariant[] = ['info', 'result', 'warning'];

/**
 * Baut aus der flachen API-Blockliste einen typisierten Baum.
 * Unbekannte oder defekte Blöcke werden samt Kindern übersprungen. Blöcke mit unbekanntem
 * Parent gelten als Wurzeln; Zyklen sind von keiner Wurzel erreichbar und fallen weg.
 */
export function parseProjectBlocks(blocks: readonly ProjectBlock[]): ProjectContentBlock[] {
  const ids = new Set(blocks.map(block => block.id));
  const childrenByParent = new Map<string, ProjectBlock[]>();
  const roots: ProjectBlock[] = [];

  for (const block of blocks) {
    const parentId = block.parentBlockId;
    if (parentId && parentId !== block.id && ids.has(parentId)) {
      const siblings = childrenByParent.get(parentId) ?? [];
      siblings.push(block);
      childrenByParent.set(parentId, siblings);
    } else if (!parentId || !ids.has(parentId)) {
      roots.push(block);
    }
  }

  const visited = new Set<string>();

  const build = (items: ProjectBlock[]): ProjectContentBlock[] =>
    [...items]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .flatMap(item => {
        if (visited.has(item.id)) {
          return [];
        }
        visited.add(item.id);

        const parsed = parseBlock(item, () => build(childrenByParent.get(item.id) ?? []));
        return parsed ? [parsed] : [];
      });

  return build(roots);
}

function parseBlock(
  block: ProjectBlock,
  buildChildren: () => ProjectContentBlock[],
): ProjectContentBlock | null {
  const base = { id: block.id, displayOrder: block.displayOrder };

  if (block.type === BlockType.MarkdownText) {
    return { ...base, type: block.type, content: block.contentOrConfig };
  }

  const payload = parseJsonObject(block.contentOrConfig);
  if (!payload) {
    return null;
  }

  switch (block.type) {
    case BlockType.Callout: {
      const text = readString(payload, 'text');
      const variant = CALLOUT_VARIANTS.find(item => item === payload['variant']) ?? 'info';
      return text === undefined ? null : { ...base, type: block.type, variant, text };
    }
    case BlockType.CodeSnippet: {
      const code = readString(payload, 'code');
      return code === undefined
        ? null
        : {
            ...base,
            type: block.type,
            code,
            language: readString(payload, 'language') ?? 'plaintext',
            fileName: readString(payload, 'fileName'),
          };
    }
    case BlockType.ImageGallery:
      return { ...base, type: block.type, mediaIds: readStringArray(payload, 'mediaIds') };
    case BlockType.Image: {
      const mediaId = readString(payload, 'mediaId');
      return mediaId === undefined
        ? null
        : { ...base, type: block.type, mediaId, caption: readString(payload, 'caption') };
    }
    case BlockType.VideoPlayer: {
      const mediaId = readString(payload, 'mediaId');
      return mediaId === undefined ? null : { ...base, type: block.type, mediaId };
    }
    case BlockType.Section:
      return {
        ...base,
        type: block.type,
        title: readString(payload, 'title'),
        cssClass: readString(payload, 'cssClass'),
        children: buildChildren(),
      };
    case BlockType.SplitContainer:
      return {
        ...base,
        type: block.type,
        columns: readString(payload, 'columns'),
        gap: readString(payload, 'gap'),
        children: buildChildren(),
      };
    default:
      return null;
  }
}

function parseJsonObject(raw: string): Payload | null {
  try {
    const value: unknown = JSON.parse(raw);
    return typeof value === 'object' && value !== null && !Array.isArray(value)
      ? (value as Payload)
      : null;
  } catch {
    return null;
  }
}

function readString(payload: Payload, key: string): string | undefined {
  const value = payload[key];
  return typeof value === 'string' ? value : undefined;
}

function readStringArray(payload: Payload, key: string): string[] {
  const value = payload[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}
