import {
  ExternalHyperlink,
  ShadingType,
  TextRun,
  type IRunOptions,
} from 'docx';

import { type TextNode } from '../types';

/**
 * Convert color name to hex value
 */
function convertColorToHex(color?: string): string | undefined {
  if (!color) return undefined;

  // If already hex, return as is
  if (color.startsWith('#')) return color;

  // Handle rgb(r, g, b) format
  const rgbMatch = color.match(
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/,
  );
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3], 10).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  // Map of common color names to hex values
  const colorMap: Record<string, string> = {
    red: '#FF0000',
    green: '#008000',
    blue: '#0000FF',
    yellow: '#FFFF00',
    orange: '#FFA500',
    purple: '#800080',
    pink: '#FFC0CB',
    brown: '#A52A2A',
    black: '#000000',
    white: '#FFFFFF',
    gray: '#808080',
    grey: '#808080',
    cyan: '#00FFFF',
    magenta: '#FF00FF',
    lime: '#00FF00',
    navy: '#000080',
    teal: '#008080',
    maroon: '#800000',
    olive: '#808000',
    silver: '#C0C0C0',
    gold: '#FFD700',
    indigo: '#4B0082',
    violet: '#EE82EE',
  };

  return colorMap[color.toLowerCase()] || color;
}

/**
 * Convert TipTap text node to DOCX TextRun or ExternalHyperlink
 *
 * @param node - TipTap text node
 * @returns DOCX TextRun or ExternalHyperlink
 */
export const convertText = (node: TextNode): TextRun | ExternalHyperlink => {
  // Check for marks
  const isBold = node.marks?.some((m) => m.type === 'bold');
  const isItalic = node.marks?.some((m) => m.type === 'italic');
  const isUnderline = node.marks?.some((m) => m.type === 'underline');
  const isStrike = node.marks?.some((m) => m.type === 'strike');
  const isCode = node.marks?.some((m) => m.type === 'code');
  const isSubscript = node.marks?.some((m) => m.type === 'subscript');
  const isSuperscript = node.marks?.some((m) => m.type === 'superscript');
  const linkMark = node.marks?.find((m) => m.type === 'link');
  const textStyleMark = node.marks?.find((m) => m.type === 'textStyle');
  const colorMark = node.marks?.find((m) => m.type === 'color');
  const backgroundMark = node.marks?.find((m) => m.type === 'background');
  const hasHighlight = node.marks?.some((m) => m.type === 'highlight');

  // Handle text color: prefer dedicated 'color' mark, fall back to 'textStyle' mark
  const textColor = convertColorToHex(
    colorMark?.attrs?.color || textStyleMark?.attrs?.color,
  );

  // Handle background color from 'background' mark
  const bgColor = convertColorToHex(backgroundMark?.attrs?.background);

  // Build text run options
  const baseOptions: IRunOptions = {
    text: node.text || '',
    bold: isBold || undefined,
    italics: isItalic || undefined,
    underline: isUnderline ? {} : undefined,
    strike: isStrike || undefined,
    font: isCode ? 'Consolas' : undefined,
    subScript: isSubscript || undefined,
    superScript: isSuperscript || undefined,
    // Default to black when no explicit color is set,
    // prevents headings from inheriting blue from Word's default theme
    color: textColor || '000000',
    // NOTE: ShadingType.CLEAR, not SOLID. With SOLID the visible color is
    // the pattern `color` (defaults to auto/black when unset), not `fill`,
    // which causes a black background. CLEAR shows `fill` as the background.
    shading: bgColor
      ? { type: ShadingType.CLEAR, fill: bgColor.replace('#', '') }
      : undefined,
    highlight: hasHighlight ? 'yellow' : undefined,
  };

  // Return hyperlink if link mark exists
  // digit-editor uses `attrs.link`, standard TipTap uses `attrs.href`
  const rawLink = linkMark?.attrs?.link || linkMark?.attrs?.href;
  const linkUrl = typeof rawLink === 'string' ? rawLink : undefined;
  if (linkUrl) {
    return new ExternalHyperlink({
      children: [
        new TextRun({
          ...baseOptions,
          style: 'Hyperlink',
        }),
      ],
      link: linkUrl,
    });
  }

  // Return regular text run
  return new TextRun(baseOptions);
};

/**
 * Convert TipTap hardBreak node to DOCX TextRun with break
 *
 * @returns DOCX TextRun with break
 */
export const convertHardBreak = (): TextRun => {
  return new TextRun({ text: '', break: 1 });
};
