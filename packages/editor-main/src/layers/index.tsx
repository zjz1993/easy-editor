import {memo} from 'react';
import type {Editor as TiptapEditor} from '@tiptap/react';
import {EditorContent} from '@tiptap/react';
import {OutlineView} from '@textory/extension-outline';
import {TableBubbleMenu} from '@textory/extension-table';
import {TextoryDragHandle} from '@textory/extension-drag-handle';
import EditorFilePreview from '../components/FilePreview/EditorFilePreview';
import {TextBubbleMenu} from '../components/TextBubbleMenu';
import CharacterCountBar from '../components/CharacterCount';
import SearchReplacePanel from '../components/SearchReplace';

/**
 * 隔离后的编辑器主舞台（EditorContent + OutlineView）。
 *
 * 这些子树本身不依赖 root.tsx 里的 UI state（如 isTitleFocused），用 memo
 * 避免父级无关 re-render 拖累 ProseMirror 同步渲染路径。
 *
 * 详见 .ai/tiptap-performance-guide.md 第 1 节「Isolate the editor in a
 * separate component」与 .ai/performance-issues.md P1-1。
 */
interface EditorStageProps {
  editor: TiptapEditor;
  autoFocus?: boolean;
  isOutlineEnabled: boolean;
}
export const EditorStage = memo<EditorStageProps>(({ editor, autoFocus, isOutlineEnabled }) => (
  <EditorContent autoFocus={autoFocus} editor={editor} className="textory-body">
    {isOutlineEnabled && <OutlineView editor={editor} />}
  </EditorContent>
));
EditorStage.displayName = 'EditorStage';

/**
 * 隔离 TableBubbleMenu —— 仅依赖 editor 实例。
 */
export const BubbleLayer = memo<{ editor: TiptapEditor }>(({ editor }) => (
  <TableBubbleMenu editor={editor} />
));
BubbleLayer.displayName = 'BubbleLayer';

/**
 * 隔离 EditorFilePreview —— 仅依赖 editor 实例。
 */
export const FilePreviewLayer = memo<{ editor: TiptapEditor }>(({ editor }) => (
  <EditorFilePreview editor={editor} />
));
FilePreviewLayer.displayName = 'FilePreviewLayer';

/**
 * 隔离 TextBubbleMenu —— 仅依赖 editor 实例。
 * 由 features.textBubbleToolbar 控制是否挂载。
 */
export const TextBubbleLayer = memo<{ editor: TiptapEditor }>(({ editor }) => (
  <TextBubbleMenu editor={editor} />
));
TextBubbleLayer.displayName = 'TextBubbleLayer';

/**
 * 隔离 DragHandle —— 仅依赖 editor 实例。
 * Block-level 节点拖动 handle,table 内部自动隐藏。
 * 详见 .ai/docs/drag-handle.md
 */
export const DragHandleLayer = memo<{ editor: TiptapEditor }>(({ editor }) => (
  <TextoryDragHandle editor={editor} />
));
DragHandleLayer.displayName = 'DragHandleLayer';

/**
 * 隔离 CharacterCountBar —— 仅依赖 editor 实例与 maxCount。
 * 由 features.characterCount 控制是否挂载。
 */
export const CharacterCountLayer = memo<{ editor: TiptapEditor; maxCount?: number }>(
  ({ editor, maxCount }) => <CharacterCountBar editor={editor} maxCount={maxCount} />,
);
CharacterCountLayer.displayName = 'CharacterCountLayer';

/**
 * 隔离 SearchReplacePanel —— 面板常驻挂载（hidden 切换）以保留上次搜索词，
 * 内部自持搜索/替换输入状态。
 * 由 features.searchReplace 控制是否挂载。
 */
export const SearchLayer = memo<{
  editor: TiptapEditor;
  open: boolean;
  showReplace: boolean;
  onClose: () => void;
  onToggleReplace: (show: boolean) => void;
}>(({ editor, open, showReplace, onClose, onToggleReplace }) => (
  <SearchReplacePanel
    editor={editor}
    open={open}
    showReplace={showReplace}
    onClose={onClose}
    onToggleReplace={onToggleReplace}
  />
));
SearchLayer.displayName = 'SearchLayer';
