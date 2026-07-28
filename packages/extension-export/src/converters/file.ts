import {ExternalHyperlink, Paragraph, TextRun} from 'docx';
import {type FileNode} from '../types';

/**
 * Convert a file-attachment node to a DOCX paragraph.
 *
 * Strategy: render as a single ExternalHyperlink pointing to `attrs.src`,
 * with the file name as the link text. This mirrors the editor's HTML
 * serialization (`<a href={src} download={name}>name</a>`) so external
 * consumers see a normal download link.
 *
 * If `src` is missing (e.g. upload failed or in-progress node) the file
 * name is still emitted as plain text so it isn't silently dropped.
 */
export const convertFile = (node: FileNode): Paragraph => {
  const { src, name } = node.attrs ?? {};
  const label = name || '附件';

  if (!src) {
    return new Paragraph({
      children: [new TextRun({ text: label })],
    });
  }

  return new Paragraph({
    children: [
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: label,
            style: 'Hyperlink',
          }),
        ],
        link: src,
      }),
    ],
  });
};
