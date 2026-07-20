# Tiptap 性能优化指南（基于官方文档）

> 来源：https://tiptap.dev/docs/guides/performance
>
> 本文件是 Claude Code 在本仓库协作时的必读参考。任何涉及编辑器集成的改动，都应优先对照本文检查是否会引入重渲染/同步类性能问题。

## 核心原则

Tiptap 本身性能足够（能编辑整本书），性能问题几乎都出在**集成方式**上。最常见的问题：**编辑器被频繁重渲染**。

---

## 1. 把编辑器隔离到独立组件

`useEditor` 默认会在每次 transaction 时触发重渲染。所以：

- ✅ 编辑器（以及依赖 editor 实例的子组件）应放在**独立组件**中
- ❌ 不要把编辑器和无关 UI（侧边栏、菜单等）塞在同一个组件里
- 父组件的任何 state 变化都会拖累整个编辑器子树重渲染

**正面示例**：

```tsx
const TiptapEditor = () => {
  const editor = useEditor({ extensions, content });
  return (
    <>
      <EditorContent editor={editor} />
      <MenuComponent editor={editor} />
    </>
  );
};
```

**反面示例**：

```tsx
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const editor = useEditor({ extensions, content });
  return (
    <>
      <UnrelatedSidebar onChange={setSidebarOpen} />
      <EditorContent editor={editor} />
      <Sidenav isSidebarOpen={sidebarOpen}>...</Sidenav>
    </>
  );
};
```

## 2. 用 `useEditorState` 精确订阅

避免直接监听 `transaction` 强制重渲染。改用 `useEditorState` + selector，Tiptap 内部会做 deep compare，只在选中值真正变化时重渲染。

```tsx
const editorState = useEditorState({
  editor,
  selector: ({ editor }) => ({
    isBold: editor.isActive('bold'),
    isItalic: editor.isActive('italic'),
  }),
});
```

## 3. `immediatelyRender` 与 `shouldRerenderOnTransaction`（v2.5+）

- `immediatelyRender: false` — 关闭首次同步渲染，避免 SSR / 首屏 flushSync 警告
- `shouldRerenderOnTransaction: false` — 关闭默认的「每个 transaction 都重渲染」行为，由 `useEditorState` 接管

```tsx
const editor = useEditor({
  extensions,
  content,
  immediatelyRender: false,
  shouldRerenderOnTransaction: false,
});
```

### ⚠️ `immediatelyRender: false` 的代价

该选项会把 editor 创建推迟到 `useEffect`，**首次渲染时 `editor` 为 `null`**。如果项目里任何子组件直接假设 editor 非 null（如 `editor.state.selection`），就会报 `Cannot read properties of null`。

是否启用要看情况：

| 场景 | 建议 |
| --- | --- |
| SSR（Next.js / Remix / Nuxt 等） | **必须** `immediatelyRender: false`，并给所有子组件加 null 判断 |
| 纯 CSR + 已有完整 null-safe 代码 | 推荐 `immediatelyRender: false`，避免首屏 flushSync 警告 |
| 纯 CSR + 历史代码假设 editor 非 null | **不要**启用，先用 `shouldRerenderOnTransaction: false` 拿到主要收益，等代码改造完再说 |

Easy Editor（本仓库）属于第三种：`TableBubbleMenu`、`OutlineView`、`EditorFilePreview` 等都假设 editor 非 null，所以 `useTiptapWithSync` 只设了 `shouldRerenderOnTransaction: false`。

## 4. React NodeView 的代价

NodeView 要求**同步渲染**，每个实例都要 new 一个 DOM 节点并挂载 React 组件。一个文档里如果有大量同类 NodeView（如几十个代码块），开销会显著累积。

- 文档里出现频次高的 NodeView 优先用**原生 ProseMirror NodeView**（class 实现）
- 频次低的可以保留 React NodeView 以换取开发效率

## 5. 避免 `flushSync was called from inside a lifecycle method` 警告

Tiptap 同步 dispatch transaction。如果在 `onUpdate` / `onTransaction` 等回调里直接 `setState`，可能撞上 React 渲染周期，触发 flushSync 警告甚至性能问题。

**解法**：用 `queueMicrotask` 把更新推到当前同步流程之后。

```tsx
const editor = useEditor({
  onUpdate() {
    queueMicrotask(() => setState('new state'));
  },
});
```

---

## 调试技巧

- React DevTools Profiler 查看重渲染原因
- 在编辑器组件里 `console.count('editor render')`，观察重渲染频率
- 如果重渲染次数 > 预期，按顺序排查：
  1. 是否因为父组件 state 变化导致
  2. 是否有无关 state 没有隔离
  3. 是否可以用 `useEditorState` 精确订阅
