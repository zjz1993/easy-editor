import {cloneElement, type FC, useContext, useMemo, useRef} from 'react';
import './styles/root.scss';
import type {IImageProps} from '@easy-editor/editor-common';
import {
  BLOCK_TYPES,
  DropdownPanel,
  Iconfont,
  INDENT_TYPES,
  isSelectionInsideBlockByType,
  MARK_TYPES,
} from '@easy-editor/editor-common';
import type {Editor} from '@tiptap/core';
import Overflow from 'rc-overflow';
import AlignButton from './components/AlignButton/index.tsx';
import CodeButton from './components/CodeButton/index.tsx';
import HeaderButton from './components/HeaderButton/index.tsx';
import LinkButton from './components/LinkButton/index.tsx';
import ListButton from './components/ListButton/index.tsx';
import TextColorPicker from './components/TextColorPicker/index.tsx';
import {Bold, IndentButton, Italic, Redo, Strike, ToolBarItemDivider, Underline, Undo,} from './components';
import ToolbarContext from './context/toolbarContext.ts';
import type {IToolbarCommonProps} from './types/index.ts';
import ImageButton from './components/ImageButton/index.tsx';
import type {ImageNodeAttributes} from '@easy-editor/extension-image';
import {useEditorStateTrigger} from './hook/useEditorStateTrigger.ts';
import TableButton from "./components/TableButton/index.tsx";

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
      updateAttrs: (options: ImageNodeAttributes) => ReturnType;
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
    table: {
      /**
       * Insert a table
       * @param options The table attributes
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
       */
      insertTable: (options?: {
        rows?: number;
        cols?: number;
        withHeaderRow?: boolean;
      }) => ReturnType;
      /**
       * Add a column before the current column
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.addColumnBefore()
       */
      addColumnBefore: () => ReturnType;
      /**
       * Add a column after the current column
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.addColumnAfter()
       */
      addColumnAfter: () => ReturnType;
      /**
       * Delete the current column
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.deleteColumn()
       */
      deleteColumn: () => ReturnType;
      /**
       * Add a row before the current row
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.addRowBefore()
       */
      addRowBefore: () => ReturnType;
      /**
       * Add a row after the current row
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.addRowAfter()
       */
      addRowAfter: () => ReturnType;
      /**
       * Delete the current row
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.deleteRow()
       */
      deleteRow: () => ReturnType;
      /**
       * Delete the current table
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.deleteTable()
       */
      deleteTable: () => ReturnType;
      /**
       * Merge the currently selected cells
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.mergeCells()
       */
      mergeCells: () => ReturnType;
      /**
       * Split the currently selected cell
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.splitCell()
       */
      splitCell: () => ReturnType;
      /**
       * Toggle the header column
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.toggleHeaderColumn()
       */
      toggleHeaderColumn: () => ReturnType;
      /**
       * Toggle the header row
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.toggleHeaderRow()
       */
      toggleHeaderRow: () => ReturnType;
      /**
       * Toggle the header cell
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.toggleHeaderCell()
       */
      toggleHeaderCell: () => ReturnType;
      /**
       * Merge or split the currently selected cells
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.mergeOrSplit()
       */
      mergeOrSplit: () => ReturnType;
      /**
       * Set a cell attribute
       * @param name The attribute name
       * @param value The attribute value
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.setCellAttribute('align', 'right')
       */
      setCellAttribute: (name: string, value: any) => ReturnType;
      /**
       * Moves the selection to the next cell
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.goToNextCell()
       */
      goToNextCell: () => ReturnType;
      /**
       * Moves the selection to the previous cell
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.goToPreviousCell()
       */
      goToPreviousCell: () => ReturnType;
      /**
       * Try to fix the table structure if necessary
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.fixTables()
       */
      fixTables: () => ReturnType;
      /**
       * Set a cell selection inside the current table
       * @param position The cell position
       * @returns True if the command was successful, otherwise false
       * @example editor.commands.setCellSelection({ anchorCell: 1, headCell: 2 })
       */
      setCellSelection: (position: {
        anchorCell: number;
        headCell?: number;
      }) => ReturnType;
    };
  }
}

export interface IToolbarProps {
  editor: Editor | null;
  imageProps: Partial<IImageProps>;
}

const Toolbar: FC<IToolbarProps> = props => {
  const toolbarRef = useRef<HTMLDivElement>();
  const { editor, imageProps = {} } = props;
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
  useEditorStateTrigger(editor); // 只触发 Toolbar 自身刷新
  const menuArray = useMemo(() => {
    return [
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
          disabled ||
          !canIndent ||
          !editor.can().chain().focus().outdent().run(),
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
          // !editor.can().chain().focus().toggleCodeBlock?.().run() ||
          !editor.can().chain().focus().toggleCode?.().run(),
      },
      {
        key: BLOCK_TYPES.IMG,
        component: <ImageButton />,
        intlStr: 'image',
        disabled: disabled,
      },
      {
        key: BLOCK_TYPES.TABLE,
        component: <TableButton />,
        intlStr: 'table',
        disabled: disabled,
      },
    ];
  }, [editor?.state]);
  return (
    <ToolbarContext.Provider value={{ ...commonProps, imageProps }}>
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
