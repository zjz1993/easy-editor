import type { FC } from 'react';
import './styles/root.scss';
import type { Editor } from '@tiptap/core';
import type { IToolbarCommonProps } from 'src/types/index.ts';
import HeaderButton from './components/HeaderButton/index.tsx';
import { ToolBarItemDivider } from './components/ToolBarItemDivider.tsx';
import Bold from './components/toolbarItem/Bold.tsx';
import Italic from './components/toolbarItem/Italic.tsx';
import { Redo } from './components/toolbarItem/Redo.tsx';
import Strike from './components/toolbarItem/Strike.tsx';
import Underline from './components/toolbarItem/Underline.tsx';
import { Undo } from './components/toolbarItem/Undo.tsx';
import ToolbarContext from './context/toolbarContext.ts';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    collaboration: {
      /**
       * Undo recent changes
       */
      undo: () => ReturnType;
      /**
       * Reapply reverted changes
       */
      redo: () => ReturnType;
    };
    paragraph: {
      /**
       * Toggle a paragraph
       */
      setParagraph: () => ReturnType;
    };
    bold: {
      /**
       * Toggle a bold mark
       */
      toggleBold: () => ReturnType;
    };
    underline: {
      /**
       * Set an underline mark
       * @example editor.commands.setUnderline()
       */
      setUnderline: () => ReturnType;
      /**
       * Toggle an underline mark
       * @example editor.commands.toggleUnderline()
       */
      toggleUnderline: () => ReturnType;
      /**
       * Unset an underline mark
       * @example editor.commands.unsetUnderline()
       */
      unsetUnderline: () => ReturnType;
    };
    strike: {
      /**
       * Toggle a strike mark
       */
      toggleStrike: () => ReturnType;
    };
    italic: {
      /**
       * Toggle an italic mark
       */
      toggleItalic: () => ReturnType;
    };
    code: {
      /**
       * Toggle inline code
       */
      toggleCode: () => ReturnType;
    };
    bulletList: {
      /**
       * Toggle a bullet list
       */
      toggleBulletList: () => ReturnType;
    };
    orderedList: {
      /**
       * Toggle an ordered list
       */
      toggleOrderedList: () => ReturnType;
    };
    taskList: {
      /**
       * Toggle a task list
       */
      toggleTaskList: () => ReturnType;
    };
    link: {
      /**
       * Toggle a link mark
       */
      toggleLink: (attributes: {
        href: string;
        target?: string | null;
      }) => ReturnType;
    };
    codeBlock: {
      /**
       * Toggle a code block
       */
      toggleCodeBlock: (attributes?: { language: string }) => ReturnType;
    };
    blockQuote: {
      /**
       * Toggle a blockquote node
       */
      toggleBlockquote: () => ReturnType;
    };
    horizontalRule: {
      /**
       * Add a horizontal rule
       */
      setHorizontalRule: () => ReturnType;
    };
    heading: {
      /**
       * Set a heading node
       */
      setHeading: (attributes: { level: number }) => ReturnType;
      /**
       * Toggle a heading node
       */
      toggleHeading: (attributes: { level: number }) => ReturnType;
    };
  }
}

export interface IToolbarProps {
  editor: Editor | null;
}

const Toolbar: FC<IToolbarProps> = props => {
  const { editor } = props;
  const editorView = editor.view;
  const commonProps: IToolbarCommonProps = {
    dispatch: editorView.dispatch,
    value: editorView.state,
    view: editorView,
    editor,
    disabled: !editor.isEditable,
  };
  return (
    <ToolbarContext.Provider value={{ ...commonProps }}>
      <div className="easy-editor-toolbar">
        <Undo />
        <Redo />
        <ToolBarItemDivider />
        <HeaderButton />
        <Bold />
        <Italic />
        <Underline />
        <Strike />
      </div>
    </ToolbarContext.Provider>
  );
};
export default Toolbar;
