---
title: 常见问题
category: 其他
order: 2
description: Textory 接入常见问题与排查思路
---

# 常见问题

## 安装与启动

### 报错 "Hooks can only be called inside the body of a function component"

通常是项目里装了多份 React。检查：

1. `node_modules` 里是否有多个 `react` 版本
2. pnpm workspaces 内部包是否正确使用 `workspace:^`
3. React / react-dom 是否放在 `peerDependencies`

> [!CAUTION]
> 多份 React 实例会导致 hooks 失效、Context 找不到。务必保证单实例。

### 样式没生效（编辑器一片白）

确认已经引入主题样式：

```ts
import '@textory/editor/theme/normal.css';
```

样式与 JS 拆分发布，单独 import JS 不会有视觉。

## 内容与编辑

### 修改 `content` 后用户输入被清空

`Editor` 内部监听 `content` 变化，外部更新会调用 `editor.commands.setContent()`，**替换**当前内容。如果你不希望外部更新覆盖用户编辑：

- 只在初始化时传入 `content`，之后不再变化
- 或通过 `useRef<EditorRef>` 拿到 editor 实例后用 imperative 方法控制

### `onChange` 拿到的内容形式

`onChange` 回调签名是 `(content, title) => void`：

- `content.html`：HTML 字符串，适合直接展示或粘贴到富文本邮件
- `content.json`：ProseMirror JSON，适合入库后无损回放（保留 node attrs 顺序、自定义 mark 等）
- `title`：文档标题输入框的当前值（仅在启用了 `titleProps.showTitle` 时有意义）

两种格式由同一份 ProseMirror doc 序列化得到，不需要切换开关。如果你只想要其中一种，直接忽略另一个字段即可。

### 任务列表不生效

任务列表需要 `<ul data-type="taskList"><li data-type="taskItem" data-checked="false">...</li></ul>` 这种结构。普通 `<ul><li>` 不会变成任务清单。

## 导出

### 导出 DOCX 报错

确认：

1. 编辑器实例已经渲染完成
2. `ref.current` 不为 `null`
3. 没有跨域图片（导出时图片需要可访问）

### 水印字体大小不生效

`watermark.fontSize` 的单位是 pt（磅），不是 px。1pt ≈ 1.333px。常用值：52（大）、32（中）、20（小）。

## 性能

### 大文档卡顿

- 关闭大纲扩展（`@textory/extension-outline`）
- 不要在 `onChange` 里做重计算
- 图片用懒加载占位，避免一次性渲染大量 `<img>`

### 工具栏按钮多导致换行

工具栏使用 `rc-overflow` 处理溢出，按钮过多会自动收起到「更多」下拉。

---

没找到你的问题？[提 issue](https://github.com/) 反馈。
