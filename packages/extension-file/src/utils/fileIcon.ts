/**
 * Map file extension to iconfont type.
 *
 * Icons live in `@textory/editor-common-ui`'s iconfont.js. Unknown
 * extensions fall back to the generic `icon-file`.
 */
const FILE_ICONS: Record<string, string> = {
  pdf: 'icon-pdf',
  doc: 'icon-doc',
  docx: 'icon-doc',
  xls: 'icon-excel',
  xlsx: 'icon-excel',
  ppt: 'icon-pptx',
  pptx: 'icon-pptx',
};

export const getIcon = (ext?: string): string =>
  FILE_ICONS[(ext ?? '').toLowerCase()] ?? 'icon-file';
