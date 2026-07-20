/**
 * Shared utility functions for the export-docx package
 */

import { imageMeta as getImageMetadata, type ImageMeta } from 'image-meta';

/**
 * Maximum image width for DOCX export (in points).
 * Standard A4 page width (595.28pt) minus 1-inch margins on each side (72pt * 2) ≈ 451pt.
 * Using 450 as a safe default.
 */
const MAX_IMAGE_WIDTH = 450;

/**
 * Extract image type from URL or base64 data
 */
export function getImageTypeFromSrc(
  src: string,
): 'png' | 'jpeg' | 'gif' | 'bmp' | 'tiff' | 'webp' {
  if (src.startsWith('data:')) {
    const match = src.match(/data:image\/(\w+);/);

    if (match) {
      const type = match[1].toLowerCase();

      switch (type) {
        case 'jpg':
        case 'jpeg':
          return 'jpeg';
        case 'png':
          return 'png';
        case 'gif':
          return 'gif';
        case 'bmp':
          return 'bmp';
        case 'tiff':
          return 'tiff';
        case 'webp':
          return 'webp';
        default:
          return 'png';
      }
    }
  } else {
    const extension = src.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'jpeg';
      case 'png':
        return 'png';
      case 'gif':
        return 'gif';
      case 'bmp':
        return 'bmp';
      case 'tiff':
        return 'tiff';
      case 'webp':
        return 'webp';
      default:
        return 'png';
    }
  }

  return 'png';
}

/**
 * Create floating options for full-width images
 */
export function createFloatingOptions() {
  return {
    horizontalPosition: {
      relative: 'page',
      align: 'center',
    },
    verticalPosition: {
      relative: 'page',
      align: 'top',
    },
    lockAnchor: true,
    behindDocument: false,
    inFrontOfText: false,
  };
}

/**
 * Get image width with clear priority: node attrs > options.run > image metadata > default
 * Width is capped at MAX_IMAGE_WIDTH to ensure images fit within DOCX page content area.
 */
export function getImageWidth(
  node: { attrs?: { width?: number | null } },
  options?: { run?: { transformation?: { width?: number } } },
  imageMeta?: { width?: number | null },
): number {
  let width: number;

  if (node.attrs?.width && typeof node.attrs.width === 'number') {
    width = node.attrs.width;
  } else if (options?.run?.transformation?.width) {
    width = options.run.transformation.width;
  } else if (imageMeta?.width && typeof imageMeta.width === 'number') {
    width = Math.min(imageMeta.width, 600);
    if (width < 50) width = 400;
  } else {
    width = 400;
  }

  // Cap width to fit within DOCX page content area
  return Math.min(width, MAX_IMAGE_WIDTH);
}

/**
 * Get image height, maintaining aspect ratio when width is capped.
 * Priority: options.run > aspect ratio from node attrs > aspect ratio from image metadata > default
 */
export function getImageHeight(
  node: { attrs?: { width?: number | null; height?: number | null } },
  width: number,
  options?: { run?: { transformation?: { height?: number } } },
  imageMeta?: { width?: number | null; height?: number | null },
): number {
  if (options?.run?.transformation?.height) {
    return options.run.transformation.height;
  }

  // Use aspect ratio from node attrs to calculate height proportionally
  const origWidth = node.attrs?.width;
  const origHeight = node.attrs?.height;

  if (
    origWidth &&
    origHeight &&
    typeof origWidth === 'number' &&
    typeof origHeight === 'number'
  ) {
    const height = Math.round((width * origHeight) / origWidth);

    return height < 50 ? 300 : height;
  }

  // Fall back to image metadata aspect ratio
  if (
    imageMeta?.width &&
    typeof imageMeta.width === 'number' &&
    imageMeta?.height &&
    typeof imageMeta.height === 'number'
  ) {
    const height = Math.round((width * imageMeta.height) / imageMeta.width);

    return height < 50 ? 300 : height;
  }

  return 300;
}

/**
 * Fetch image data and metadata from URL
 */
export async function getImageDataAndMeta(
  url: string,
): Promise<{ data: Uint8Array; meta: ImageMeta }> {
  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText}` ||
          'HTTP request failed',
      );
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    // Get image metadata using image-meta
    let meta: ImageMeta;

    try {
      meta = getImageMetadata(data);
    } catch (error) {
      // If metadata extraction fails, use default values
      meta = {
        width: undefined,
        height: undefined,
        type: getImageTypeFromSrc(url) || 'png',
        orientation: undefined,
      };
    }

    return { data, meta };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : 'Unknown error';

    throw new Error(
      `Failed to fetch image from ${url}. ${message}. If the image can be displayed in the page but cannot be exported, the remote host is usually missing CORS headers for browser-side GET requests.`
    );
  }
}
