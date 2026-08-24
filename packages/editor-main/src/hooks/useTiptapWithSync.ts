import {useEffect, useMemo, useRef} from 'react';
import {useEditor} from '@tiptap/react';
import type {EditorEvents, JSONContent} from '@tiptap/core';
import type {EditorProps} from '@tiptap/pm/view';
import {isEqual} from 'lodash-es';

interface UseTiptapWithSyncOptions {
  content: any;
  /**
   * JSON content 预处理钩子，由 `<Editor>` 透传。
   * 仅对 JSON 形式的 content 生效；HTML 字符串不经过此函数。
   */
  transformContent?: (content: JSONContent) => JSONContent;
  editable: boolean;
  placeholder?: string;
  extensions: any[];
  editorProps?: EditorProps;
  autofocus?: 'start' | 'end' | boolean;
  onUpdate?: (props: EditorEvents['update']) => void;
}

/**
 * 在 content 传入 Tiptap 前对 JSON 做用户自定义预处理。
 *
 * 用途：
 * - 旧编辑器数据迁移（未知节点过滤、字段重命名等）
 * - 业务侧自定义清洗（XSS 过滤、白名单字段）
 *
 * HTML 字符串直通；JSON 才进入 transformContent。
 * 函数抛错会被 try-catch 兜住，回退到原始 content。
 */
function applyTransform(
  content: unknown,
  transform?: (content: JSONContent) => JSONContent,
): unknown {
  if (!transform) return content;
  if (typeof content !== 'object' || content === null) return content;
  try {
    return transform(content as JSONContent);
  } catch (err) {
    console.warn('[useTiptapWithSync] transformContent failed:', err);
    return content;
  }
}

export function useTiptapWithSync({
  content,
  transformContent,
  editable,
  placeholder,
  extensions,
  autofocus,
  onUpdate,
  editorProps,
}: UseTiptapWithSyncOptions) {
  // 👇 第一次渲染时创建 editor，不在 props 改变时重新创建
  // shouldRerenderOnTransaction: false 关闭「每个 transaction 重渲染整个组件树」，
  //   由依赖 editor state 的子组件自行通过 useEditorState 订阅。
  //   详见 .ai/tiptap-performance-guide.md 第 3 节。
  //
  // 注意：不要在这里加 `immediatelyRender: false`。该选项会把 editor 创建推迟到
  // useEffect，导致首次渲染时 editor 为 null，破坏本仓库中所有假设 editor 非 null
  // 的子组件（TableBubbleMenu、OutlineView、EditorFilePreview 等）。
  // immediatelyRender: false 主要面向 SSR；本仓库是纯 CSR，不需要。

  // 初始 content：JSON 形式先过 transformContent
  const initialContent = useMemo(
    () => applyTransform(content, transformContent),
    [content, transformContent],
  );

  // 可选字段仅在真的传入时才写进 options：显式传 undefined 会覆盖 Tiptap
  // 默认值（editorProps 默认 {} 被覆盖后构造期即崩；autofocus 默认 false 被
  // 覆盖后，mount 时 `!== false && !== null` 判断反而触发意外的自动聚焦）
  const editor = useEditor({
    content: initialContent,
    editable,
    extensions: [...extensions],
    ...(autofocus !== undefined && {autofocus}),
    ...(editorProps !== undefined && {editorProps}),
    shouldRerenderOnTransaction: false,
    onUpdate: ({ editor, appendedTransactions, transaction }) => {
      onUpdate?.({ appendedTransactions, transaction, editor });
    },
  });

  // 👇 外部 editable 改变时同步
  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  // 👇 content 改变时同步
  // 用 ref 记录上次应用到 editor 的 content，配合 deep equal 跳过语义相同的重复设置。
  // 初始值取首渲染的 content：useEditor 构造时已经应用过它（content option），
  // 初始挂载必须跳过重复 setContent —— 否则该 dispatch 会全量重建 doc，
  // 初始 content 含 React NodeView（图片/视频/代码块等）时，重建过程中
  // ReactNodeViewRenderer 内部的 flushSync 撞上 React 提交阶段的 passive
  // effects 同步 flush 上下文，触发 "flushSync was called from inside a
  // lifecycle method" 警告（初始加载必现）。
  // 必要性：
  //   1. 父组件受控回流：用户键入 → onUpdate → onChange({html,json}) → 父 setState
  //      → 新 content 引用回流 → useEffect 触发 → setContent 抢断用户输入（IME 组合断、光标跳）。
  //   2. JSON 对象 content：原 `editor.getHTML() !== content` 永远为 true（string vs object），
  //      即便父不回流，每次 dependencies 变也会重复 setContent。
  //   3. HTML 字符串 content：ProseMirror 序列化会规范化（属性顺序、自闭合、空白），
  //      即使语义相同字符串也可能不同，导致重复 setContent 与光标抖动。
  //   deep equal 在引用变化但语义等价时跳过，根治以上三种场景。
  const lastAppliedContentRef = useRef<any>(content);
  useEffect(() => {
    if (!editor) return;
    if (isEqual(lastAppliedContentRef.current, content)) return;
    const transformed = applyTransform(content, transformContent);
    editor.commands.setContent(transformed, {});
    lastAppliedContentRef.current = content;
  }, [content, editor, transformContent]);

  // 👇 placeholder 改变时同步
  useEffect(() => {
    if (!editor) return;

    editor.extensionManager.extensions.forEach(ext => {
      if (ext.name === 'placeholder') {
        ext.options.placeholder = placeholder;
      }
    });
    // 触发重绘
    editor.view.dispatch(editor.state.tr);
  }, [placeholder, editor]);

  // 👇 extensions 改变时同步（可选）
  useEffect(() => {
    if (!editor) return;

    // 理论上 Tiptap 不支持 runtime 替换 extensions
    // 但我们可以更新 options，或者让用户自定义行为
    // 这里只做简单触发更新
    editor.setOptions({
      extensions,
    });
  }, [extensions, editor]);

  return editor;
}
