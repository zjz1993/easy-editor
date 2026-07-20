import {cloneElement, type FC, useMemo, useRef} from 'react';
import type {IImageProps, ExportProps} from '@textory/context';
import {useEditorContext} from '@textory/context';
import {
  BLOCK_TYPES,
  INDENT_TYPES,
  isSelectionInsideBlockByType,
  MARK_TYPES,
} from '@textory/editor-utils';
import {DropdownPanel, Iconfont} from '@textory/editor-common';
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
import TableButton from './components/TableButton/index.tsx';
import {useEditorStateTrigger} from './hook/useEditorStateTrigger.ts';
import ExportButton from "./components/ExportButton/index.tsx";
import ImportButton from "./components/ImportButton/index.tsx";
import HighlightColorPicker from "./components/HighlightColorPicker/index.tsx";
import DividerButton from "./components/DividerButton/index.tsx";

export interface IToolbarProps {
  editor: Editor | null;
  imageProps: Partial<IImageProps>;
  exportProps: Partial<ExportProps>;
  /** When provided, the import button is shown. Pass the file to your import handler. */
  onImportFile?: (file: File) => void;
}

const Toolbar: FC<IToolbarProps> = props => {
  const toolbarRef = useRef<HTMLDivElement>();
  const {
    props: { editable },
  } = useEditorContext();
  const { editor, imageProps = {}, exportProps={}, onImportFile } = props;
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
    const disabled = !editable;
    return [
      {
        key: 'undo',
        component: <Undo editor={editor} />,
        intlStr: 'toolbar.undo',
        disabled: disabled || !editor.can().chain().focus().undo?.().run(),
      },
      {
        key: 'redo',
        component: <Redo editor={editor} />,
        intlStr: 'toolbar.redo',
        disabled: disabled || !editor.can().chain().focus().redo?.().run(),
      },
      {
        key: 'divider',
        component: <ToolBarItemDivider />,
      },
      {
        key: 'HeaderButton',
        component: <HeaderButton editor={editor} />,
        intlStr: 'header',
        disabled:
          disabled || isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
      },
      {
        key: 'bold',
        component: <Bold editor={editor} />,
        intlStr: 'bold',
        disabled:
          disabled ||
          !editor.can().chain().focus().toggleBold().run() ||
          isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
      },
      {
        key: 'italic',
        component: <Italic editor={editor} />,
        intlStr: 'italic',
        disabled:
          disabled ||
          !editor.can().chain().focus().toggleItalic().run() ||
          isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
      },
      {
        key: 'underline',
        component: <Underline editor={editor} />,
        intlStr: 'underline',
        disabled:
          disabled ||
          !editor.can().chain().focus().toggleUnderline().run() ||
          isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
      },
      {
        key: 'strike',
        component: <Strike editor={editor} />,
        intlStr: 'strike',
        disabled:
          disabled ||
          !editor.can().chain().focus().toggleStrike().run() ||
          isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
      },
      {
        key: 'textColorPicker',
        component: <TextColorPicker editor={editor} />,
        intlStr: 'color',
        disabled:
          disabled || isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
      },
      {
        key: 'highlightColorPicker',
        component: <HighlightColorPicker editor={editor} />,
        intlStr: 'highlight',
        disabled:
          disabled || isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
      },
      {
        key: 'align',
        component: <AlignButton editor={editor} />,
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
        component: <LinkButton editor={editor} />,
        intlStr: 'tool.link',
        disabled:
          disabled ||
          !editor.state.schema.marks[MARK_TYPES.LK] ||
          !editor.can().chain().focus().toggleMark(MARK_TYPES.LK).run() ||
          isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
      },
      {
        key: 'code',
        component: <CodeButton editor={editor} />,
        intlStr: 'code',
        disabled:
          disabled ||
          isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE) ||
          // !editor.can().chain().focus().toggleCodeBlock?.().run() ||
          !editor.can().chain().focus().toggleCode?.().run(),
      },
      {
        key: BLOCK_TYPES.IMG,
        component: <ImageButton editor={editor} />,
        intlStr: 'image',
        disabled:
          disabled || isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
      },
      {
        key: BLOCK_TYPES.TABLE,
        component: <TableButton editor={editor} />,
        intlStr: 'table',
        disabled: disabled || editor.isActive(BLOCK_TYPES.CODE),
      },
      {
        key: 'divider',
        component: <DividerButton editor={editor}/>,
        intlStr: 'divider',
        disabled: disabled,
      },
      {
        key: 'export',
        component: <ExportButton editor={editor} exportProps={exportProps}/>,
        intlStr: 'export',
        disabled: disabled,
      },
      ...(onImportFile ? [{
        key: 'import',
        component: <ImportButton editor={editor} onImportFile={onImportFile} />,
        intlStr: 'import',
        disabled: disabled,
      }] : []),
    ];
  }, [editor, editable, onImportFile]);
  return (
    <ToolbarContext.Provider value={{ ...commonProps, imageProps }}>
      <div className="textory-toolbar" ref={toolbarRef}>
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
