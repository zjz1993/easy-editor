import {cloneElement, type FC, useContext, useRef} from 'react';
import './styles/root.scss';
import {BLOCK_TYPES, Iconfont, INDENT_TYPES,} from '@easy-editor/editor-common';
import DropdownPanel from '@easy-editor/editor-common/src/components/DropdownPanel/index.tsx';
import {isSelectionInsideBlockByType, MARK_TYPES,} from '@easy-editor/editor-common/src/index.ts';
import type {Editor} from '@tiptap/core';
import Overflow from 'rc-overflow';
import AlignButton from './components/AlignButton/index.tsx';
import CodeButton from './components/CodeButton/index.tsx';
import HeaderButton from './components/HeaderButton/index.tsx';
import IndentButton from './components/IndentButton/IndentButton.tsx';
import LinkButton from './components/LinkButton/index.tsx';
import ListButton from './components/ListButton/index.tsx';
import TextColorPicker from './components/TextColorPicker/index.tsx';
import {ToolBarItemDivider} from './components/ToolBarItemDivider.tsx';
import Bold from './components/toolbarItem/Bold.tsx';
import Italic from './components/toolbarItem/Italic.tsx';
import {Redo} from './components/toolbarItem/Redo.tsx';
import Strike from './components/toolbarItem/Strike.tsx';
import Underline from './components/toolbarItem/Underline.tsx';
import {Undo} from './components/toolbarItem/Undo.tsx';
import ToolbarContext from './context/toolbarContext.ts';
import type {IToolbarCommonProps} from './types/index.ts';
import ImageButton from './components/ImageButton/index.tsx';
import type {ImageNodeAttributes} from '@easy-editor/extension-image';

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
    image: {
      setImage: (options: ImageNodeAttributes) => ReturnType;
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
    customLink: {
      /**
       * Set a link mark
       * @param attributes The link attributes
       * @example editor.commands.setLink({ href: 'https://tiptap.dev' })
       */
      setLink: (attributes: {
        href: string;
        text: string;
        target?: string | null;
        rel?: string | null;
        class?: string | null;
      }) => ReturnType;
      /**
       * Toggle a link mark
       * @param attributes The link attributes
       * @example editor.commands.toggleLink({ href: 'https://tiptap.dev' })
       */
      toggleLink: (attributes: {
        href: string;
        target?: string | null;
        rel?: string | null;
        class?: string | null;
      }) => ReturnType;
      /**
       * Unset a link mark
       * @example editor.commands.unsetLink()
       */
      unsetLink: () => ReturnType;
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
  const canIndent = editor.isActive('paragraph') || editor.isActive('heading');
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
      disabled:
        disabled || isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
    },
    {
      key: 'bold',
      component: <Bold />,
      intlStr: 'bold',
      disabled:
        disabled ||
        !editor.can().chain().focus().toggleBold().run() ||
        isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
    },
    {
      key: 'italic',
      component: <Italic />,
      intlStr: 'italic',
      disabled:
        disabled ||
        !editor.can().chain().focus().toggleItalic().run() ||
        isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
    },
    {
      key: 'underline',
      component: <Underline />,
      intlStr: 'underline',
      disabled:
        disabled ||
        !editor.can().chain().focus().toggleUnderline().run() ||
        isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
    },
    {
      key: 'strike',
      component: <Strike />,
      intlStr: 'strike',
      disabled:
        disabled ||
        !editor.can().chain().focus().toggleStrike().run() ||
        isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
    },
    {
      key: 'textColorPicker',
      component: <TextColorPicker />,
      intlStr: 'color',
      disabled:
        disabled || isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
    },
    {
      key: 'align',
      component: <AlignButton />,
      intlStr: 'align',
      disabled:
        disabled || isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
    },
    {
      key: BLOCK_TYPES.OL,
      component: <ListButton />,
      disabled:
        disabled || !editor.can().chain().focus().toggleBulletList?.().run(),
    },
    {
      key: BLOCK_TYPES.UL,
      component: <ListButton />,
      disabled:
        disabled || !editor.can().chain().focus().toggleOrderedList?.().run(),
    },
    {
      key: BLOCK_TYPES.CL,
      component: <ListButton />,
      disabled:
        disabled || !editor.can().chain().focus().toggleTaskList?.().run(),
    },
    {
      key: INDENT_TYPES.Inc,
      component: <IndentButton />,
      disabled: disabled || !editor.can().chain().focus().indent().run(),
    },
    {
      key: INDENT_TYPES.Desc,
      component: <IndentButton />,
      disabled:
        disabled || !canIndent || !editor.can().chain().focus().outdent().run(),
    },
    {
      key: 'link',
      component: <LinkButton />,
      intlStr: 'tool.link',
      disabled:
        disabled ||
        !editor.state.schema.marks[MARK_TYPES.LK] ||
        !editor.can().chain().focus().toggleMark(MARK_TYPES.LK).run() ||
        isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
    },
    {
      key: 'code',
      component: <CodeButton />,
      intlStr: 'code',
      disabled:
        disabled ||
        !editor.can().chain().focus().toggleCodeBlock?.().run() ||
        !editor.can().chain().focus().toggleCode?.().run(),
    },
    {
      key: BLOCK_TYPES.IMG,
      component: <ImageButton />,
      intlStr: 'image',
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
                zIndex={1}
                popupAlign={{
                  points: ['tr', 'br'],
                }}
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
