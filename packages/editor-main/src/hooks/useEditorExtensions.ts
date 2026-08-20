import {useMemo} from 'react';
import type {AnyExtension} from '@tiptap/core';
import type {TTextoryEditorProps} from '@textory/context';
import {BLOCK_TYPES, wrapBlockExtensions} from '@textory/editor-utils';
import StarterKit from '@tiptap/starter-kit';
import {Bold} from '@textory/extension-bold';
import {CodeBlock} from '@textory/extension-code-block';
import {Indent} from '@textory/extension-indent';
import {CustomLink} from '@textory/extension-link';
import {TaskItem, TaskList} from '@textory/extension-task-item';
import {Color} from '@tiptap/extension-color';
import {Highlight} from '@textory/extension-highlight';
import {AttachmentExtension} from '@textory/extension-image';
import {FileExtension} from '@textory/extension-file';
import {VideoExtension} from '@textory/extension-video';
import {UploadExtension} from '@textory/extension-upload';
import {Table, TableCell, TableHeader, TableRow} from '@textory/extension-table';
import {FontSize} from '@textory/extension-fontsize';
import {CharacterCount} from '@textory/extension-character-count';
import {SearchReplace} from '@textory/extension-search-replace';
import {Markdown as TiptapMarkdown} from '@tiptap/markdown';
import {MarkdownListHandler, MarkdownPaste} from '@textory/extension-markdown';
import {OutlineExtension} from '@textory/extension-outline';
import {TextAlign} from '@tiptap/extension-text-align';
import {TextStyle} from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import UniqueID from '@tiptap/extension-unique-id';
import BulletList from '../BulletList/bullet-list.ts';
import {ListItem} from '../BulletList/list-item.ts';
import {Placeholder} from '../extension/Placeholder';
import {DocMetaExtension} from '../extension/DocMeta';

export interface EditorExtensionsInfo {
  /** memo 化的完整扩展数组（两段合一，可直接传 useTiptapWithSync） */
  extensions: AnyExtension[];
  isOutlineEnabled: boolean;
  isImportWordEnabled: boolean;
  isTextBubbleEnabled: boolean;
  isFileUploadEnabled: boolean;
  isVideoUploadEnabled: boolean;
  isCharacterCountEnabled: boolean;
  isSearchReplaceEnabled: boolean;
  isMarkdownEnabled: boolean;
}

/**
 * 组装编辑器的完整扩展集合 + 解析 features 开关。
 *
 * extensions 用 useMemo 包裹（P1-3）：useTiptapWithSync 内部对
 * extensions 引用变化会触发 `editor.setOptions({extensions})`——
 * 全量重建 schema 的昂贵操作。memo 依赖只放真正影响扩展配置的值；
 * features 只在 mount 时生效（root 有运行时变更警告），配置一次定型。
 *
 * 注意：AttachmentExtension 沿用原始 `props.imageProps`（未合并默认值），
 * 与拆分前行为保持一致。
 */
