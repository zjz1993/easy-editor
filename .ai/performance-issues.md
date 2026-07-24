# Easy Editor 已知性能问题清单

> 基于 Tiptap 官方性能指南对照本仓库代码梳理得到。
> 配套阅读：`./tiptap-performance-guide.md`
>
> 修复完一项请打勾并简述做法；新增问题请追加到对应优先级末尾。

## 优先级说明

- 🔴 **P0** — 直接违反官方文档点名建议，每次按键/光标移动都触发大范围重渲染，体感最直接
- 🟠 **P1** — 架构层面的问题，长期影响可维护性 + 边际性能开销
- 🟡 **P2** — 需要特定场景（大文档、多 NodeView）才会暴露
- 🟢 **P3** — 微优化，时间充裕再做

---

## 🔴 P0

### P0-1 `useEditorStateTrigger` 强制重渲染整个 Toolbar

**位置**：`packages/editor-toolbar/src/hook/useEditorStateTrigger.ts:4-20`

```ts
const update = () => setTick(tick => tick + 1);
editor.on('selectionUpdate', update);
editor.on('transaction', update);   // 每个 transaction 都触发
```

**问题**：
- 每次 transaction（按键、光标移动、拖拽等）都会让整个 Toolbar 重渲染
- 触发 `packages/editor-toolbar/src/toolbar.tsx:54` 的 `menuArray` useMemo 重新计算
- useMemo 内部有十几处 `editor.can().chain().focus().xxx().run()`，链式探测非常昂贵
- 所有按钮组件跟随重渲染

**官方依据**：文档明确建议用 `useEditorState` + selector 替代强制重渲染。

**修复方向**：
- 方案 A（推荐）：改用 `useEditorState`，selector 只返回 Toolbar 真正关心的派生值
- 方案 B（保底）：保留 trigger，但把 `transaction` 监听收紧到 `selectionUpdate` + `update`（doc update），过滤掉无关 transaction

- [x] 已修复（2026-07-20）：删除 `useEditorStateTrigger`，Toolbar 改用 `useEditorState`，每个 leaf 按钮各自订阅自身 isActive

---

### P0-2 `useEditor` 没设 `shouldRerenderOnTransaction: false`

**位置**：`packages/editor-main/src/hooks/useTiptapWithSync.ts:26-35`

**问题**：
- 既没设 `immediatelyRender`，也没设 `shouldRerenderOnTransaction`
- 默认行为是每个 transaction 都重渲染 `EditorContent` 所在的组件树
- 与 P0-1 叠加 = 双重重渲染

**官方依据**：v2.5+ 提供这两个 option 正是为了让用户接管渲染时机。

**修复方向**：
```ts
useEditor({
  ...,
  immediatelyRender: false,              // 避免 SSR/首屏 flushSync 警告
  shouldRerenderOnTransaction: false,    // 让 useEditorState 接管
});
```
**前提**：所有依赖 editor state 的子组件都用 `useEditorState` 订阅（与 P0-1 一并改造）。

- [x] 已修复（2026-07-20）：`useTiptapWithSync` 加 `shouldRerenderOnTransaction: false`。**未**加 `immediatelyRender: false` —— 该选项会让首次渲染时 editor 为 null，破坏 TableBubbleMenu 等假设 editor 非 null 的组件；纯 CSR 项目无收益，详见 P0-2 注意事项。

---

## 🟠 P1

### P1-1 编辑器根组件混入无关 UI

**位置**：`packages/editor-main/src/root.tsx:208-231`

**问题**：同一个组件里塞了：
- `EditorToolbar`
- `EditorContent` + `OutlineView`
- `MessageContainer`
- `TableBubbleMenu`
- `EditorFilePreview`

外加 `useIntlLoaded`、`initialFeaturesRef`、`useEditorProps` 等 state。父级任一 props 变化，整棵树都走 reconciliation。

**官方依据**：文档第 1 节「Isolate the editor in a separate component」。

**修复方向**：把 `EditorContent` 抽成独立子组件（只接收 editor 实例），其余 UI 各自独立组件，靠 Context 拿 editor。

- [x] 已修复（2026-07-24）：root.tsx 拆出三个 `memo` 化子组件 —— `EditorStage`（EditorContent + OutlineView）、`BubbleLayer`（TableBubbleMenu）、`FilePreviewLayer`（EditorFilePreview），均只接收 `editor` 实例（EditorStage 额外接 `autoFocus` / `isOutlineEnabled`）。同时给 `@textory/context` 的 `EditorProvider` 用 `useMemo` 包裹 context value，避免 provider 父级 re-render 时（例如 `isTitleFocused` 切换）所有 `useEditorContext` 消费者跟随重渲染。`EditorToolbar` 与 `DocTitle` 保留在 root 中 —— 前者消费 `isTitleFocused`，后者生产。

---

### P1-2 `onUpdate` 回调直接触发外部 setState（flushSync 风险）

**位置**：
- `packages/editor-main/src/root.tsx:154-160` — `onChange?.(editor.getHTML())`
- `packages/extension-outline/src/OutlineView.tsx` — `editor.on('update', syncData)` → `setTreeData`
- `packages/extension-table/src/components/tableBubbleMenu/index.tsx` — `shouldShow` 里直接 `setSelectedState`

