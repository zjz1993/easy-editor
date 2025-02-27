export const INDENT_TYPES = {
  Inc: 'inc',
  Desc: 'desc',
};

export const BLOCK_TYPES = {
  DOC: 'doc',
  T: 'title',
  P: 'paragraph',
  QUOTE: 'quote',
  HR: 'divider',
  TL: 'table',
  TR: 'table_row',
  TD: 'table_cell',
  H: 'heading',
  OL: 'orderedList',
  UL: 'unorderedList',
  CL: 'checkList',
  LI: 'list_item',
  CLI: 'checkListItem',
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
    attrs: { level: 0 },
    keys: 'toolbar.paragraph',
  },
  {
    name: 'hr',
    type: BLOCK_TYPES.HR,
    keys: 'toolbar.header.h1',
    attrs: { level: 0 },
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
    name: 'hr',
    type: BLOCK_TYPES.HR,
    keys: 'toolbar.header.h1',
    attrs: { level: 0 },
  },
  {
    name: 'quote',
    type: BLOCK_TYPES.QUOTE,
    attrs: { level: 0 },
    keys: 'toolbar.header.quote',
  },
];
