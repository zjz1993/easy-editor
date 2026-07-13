---
title: 快速开始
category: 指南
order: 1
description: 三步接入 Textory 编辑器
---

# 快速开始

本篇带你用最短时间在项目里跑起 Textory 编辑器。

## 安装

Textory 把样式与 JS 拆开发布：

```bash
pnpm add @textory/editor react react-dom
```

> [!NOTE]
> React 与 Tiptap 系列作为 peerDependency 自动共享，请确保项目里只装一份 React，否则 hooks 会失效。

## 引入样式

在项目入口（如 `main.tsx`、`App.tsx`）顶部引入主题样式：

```ts
import '@textory/editor/theme/normal.css';
```

## 最小示例

```jsx
import Editor from '@textory/editor';
import '@textory/editor/theme/normal.css';

render(
  <Editor
    content="<h1>你好，Textory</h1><p>开始你的创作...</p>"
    placeholder="写点什么"
    editable
    outputHTML
    onChange={(data) => console.log(data)}
  />
);
```

## 接下来

- 想了解常用 props？看 [基本用法](/docs/guide/usage)
- 想自定义扩展？看 [扩展包接入](/docs/guide/extensions)
- 想导出 Word？看 [导出能力](/docs/guide/export)
