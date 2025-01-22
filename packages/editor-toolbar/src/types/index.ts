//declare module '@tiptap/core' {
//  interface Commands<ReturnType> {
//    collaboration: {
//      /**
//       * Undo recent changes
//       */
//      undo: () => ReturnType;
//      /**
//       * Reapply reverted changes
//       */
//      redo: () => ReturnType;
//    };
//    paragraph: {
//      /**
//       * Toggle a paragraph
//       */
//      setParagraph: () => ReturnType;
//    };
//    bold: {
//      /**
//       * Toggle a bold mark
//       */
//      toggleBold: () => ReturnType;
//    };
//    strike: {
//      /**
//       * Toggle a strike mark
//       */
//      toggleStrike: () => ReturnType;
//    };
//    italic: {
//      /**
//       * Toggle an italic mark
//       */
//      toggleItalic: () => ReturnType;
//    };
//    code: {
//      /**
//       * Toggle inline code
//       */
//      toggleCode: () => ReturnType;
//    };
//    bulletList: {
//      /**
//       * Toggle a bullet list
//       */
//      toggleBulletList: () => ReturnType;
//    };
//    orderedList: {
//      /**
//       * Toggle an ordered list
//       */
//      toggleOrderedList: () => ReturnType;
//    };
//    taskList: {
//      /**
//       * Toggle a task list
//       */
//      toggleTaskList: () => ReturnType;
//    };
//    link: {
//      /**
//       * Toggle a link mark
//       */
//      toggleLink: (attributes: {
//        href: string;
//        target?: string | null;
//      }) => ReturnType;
//    };
//    codeBlock: {
//      /**
//       * Toggle a code block
//       */
//      toggleCodeBlock: (attributes?: { language: string }) => ReturnType;
//    };
//    blockQuote: {
//      /**
//       * Toggle a blockquote node
//       */
//      toggleBlockquote: () => ReturnType;
//    };
//    horizontalRule: {
//      /**
//       * Add a horizontal rule
//       */
//      setHorizontalRule: () => ReturnType;
//    };
//  }
//}
import type { Editor } from '@tiptap/core';
import type { EditorState, Transaction } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';

export interface IToolbarCommonProps {
  dispatch: (tr: Transaction) => void;
  value: EditorState;
  view: EditorView;
  editor: Editor;
}
