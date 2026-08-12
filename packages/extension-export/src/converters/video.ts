import {
  AlignmentType,
  ExternalHyperlink,
  ImageRun,
  Paragraph,
  TextRun,
  type IImageOptions,
  type IParagraphOptions,
} from 'docx';
import { imageMeta as getImageMetadata, type ImageMeta } from 'image-meta';

import type { DocxOptions } from '../option';
import type { ImageNode, VideoNode } from '../types';
import {
  getImageDataAndMeta,
  getImageHeight,
  getImageTypeFromSrc,
  getImageWidth,
} from '../utils';
import { IntlComponent } from '@textory/editor-common-ui';

/**
 * Default label shown when a video has neither poster nor src.
 * Lazily resolved: the file-level const runs at module-load time when
 * IntlComponent may not yet be initialised, so we fall back to the
 * hardcoded string. Callers re-resolve via `getVideoLabel()` at render
 * time so the active locale wins once intl is ready.
 */
const DEFAULT_VIDEO_LABEL = IntlComponent.get('export.video.default.label') || '视频';

function mapTextAlign(
  align?: 'left' | 'center' | 'right' | null,
): (typeof AlignmentType)[keyof typeof AlignmentType] | undefined {
  if (!align || align === 'left') return undefined;
  if (align === 'center') return AlignmentType.CENTER;
  if (align === 'right') return AlignmentType.RIGHT;
  return undefined;
}

/**
 * Resolve poster bytes + dimensions, reusing the image pipeline.
 *
 * Returns null when the poster cannot be fetched (network/CORS/decode) so
 * the caller can degrade to a text hyperlink instead of dropping the node.
 */
async function createPosterRun(
  node: VideoNode,
  options: DocxOptions['video'],
): Promise<ImageRun | null> {
  const poster = node.attrs?.poster;
  if (!poster) return null;

  let imageData: Uint8Array;
  let imageMeta: ImageMeta;

  try {
    if (poster.startsWith('http')) {
      const result = await getImageDataAndMeta(poster);
      imageData = result.data;
      imageMeta = result.meta;
    } else if (poster.startsWith('data:')) {
      const base64Data = poster.split(',')[1] ?? '';
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      imageData = bytes;
      try {
        imageMeta = getImageMetadata(imageData);
      } catch {
        imageMeta = {
          type: 'png',
          width: undefined,
          height: undefined,
          orientation: undefined,
        };
      }
    } else {
      return null;
    }
  } catch (error) {
    // Surface the underlying reason — most commonly a CORS rejection on the
    // poster host. The browser fetch in `getImageDataAndMeta` uses
    // `mode: 'cors'`; if the host doesn't return
    // `Access-Control-Allow-Origin`, fetch throws `TypeError: Failed to
    // fetch` and we'd otherwise degrade silently to a text hyperlink,
    // which looks like "poster didn't export" with no clue why.
    console.warn(
      '[textory/export] video poster fetch failed — falling back to text hyperlink.',
      'URL:',
      poster,
      'reason:',
      error,
      '\nIf this is a CORS error, the poster host must return `Access-Control-Allow-Origin`.',
    );
    return null;
  }

  const getImageType = (metaType?: string): 'jpg' | 'png' | 'gif' | 'bmp' => {
    switch (metaType) {
      case 'jpeg':
      case 'jpg':
        return 'jpg';
      case 'png':
        return 'png';
      case 'gif':
        return 'gif';
      case 'bmp':
        return 'bmp';
      case 'webp':
        return 'png';
    }
    switch (getImageTypeFromSrc(poster)) {
      case 'jpeg':
        return 'jpg';
      case 'png':
        return 'png';
      case 'gif':
        return 'gif';
      case 'bmp':
        return 'bmp';
      case 'webp':
        return 'png';
      default:
        return 'png';
    }
  };

  // Treat the video node's width/height as the poster's intrinsic size —
  // they share aspect ratio in practice. Fall back to image metadata.
  const pseudoImageNode: ImageNode = {
    type: 'image',
    attrs: {
      src: poster,
      width: node.attrs?.width ?? null,
      height: node.attrs?.height ?? null,
    },
  };

  const finalWidth = getImageWidth(pseudoImageNode, options, imageMeta);
  const finalHeight = getImageHeight(pseudoImageNode, finalWidth, options, imageMeta);

  const imageOptions: IImageOptions = {
    type: getImageType(imageMeta.type),
    data: imageData,
    transformation: { width: finalWidth, height: finalHeight },
    altText: {
      name: node.attrs?.name || '',
      description: undefined,
      title: node.attrs?.name || undefined,
    },
  };

  return new ImageRun(imageOptions);
}

/**
 * Convert a block-level video node to a DOCX paragraph.
 *
 * Word does not support embedded video playback through docx-js, so we
 * render a clickable poster image (when available) hyperlinked to the
 * video `src`. If the poster is missing or fails to load, degrade to a
 * text hyperlink with the video name.
 */
export async function convertVideo(
  node: VideoNode,
  options: DocxOptions['video'],
): Promise<Paragraph> {
  const src = node.attrs?.src || '';
  const label = node.attrs?.name || DEFAULT_VIDEO_LABEL;
  const alignment = mapTextAlign(node.attrs?.textAlign);
  const paragraphOptions: IParagraphOptions = options?.paragraph ?? {};

  // No src → drop a plain-text placeholder so the node isn't silently lost.
  if (!src) {
    return new Paragraph({
      children: [new TextRun({ text: `[${label}]` })],
      ...(alignment ? { alignment } : {}),
      ...paragraphOptions,
    });
  }

  const posterRun = await createPosterRun(node, options);

  if (posterRun) {
    return new Paragraph({
      children: [
        new ExternalHyperlink({
          children: [posterRun],
          link: src,
        }),
      ],
      ...(alignment ? { alignment } : {}),
      ...paragraphOptions,
    });
  }

  // No poster (or fetch failed) → text hyperlink.
  return new Paragraph({
    children: [
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: `[${label}]`,
            style: 'Hyperlink',
          }),
        ],
        link: src,
      }),
    ],
    ...(alignment ? { alignment } : {}),
    ...paragraphOptions,
  });
}
