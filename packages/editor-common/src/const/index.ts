export const BLOCK_TYPES = {
  DOC: 'doc',
  T: 'title',
  P: 'paragraph',
  QT: 'quote',
  HR: 'divider',
  TL: 'table',
  TR: 'table_row',
  TD: 'table_cell',
  H: 'heading',
  OL: 'ordered_list',
  UL: 'unordered_list',
  CL: 'check_list',
  LI: 'list_item',
  CLI: 'check_item',
  IMG: 'image',
  FILE: 'file',
  VIDEO: 'video',
  UPLOAD_ERROR: 'upload_error',
  IMAGE_ERROR: 'image_error',
  EMBED_REQUIREMENT: 'embed_requirement',
  EMBED_ENTRY: 'embed_entry',
  TEXT: 'text',
  MENTIONS: 'mention',
  HARD_BREAK: 'hard_break',
};

export const headers = [
  {
    name: 'paragraph',
    type: BLOCK_TYPES.P,
    attrs: {},
    keys: 'paragraph',
  },
  {
    type: BLOCK_TYPES.HR,
    keys: 'toolbar.header.h1',
  },
  {
    name: 'h1',
    type: BLOCK_TYPES.H,
    attrs: { level: 1 },
    keys: 'toolbar.header.h1',
  },
  {
    name: 'h2',
    type: BLOCK_TYPES.H,
    attrs: { level: 2 },
    keys: 'toolbar.header.h2',
  },
  {
    name: 'h3',
    type: BLOCK_TYPES.H,
    attrs: { level: 3 },
    keys: 'toolbar.header.h3',
  },
  {
    name: 'h4',
    type: BLOCK_TYPES.H,
    attrs: { level: 4 },
    keys: 'toolbar.header.h4',
  },
  {
    name: 'h5',
    type: BLOCK_TYPES.H,
    attrs: { level: 5 },
    keys: 'toolbar.header.h5',
  },
  {
    name: 'h6',
    type: BLOCK_TYPES.H,
    attrs: { level: 6 },
    keys: 'toolbar.header.h6',
  },
  {
    name: 'quote',
    type: BLOCK_TYPES.QT,
    attrs: {},
    keys: 'toolbar.quote',
  },
];
