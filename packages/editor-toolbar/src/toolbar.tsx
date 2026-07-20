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
import {useEditorState} from '@tiptap/react';
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
  // 用 useEditorState 订阅 Toolbar 自身需要的派生状态（disabled 计算）。
  // Tiptap 默认 deep compare，只在任一值变化时才触发本组件重渲染。
  // 详见 .ai/tiptap-performance-guide.md 第 2、3 节。
  const caps = useEditorState({
    editor,
    selector: ({ editor }) => ({
      canUndo: editor.can().chain().focus().undo?.().run(),
      canRedo: editor.can().chain().focus().redo?.().run(),
      canBold: editor.can().chain().focus().toggleBold().run(),
      canItalic: editor.can().chain().focus().toggleItalic().run(),
      canUnderline: editor.can().chain().focus().toggleUnderline().run(),
      canStrike: editor.can().chain().focus().toggleStrike().run(),
      canUL: editor.can().chain().focus().toggleBulletList?.().run(),
      canOL: editor.can().chain().focus().toggleOrderedList?.().run(),
      canCL: editor.can().chain().focus().toggleTaskList?.().run(),
      canIndent: editor.can().chain().focus().indent().run(),
      canOutdent: editor.can().chain().focus().outdent().run(),
      canLink:
        !!editor.state.schema.marks[MARK_TYPES.LK] &&
        editor.can().chain().focus().toggleMark(MARK_TYPES.LK).run(),
      canInlineCode: editor.can().chain().focus().toggleCode?.().run(),
      isParagraphOrHeading:
        editor.isActive('paragraph') || editor.isActive('heading'),
      isCodeBlock: editor.isActive(BLOCK_TYPES.CODE),
      isInCodeBlock: isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
    }),
  });
  const editorView = editor.view;
  const commonProps: IToolbarCommonProps = {
    dispatch: editorView.dispatch,
    value: editorView.state,
    view: editorView,
    editor,
    disabled: !editor.isEditable,
  };
  const menuArray = useMemo(() => {
    if (!caps) return [];
    const disabled = !editable;
    return [
      {
        key: 'undo',
        component: <Undo editor={editor} />,
        intlStr: 'toolbar.undo',
        disabled: disabled || !caps.canUndo,
      },
      {
        key: 'redo',
        component: <Redo editor={editor} />,
        intlStr: 'toolbar.redo',
        disabled: disabled || !caps.canRedo,
      },
      {
        key: 'divider',
        component: <ToolBarItemDivider />,
      },
      {
        key: 'HeaderButton',
        component: <HeaderButton editor={editor} />,
        intlStr: 'header',
        disabled: disabled || caps.isInCodeBlock,
      },
      {
        key: 'bold',
        component: <Bold editor={editor} />,
        intlStr: 'bold',
        disabled: disabled || !caps.canBold || caps.isInCodeBlock,
      },
      {
        key: 'italic',
        component: <Italic editor={editor} />,
        intlStr: 'italic',
        disabled: disabled || !caps.canItalic || caps.isInCodeBlock,
      },
      {
        key: 'underline',
        component: <Underline editor={editor} />,
        intlStr: 'underline',
        disabled: disabled || !caps.canUnderline || caps.isInCodeBlock,
      },
      {
        key: 'strike',
        component: <Strike editor={editor} />,
        intlStr: 'strike',
        disabled: disabled || !caps.canStrike || caps.isInCodeBlock,
      },
      {
        key: 'textColorPicker',
        component: <TextColorPicker editor={editor} />,
        intlStr: 'color',
        disabled: disabled || caps.isInCodeBlock,
      },
      {
        key: 'highlightColorPicker',
        component: <HighlightColorPicker editor={editor} />,
        intlStr: 'highlight',
        disabled: disabled || caps.isInCodeBlock,
      },
      {
        key: 'align',
        component: <AlignButton editor={editor} />,
        intlStr: 'align',
        disabled: disabled || caps.isInCodeBlock,
      },
      {
        key: BLOCK_TYPES.OL,
        component: <ListButton />,
        disabled: disabled || !caps.canUL,
      },
      {
        key: BLOCK_TYPES.UL,
        component: <ListButton />,
        disabled: disabled || !caps.canOL,
      },
      {
        key: BLOCK_TYPES.CL,
        component: <ListButton />,
        disabled: disabled || !caps.canCL,
      },
      {
        key: INDENT_TYPES.Inc,
        component: <IndentButton />,
        disabled: disabled || !caps.canIndent,
      },
      {
        key: INDENT_TYPES.Desc,
        component: <IndentButton />,
        disabled: disabled || !caps.isParagraphOrHeading || !caps.canOutdent,
      },
      {
        key: 'link',
        component: <LinkButton editor={editor} />,
        intlStr: 'tool.link',
        disabled:
          disabled ||
          !caps.canLink ||
          caps.isInCodeBlock,
      },
      {
        key: 'code',
        component: <CodeButton editor={editor} />,
        intlStr: 'code',
        disabled:
          disabled ||
          caps.isInCodeBlock ||
          // !editor.can().chain().focus().toggleCodeBlock?.().run() ||
          !caps.canInlineCode,
      },
      {
        key: BLOCK_TYPES.IMG,
        component: <ImageButton editor={editor} />,
        intlStr: 'image',
        disabled: disabled || caps.isInCodeBlock,
      },
      {
        key: BLOCK_TYPES.TABLE,
        component: <TableButton editor={editor} />,
        intlStr: 'table',
        disabled: disabled || caps.isCodeBlock,
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
  }, [editor, editable, onImportFile, caps]);
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
