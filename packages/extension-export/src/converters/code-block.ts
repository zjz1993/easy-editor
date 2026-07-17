import {
  BorderStyle,
  Paragraph,
  ShadingType,
  TextRun,
} from 'docx';

import type { CodeBlockNode } from '../types';

/**
 * Convert TipTap codeBlock node to DOCX Paragraph.
 *
 * The code is rendered inside a bordered, light-gray box with a monospace
 * font. Line breaks and leading whitespace (indentation) are preserved so
 * the code keeps its original layout in Word.
 *
 * Why one TextRun per line:
 * - A `\n` inside a single TextRun is NOT rendered as a line break by Word,
 *   so multi-line code collapses onto a single line.
 * - `break: 1` emits a proper `<w:br/>` element which Word honors as a line
 *   break while staying within the same paragraph, keeping the border and
 *   shading as one continuous box.
 *
 * @param node - TipTap codeBlock node
 * @returns DOCX Paragraph object with code styling
 */
export function convertCodeBlock(node: CodeBlockNode): Paragraph {
  // Extract full text content from all text nodes
  const codeText =
    node.content?.map((textNode) => textNode.text || '').join('') || '';

  // Strip a single trailing newline (common in code blocks) so we don't
  // render an extra empty line at the bottom of the box.
  const normalizedText = codeText.replace(/\n$/, '');
  const lines = normalizedText.split('\n');

  // One TextRun per line; `break: 1` inserts a line break before each line
  // except the first. The docx library emits xml:space="preserve" for runs
  // whose text has leading/trailing whitespace, so indentation survives.
  const children = lines.map((line, index) =>
    new TextRun({
      text: line,
      font: 'Consolas',
      size: 20, // 10pt
      color: '333333',
      ...(index > 0 ? { break: 1 } : {}),
    }),
  );

  // Guarantee at least one run so the paragraph always has content
  if (children.length === 0) {
    children.push(new TextRun({ text: '', font: 'Consolas', size: 20 }));
  }

  return new Paragraph({
    children,
    // Light gray background for the whole code block.
    // NOTE: must use ShadingType.CLEAR, not SOLID. With SOLID the visible
    // color is the pattern `color` (which defaults to auto/black when unset),
    // not `fill` — that's what caused the black background. CLEAR means
    // "no pattern, just background fill", so `fill` is what shows through.
    shading: {
      type: ShadingType.CLEAR,
      fill: 'F5F6F7',
    },
    // Subtle light-gray border on all four sides; `space` adds inner padding
    // between the border and the text (measured in points, 1-31).
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD', space: 6 },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD', space: 6 },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD', space: 6 },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD', space: 6 },
    },
    // Separation from surrounding paragraphs
    spacing: {
      before: 120,
      after: 120,
    },
    // Left/right inner padding (twips, 1 twip = 1/20 pt)
    indent: {
      left: 120,
      right: 120,
    },
  });
}
