import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CustomLinkView from '../../views/link';

const CustomLink = Node.create({
  name: 'custom_link',

  inline: true,
  group: 'inline',
  //atom: true,
  //draggable: true,

  addAttributes() {
    return {
      href: {
        default: null,
      },
      text: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'a[href]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      { ...HTMLAttributes, target: '_blank', rel: 'noopener noreferrer' },
      0,
    ];
  },

  addPasteRules() {
    return [
      {
        find: /(https?:\/\/[^\s]+)/g,
        handler: ({ state, range, match }) => {
          const [url] = match;
          state.tr.insertText(url, range.from, range.to);
          state.tr.setNodeMarkup(range.from, null, {
            href: url,
            text: url,
          });
        },
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomLinkView); // 使用 ReactNodeViewRenderer
  },
});

export default CustomLink;