export function useEditorExtensions(
  props: TTextoryEditorProps,
  mergedProps: TTextoryEditorProps,
): EditorExtensionsInfo {
  const isOutlineEnabled = mergedProps.features?.outline ?? true;
  const isImportWordEnabled = mergedProps.features?.importWord ?? false;
  const isTextBubbleEnabled = mergedProps.features?.textBubbleToolbar ?? true;
  const isFileUploadEnabled = mergedProps.features?.fileUpload ?? true;
  const isVideoUploadEnabled = mergedProps.features?.videoUpload ?? true;
  const isCharacterCountEnabled = mergedProps.features?.characterCount ?? true;
  const isSearchReplaceEnabled = mergedProps.features?.searchReplace ?? true;
  const isMarkdownEnabled = mergedProps.features?.markdown ?? true;

  // DocMeta 初始 title：从顶层 title prop 拿。
  // 即便 DocTitle 不渲染（showTitle=false），export 仍能从 storage 读到这个回退值。
  const initialDocTitle = typeof mergedProps.title === 'string' ? mergedProps.title : '';
  const {CL, OL, UL, P, H, CLI, LI, QUOTE, HR, TL, IMG} = BLOCK_TYPES;
  const listGroup = `${UL}|${OL}|${CL}`;

  const extensions = useMemo<AnyExtension[]>(() => {
    const blockExtensions: AnyExtension[] = [
      StarterKit.configure({
        bold: false,
        codeBlock: false,
        underline: false,
        link: false,
        horizontalRule: false,
      }),
      Bold,
      UniqueID.configure({
        types: 'all',
      }),
      HorizontalRule.extend({
        name: BLOCK_TYPES.HR,
      }).configure({
        HTMLAttributes: {
          class: 'textory-divider',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      Highlight,
      FontSize,
      Underline,
      CustomLink,
      CodeBlock,
      Indent.configure({
        types: [P, H, CL, CLI, OL, UL, LI, QUOTE, HR],
        itemTypeName: BLOCK_TYPES.CLI,
        minLevel: 0,
        maxLevel: 10,
      }),
      TextAlign.configure({
        types: [BLOCK_TYPES.H, BLOCK_TYPES.P, BLOCK_TYPES.IMG],
      }),
      ListItem.extend({name: BLOCK_TYPES.LI}),
      BulletList.extend({name: BLOCK_TYPES.UL}).configure({
        keepMarks: true,
        keepAttributes: true,
        content: `(listItem|${listGroup}|checklistItem)+`,
        itemTypeName: BLOCK_TYPES.LI,
      }),
      TaskList,
      TaskItem,
      AttachmentExtension.configure(props.imageProps),
      // FileExtension gated by features.fileUpload. When disabled, neither
      // the extension nor the toolbar button are mounted — paste/drop of
      // non-image files becomes a no-op (fileUploader ref is not assigned).
      ...(isFileUploadEnabled
        ? [FileExtension.configure(mergedProps.fileProps)]
        : []),
      // VideoExtension gated by features.videoUpload. Same pattern as file:
      // extension + toolbar button + videoUploader ref are all skipped when
      // disabled, so paste/drop of video files becomes a no-op.
      ...(isVideoUploadEnabled
        ? [VideoExtension.configure(mergedProps.videoProps)]
        : []),
    ];

    return [
      ...wrapBlockExtensions(
        blockExtensions,
        [P, H, CL, OL, UL, QUOTE, HR, TL, IMG, BLOCK_TYPES.FILE, BLOCK_TYPES.VIDEO],
        '',
      ),
      // UploadExtension must be registered once globally — image and file
      // extensions both rely on its progress plugin + paste/drop dispatcher
      // but neither registers their own (would cause plugin-key conflicts).
      UploadExtension,
      ...(isOutlineEnabled ? [OutlineExtension] : []),
      DocMetaExtension.configure({title: initialDocTitle}),
      Placeholder.configure({
        placeholder: mergedProps.placeholder,
      }),
      // Markdown 支持（features.markdown 门控）：@tiptap/markdown 提供
      // parse/serialize 管线与 getMarkdown()；MarkdownListHandler 把列表
      // token 解析为本编辑器节点名；MarkdownPaste 接管纯文本粘贴转换。
      // MarkdownPaste priority=200 高于 CodeBlock（默认 100）——CodeBlock 会对
      // 任意多行且 detectLanguage 命中的纯文本建代码块，必须让 Markdown 转换
      // 优先；VSCode 源码复制（vscode-editor-data）在 MarkdownPaste 内部让位。
      ...(isMarkdownEnabled
        ? [
            TiptapMarkdown.configure({markedOptions: {gfm: true, breaks: false}}),
            MarkdownListHandler,
            MarkdownPaste,
          ]
        : []),
      ...(isCharacterCountEnabled
        ? [CharacterCount.configure({onUpdate: mergedProps.onCharacterCount})]
        : []),
      // 搜索替换（features.searchReplace 门控）：关闭时不挂扩展与快捷键，
      // 浏览器原生 Ctrl+F 不被拦截。
      ...(isSearchReplaceEnabled ? [SearchReplace] : []),
    ];
  }, [
    props.imageProps,
    isFileUploadEnabled,
    isVideoUploadEnabled,
    isOutlineEnabled,
    isMarkdownEnabled,
    isCharacterCountEnabled,
    isSearchReplaceEnabled,
    initialDocTitle,
    mergedProps.fileProps,
    mergedProps.videoProps,
    mergedProps.placeholder,
    mergedProps.onCharacterCount,
  ]);

  return {
    extensions,
    isOutlineEnabled,
    isImportWordEnabled,
    isTextBubbleEnabled,
    isFileUploadEnabled,
    isVideoUploadEnabled,
    isCharacterCountEnabled,
    isSearchReplaceEnabled,
    isMarkdownEnabled,
  };
}
