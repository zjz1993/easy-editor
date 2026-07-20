import { Header, ImageRun, Paragraph } from 'docx';
import type { DocxOptions } from './option';
import { getImageDataAndMeta, getImageTypeFromSrc } from './utils';

interface WatermarkConfig {
  text?: string;
  image?: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  rotation: number;
  opacity: number;
}

function resolveWatermarkConfig(
  options?: DocxOptions['watermark'],
): WatermarkConfig | null {
  if (!options) return null;
  if (!options.text && !options.image) return null;

  return {
    text: options.text,
    image: options.image,
    fontSize: options.fontSize ?? 80,
    color: options.color ?? 'B0B0B0',
    fontFamily: options.fontFamily ?? 'sans-serif',
    rotation: options.rotation ?? 315,
    opacity: options.opacity ?? 0.4,
  };
}

/**
 * Render text watermark to a PNG image using Canvas API.
 */
function renderTextWatermarkToImage(config: WatermarkConfig): {
  data: Uint8Array;
  width: number;
  height: number;
} {
  const canvas = document.createElement('canvas');

  const scale = 2;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);

  ctx.font = `bold ${config.fontSize}px ${config.fontFamily}`;
  const metrics = ctx.measureText(config.text!);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = config.fontSize;

  const padding = 40;
  const logicalWidth = textWidth + padding * 2;
  const logicalHeight = textHeight + padding * 2;

  canvas.width = logicalWidth * scale;
  canvas.height = logicalHeight * scale;

  // Canvas resize resets context state, re-apply
  ctx.scale(scale, scale);
  ctx.clearRect(0, 0, logicalWidth, logicalHeight);

  ctx.font = `bold ${config.fontSize}px ${config.fontFamily}`;
  ctx.fillStyle = `#${config.color}`;
  ctx.globalAlpha = config.opacity;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(config.text!, logicalWidth / 2, logicalHeight / 2);

  const dataUrl = canvas.toDataURL('image/png');
  const base64Data = dataUrl.split(',')[1];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return { data: bytes, width: logicalWidth, height: logicalHeight };
}

function toDocxImageType(metaType?: string): 'png' | 'jpg' | 'gif' | 'bmp' {
  switch (metaType) {
    case 'jpeg':
    case 'jpg':
      return 'jpg';
    case 'gif':
      return 'gif';
    case 'bmp':
      return 'bmp';
    default:
      return 'png';
  }
}

/**
 * Create a Header containing a watermark.
 *
 * Uses a floating semi-transparent image positioned at page center with
 * behindDocument=true. Also adds a centered text paragraph as visible fallback
 * so that the watermark text appears in the header area regardless.
 */
export async function createWatermarkHeader(
  watermarkOptions?: DocxOptions['watermark'],
): Promise<Header | null> {
  const config = resolveWatermarkConfig(watermarkOptions);
  if (!config) return null;

  const children: Paragraph[] = [];

  // --- Floating image behind body text (watermark effect) ---
  let imageData: Uint8Array;
  let imageType: 'png' | 'jpg' | 'gif' | 'bmp';
  let displayWidth: number;
  let displayHeight: number;

  if (config.image) {
    const src = config.image;

    if (src.startsWith('http')) {
      const result = await getImageDataAndMeta(src);
      imageData = result.data;
      imageType = toDocxImageType(result.meta.type);

      const origW = result.meta.width || 450;
      const origH = result.meta.height || 450;
      displayWidth = Math.min(origW, 450);
      displayHeight = Math.round((displayWidth * origH) / origW);
    } else if (src.startsWith('data:')) {
      const base64Data = src.split(',')[1];
      const binaryString = atob(base64Data);
      imageData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        imageData[i] = binaryString.charCodeAt(i);
      }
      imageType = getImageTypeFromSrc(src) === 'jpeg' ? 'jpg' : 'png';
      displayWidth = 450;
      displayHeight = 450;
    } else {
      return children.length > 0 ? new Header({ children }) : null;
    }
  } else if (config.text) {
    const rendered = renderTextWatermarkToImage(config);
    imageData = rendered.data;
    imageType = 'png';

    const maxW = 500;
    const ratio = rendered.width / rendered.height;
    displayWidth = Math.min(rendered.width, maxW);
    displayHeight = Math.round(displayWidth / ratio);
  } else {
    return children.length > 0 ? new Header({ children }) : null;
  }

  const clockwiseDeg = (360 - (config.rotation % 360)) % 360;

  children.push(
    new Paragraph({
      children: [
        new ImageRun({
          type: imageType,
          data: imageData,
          transformation: {
            width: displayWidth,
            height: displayHeight,
            rotation: clockwiseDeg,
          },
          floating: {
            horizontalPosition: {
              relative: 'page',
              align: 'center',
            },
            verticalPosition: {
              relative: 'page',
              align: 'center',
            },
            behindDocument: true,
            lockAnchor: true,
            allowOverlap: true,
            wrap: {
              type: 0,
            },
          },
        }),
      ],
    }),
  );


  return new Header({ children });
}
