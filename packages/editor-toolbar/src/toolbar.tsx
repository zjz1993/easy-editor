import { type FC, cloneElement, useContext, useRef } from 'react';
import './styles/root.scss';
import {
  BLOCK_TYPES,
  INDENT_TYPES,
  Iconfont,
  useSize,
} from '@easy-editor/editor-common';
import DropdownPanel from '@easy-editor/editor-common/src/components/DropdownPanel/index.tsx';
import type { Editor } from '@tiptap/core';
import Overflow from 'rc-overflow';
import AlignButton from './components/AlignButton/index.tsx';
import HeaderButton from './components/HeaderButton/index.tsx';
import IndentButton from './components/IndentButton/IndentButton.tsx';
import ListButton from './components/ListButton/index.tsx';
import TextColorPicker from './components/TextColorPicker/index.tsx';
import { ToolBarItemDivider } from './components/ToolBarItemDivider.tsx';
import Bold from './components/toolbarItem/Bold.tsx';
import Italic from './components/toolbarItem/Italic.tsx';
import { Redo } from './components/toolbarItem/Redo.tsx';
import Strike from './components/toolbarItem/Strike.tsx';
import Underline from './components/toolbarItem/Underline.tsx';
import { Undo } from './components/toolbarItem/Undo.tsx';
import ToolbarContext from './context/toolbarContext.ts';
import type { IToolbarCommonProps } from './types/index.ts';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indentation: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
    color: {
      /**
       * Set the text color
       * @param color The color to set
       * @example editor.commands.setColor('red')
       */
      setColor: (color: string) => ReturnType;

      /**
       * Unset the text color
       * @example editor.commands.unsetColor()
       */
      unsetColor: () => ReturnType;
    };
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
    textAlign: {
      /**
       * Set the text align attribute
       * @param alignment The alignment
       * @example editor.commands.setTextAlign('left')
       */
      setTextAlign: (alignment: string) => ReturnType;
      /**
       * Unset the text align attribute
       * @example editor.commands.unsetTextAlign()
       */
      unsetTextAlign: () => ReturnType;
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
  const toolbarRef = useRef<HTMLDivElement>();
  const { editor } = props;
  const { disabled } = useContext(ToolbarContext);
  const toolbarSize = useSize(toolbarRef);
  const editorView = editor.view;
  const commonProps: IToolbarCommonProps = {
    dispatch: editorView.dispatch,
    value: editorView.state,
    view: editorView,
    editor,
    disabled: !editor.isEditable,
  };
  const menuArray = [
    {
      key: 'undo',
      component: <Undo />,
      intlStr: 'toolbar.undo',
      disabled: disabled || !editor.can().chain().focus().undo?.().run(),
    },
    {
      key: 'redo',
      component: <Redo />,
      intlStr: 'toolbar.redo',
      disabled: disabled || !editor.can().chain().focus().redo?.().run(),
    },
    {
      key: 'divider',
      component: <ToolBarItemDivider />,
    },
    {
      key: 'HeaderButton',
      component: <HeaderButton />,
      intlStr: 'header',
      disabled: disabled,
    },
    {
      key: 'bold',
      component: <Bold />,
      intlStr: 'bold',
      disabled: disabled || !editor.can().chain().focus().toggleBold().run(),
    },
    {
      key: 'italic',
      component: <Italic />,
      intlStr: 'italic',
      disabled: disabled || !editor.can().chain().focus().toggleItalic().run(),
    },
    {
      key: 'underline',
      component: <Underline />,
      intlStr: 'underline',
      disabled:
        disabled || !editor.can().chain().focus().toggleUnderline().run(),
    },
    {
      key: 'strike',
      component: <Strike />,
      intlStr: 'strike',
      disabled: disabled || !editor.can().chain().focus().toggleStrike().run(),
    },
    {
      key: 'textColorPicker',
      component: <TextColorPicker />,
      intlStr: 'header',
    },
    {
      key: 'align',
      component: <AlignButton />,
      intlStr: 'align',
    },
    {
      key: BLOCK_TYPES.OL,
      component: <ListButton />,
      disabled: disabled,
    },
    {
      key: BLOCK_TYPES.UL,
      component: <ListButton />,
      disabled: disabled,
    },
    {
      key: BLOCK_TYPES.CL,
      component: <ListButton />,
      disabled: disabled,
    },
    {
      key: INDENT_TYPES.Inc,
      component: <IndentButton />,
      disabled: disabled,
    },
    {
      key: INDENT_TYPES.Desc,
      component: <IndentButton />,
      disabled: disabled,
    },
  ];
  return (
    <ToolbarContext.Provider value={{ ...commonProps }}>
      <div className="easy-editor-toolbar" ref={toolbarRef}>
        <Overflow
          data={menuArray}
          renderRest={restArray => {
            return (
              <DropdownPanel
                getPopupContainer={trigger => trigger.parentNode as HTMLElement}
                action={['hover']}
                popup={
                  <div>
                    {restArray.map(item => {
                      return cloneElement(item.component, {
                        key: item.key,
                        disabled: item.disabled,
                        intlStr: item.intlStr,
                        type: item.key,
                      });
                    })}
                  </div>
                }
              >
                <Iconfont type="icon-zhankai-circle-line" />
              </DropdownPanel>
            );
          }}
          maxCount="responsive"
          renderItem={item => {
            return cloneElement(item.component, {
              key: item.key,
              disabled: item.disabled,
              intlStr: item.intlStr,
              type: item.key,
            });
          }}
        />
      </div>
    </ToolbarContext.Provider>
  );
};
export default Toolbar;