**问题**：Tiptap 同步 dispatch，回调里直接 setState 可能撞上 React 渲染周期，触发 flushSync 警告。

**官方依据**：文档第 5 节「Avoid the flushSync warning」。

**修复方向**：在 `onChange` 外层包 `queueMicrotask`，或在文档里要求调用方自行包裹。

- [ ] 未修复

---

### P1-3 extensions 数组每次渲染都新建

**位置**：`packages/editor-main/src/root.tsx:87` + `packages/editor-main/src/hooks/useTiptapWithSync.ts:69-78`

**问题**：
- `extensions` 在 `root.tsx:87` 每次 render 重建
- 传入 `useTiptapWithSync` 后，useEffect (`useTiptapWithSync.ts:69`) 依赖 `[extensions, editor]`
- 引用一变就调 `editor.setOptions({ extensions })` —— 这是**全量重建 schema** 的昂贵操作
- 实际上 features 只在 mount 时生效（`root.tsx:193-197` 有警告），extensions 完全可以一次定型

**修复方向**：用 `useMemo` 包裹 extensions 数组，依赖项只放真正影响配置的值。

- [ ] 未修复

---

## 🟡 P2

### P2-1 OutlineView 滚动计算开销

**位置**：`packages/extension-outline/src/OutlineView.tsx`

**问题**：
- 每次 editor update 同步整棵树
- 滚动时对每个 heading 调 `getBoundingClientRect()` + DOM 查询
- heading 多时（>50）会明显卡顿

**修复方向**：
- `editor.on('update')` 里的 `setTreeData` 包 `queueMicrotask`
- heading 数量超阈值时启用虚拟列表
- `convertOutlineToTree` memo 化

- [ ] 未修复

---

### P2-2 React NodeView 使用情况

**位置**：
- `packages/extension-code-block/src/CodeBlockNodeView.tsx`（React）
- `packages/extension-image/src/ImageView.tsx`（React）
- `packages/extension-task-item/src/task-item.ts:100`（原生 ✅）
- `packages/extension-table/src/components/table/TableView.ts:53`（原生 ✅）

**问题**：文档里代码块数量多时，React NodeView 的同步渲染开销会累积。

**修复方向**：CodeBlock 考虑改写成原生 NodeView（外层 DOM，高亮区按需 React）。Image 数量通常少，保留 React 即可。

- [ ] 未修复

---

### P2-3 全代码库零 `React.memo`

**位置**：所有 ToolbarItem 子组件（Bold / Italic / Underline / Strike 等）

**问题**：父级 Toolbar 一重渲染，所有按钮全部跟随。

**修复方向**：给纯展示型按钮加 `React.memo`，配合 P0-1 改造后收益最大化。

- [ ] 未修复

---

### P2-4 HighlightPickerDropdown 检查错位（疑似 bug）

**位置**：`packages/editor-toolbar/src/components/HighlightColorPicker/highlightPickerDropdown.tsx:25`

```ts
// 下拉菜单点击设置的是 highlight，但激活态判断用的是 textStyle
onClick: editor.chain().focus().setHighlight({color}).run();
{editor.isActive('textStyle', { color }) && <Iconfont .../>}
```

**问题**：高亮色块上的「当前选中」勾选位置错乱 —— 因为它比的是 textStyle 的 color（文字颜色），不是 highlight 颜色。

**修复方向**：改成 `editor.isActive('highlight', { color })`。P0 性能改造时保留原行为，bug 单独修。

- [ ] 未修复

---

## 🟢 P3

### P3-1 content 全量字符串比较

**位置**：`packages/editor-main/src/hooks/useTiptapWithSync.ts:49`

`editor.getHTML()` 与 content 做全量字符串比较，文档大时 O(n)。

**修复方向**：改成比较 JSON 引用或加 hash。

- [ ] 未修复

---

### P3-2 placeholder 同步开销

**位置**：`packages/editor-main/src/hooks/useTiptapWithSync.ts:65`

placeholder 同步通过 `dispatch(empty tr)` 触发重绘，开销不小。

**修复方向**：只在 placeholder 真的变化时才触发。

- [ ] 未修复

---

### P3-3 detectLanguage 阻塞粘贴

**位置**：`packages/extension-code-block/src/CodeBlock.ts:24-102`

粘贴时跑多个正则 + `lowlight.highlightAuto`，大文本粘贴会卡 UI。

**修复方向**：加长度阈值（>N 跳过自动检测），或丢 Web Worker。

- [ ] 未修复

---

## 修复记录

| 时间 | 问题 | 做法 | 提交 |
| ---- | ---- | ---- | ---- |
| 2026-07-20 | P0-1 + P0-2 | 删除 `useEditorStateTrigger`；Toolbar 与每个 leaf 按钮改用 `useEditorState`；`useTiptapWithSync` 加 `immediatelyRender: false` + `shouldRerenderOnTransaction: false` | （未提交） |
| 2026-07-24 | P1-1 | root.tsx 拆出 `EditorStage` / `BubbleLayer` / `FilePreviewLayer` 三个 `memo` 化子组件；`EditorProvider` 的 context value 用 `useMemo` 包裹 | （未提交） |
