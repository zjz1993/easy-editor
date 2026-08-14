# Drag Handle 设计约束

`@textory/extension-drag-handle` 基于 `@tiptap/extension-drag-handle-react`,为编辑器所有块级节点提供 hover 式拖动 handle。改 drag-handle 相关代码、Video/File/Image 节点拖拽行为、`packages/editor-main/src/root.tsx` 渲染层前必读。

## 架构

drag-handle-react **不是 Tiptap Extension**,是 **React 组件**:
- 导出 `<DragHandle editor={...} onNodeChange={...} pluginKey={...}>{children}</DragHandle>`
- 挂在 `<EditorContent>` 外层(同 BubbleMenu 模式)
- 不进 `extensions` 数组,不参与 ProseMirror schema

因此 `@textory/extension-drag-handle` 包导出的是 React 组件 `<TextoryDragHandle>`,不是 Tiptap Extension。包名沿用 `extension-` 前缀仅为目录约定。

## 一致性:Block vs Inline

- **Block 节点统一走 drag-handle:** Video / File / Table / Paragraph / Heading / List / Blockquote / CodeBlock 等。
- **Image 例外:** `ImageNode` 保持 `group: 'inline'` + 原生 `draggable()`。Image 在行内流动,沿用 HTML5 原生拖。`ImageView.tsx` 的 drop handler 保留。

## 反模式(禁止)

- ❌ **不要恢复 VideoView / FileView 的 drop handler:** `VideoView.tsx` 和 `FileView.tsx` 内监听 `editor.view.dom` 的 `dragover` / `drop` useEffect 已被注释,功能由 drag-handle 接管。恢复会导致双重 drop 处理。
- ❌ **不要改 ImageNode 的 group / draggable:** 把 image 改成 `group: 'block'` 是破坏性 schema 变更,会让存量 inline 图片错位,且失去"图片在文字行内流动"的语义。
- ❌ **不要在 table cell 内显示 handle:** cell 内 paragraph 拖出会破坏 table 结构。`TextoryDragHandle` 内部通过 `editor.state.doc.resolve(pos)` 遍历祖先链,检测到 `tableCell` / `tableRow` / `tableHeader` 时返回 null 隐藏 handle。
- ❌ **不要给 DragHandleLayer 加 features 开关:** 按产品决策,drag-handle 默认开无开关。后续若要关掉,需先重新评估产品需求。
- ❌ **不要在 handle 上加 dropdown 菜单(第一版):** 仅纯 grip 拖动。删除/复制/对齐/缩进 toolbar 已有,不重复。若加,参考 `reactjs-tiptap-editor` 的 RichTextBubbleMenuDragHandle,且必须用 `editor.commands.setMeta('lockDragHandle', true)` 在菜单打开时锁定 handle。
- ❌ **不要把 DragHandleLayer 写成非 memo 组件:** 必须用 `memo` 隔离,避免 editor selection 变化触发整个 root re-render(详见 `tiptap-performance-guide.md` 第 1 节)。

## 性能要点

- `DragHandleLayer` 必须 `memo`,只接收 `editor` prop。
- `onNodeChange` 触发 React state 更新,但子树隔离后影响可控。
- 不要把 `editor.isEditable` 之类的 mutable 字段作为 useEffect dep — 不会响应变化。
- 大文档下,handle 跟随 hover 触发 `onNodeChange` 频次高。若实测卡顿,后续可加 RAF 节流或切 ref + DOM 操作。第一版优先正确性。

## 未来扩展

- **dropdown 菜单:** 若需在 handle 上加菜单(复制/删除/对齐等),参考 reactjs-tiptap-editor 的 `RichTextBubbleMenuDragHandle.tsx`。需引入 DropdownMenu + intl 文案,菜单打开时 `editor.commands.setMeta('lockDragHandle', true)`。
- **IconFont grip 图标:** 当前用 inline 6 点 grip SVG。若 IconFont 后续加 grip 图标,替换 `GripIcon.tsx` 即可。
- **table 整体拖不动的兜底:** 若实测 table 节点 `draggable()=false` 时 drag-handle 拖不动整表,在 drag-handle 包内用 `Extension.create({ addProseMirrorPlugins() })` 配合 `editor.view.dragging` 处理,**不要**改 `@textory/extension-table` 源码。

## 相关代码

| 文件 | 作用 |
|------|------|
| `packages/extension-drag-handle/src/DragHandle.tsx` | 主组件,`onNodeChange` + 祖先链判断 |
| `packages/extension-drag-handle/src/GripIcon.tsx` | 6 点 grip inline SVG |
| `packages/editor-main/src/root.tsx` | `DragHandleLayer` memo 组件 + 渲染 `{intlInit && editor.isEditable && <DragHandleLayer editor={editor} />}` |
| `packages/extension-video/src/VideoNode.ts` | `draggable()` 已注释 |
| `packages/extension-video/src/VideoView.tsx` | drop handler useEffect 已注释 |
| `packages/extension-file/src/FileNode.ts` | `draggable()` 已注释 |
| `packages/extension-image/src/ImageNode.ts` | 保持 inline + 原生 draggable(不动) |
| `packages/extension-image/src/ImageView.tsx` | drop handler 保留(不动) |
