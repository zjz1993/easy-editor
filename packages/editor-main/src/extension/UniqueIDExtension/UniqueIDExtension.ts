import {Extension} from '@tiptap/core';
import {BLOCK_TYPES} from '@textory/editor-common';
import createUniqueIdPluginNew from "./UniqueIdPlugin.ts";

export const UniqueIDExtension = Extension.create({
  name: 'uniqueID',

  priority: 100,

  addGlobalAttributes() {
    return [
      {
        types: [
          BLOCK_TYPES.P,
          BLOCK_TYPES.H,
          BLOCK_TYPES.CODE,
          BLOCK_TYPES.IMG,
          BLOCK_TYPES.CODE_LINE,
          BLOCK_TYPES.TABLE,
        ],
        attributes: {
          id: {
            default: null,
            parseHTML: element => element.getAttribute('data-id'),
            renderHTML: attrs => (attrs.id ? { 'data-id': attrs.id } : {}),
          },
        },
      },
    ];
  },

  addProseMirrorPlugins() {
    return [createUniqueIdPluginNew()];
  },
});

export default UniqueIDExtension;
