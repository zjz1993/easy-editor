---
title: 文档首页
category: 其他
order: 1
description: Textory 文档首页
---

# Textory 文档

欢迎来到 **Textory** 文档。Textory 是一个基于 [Tiptap](https://www.tiptap.dev/) 的模块化富文本编辑器，采用 TypeScript + pnpm workspaces 的 monorepo 架构。

## 核心能力

- **模块化扩展**：加粗、图片、表格、代码块、任务列表等均为独立包，按需组合
- **实时大纲**：自动根据标题生成可点击导航
- **导出 Word**：一键导出 DOCX，支持自定义水印
- **图片上传**：支持自定义上传通道与大小限制

## 从这里开始

| 文档 | 适合人群 |
| --- | --- |
| [快速开始](/docs/guide/start) | 第一次接入 Textory 的开发者 |
| [基本用法](/docs/guide/usage) | 想了解常用 props 的开发者 |
| [扩展包接入](/docs/guide/extensions) | 想按需开启/关闭扩展的开发者 |
| [导出能力](/docs/guide/export) | 想导出 Word 或图片的开发者 |
| [Editor API](/docs/api/editor) | 完整 props 与事件参考 |

> [!TIP]
> 想快速体验编辑器效果？前往 [演练场](/playground) 直接修改代码看实时预览。

## 三步上手

```jsx
// 1. 安装：pnpm add @textory/editor react react-dom
// 2. 引入样式：import '@textory/editor/theme/normal.css'
// 3. 使用：

render(
  <Editor
    content="<h1>你好，Textory</h1><p>开始你的创作...</p>"
    placeholder="写点什么"
    editable
    onChange={(content, title) => console.log(content.html, content.json, title)}
  />
);
```

## 包结构

| 包名 | 用途 |
| --- | --- |
| `@textory/editor` | 主入口，组合所有扩展 |
| `@textory/context` | React Context、类型、hooks |
| `@textory/editor-common` | 共享工具、常量、通用组件 |
| `@textory/editor-toolbar` | 模块化工具栏 |
| `@textory/styles` | 共享 SCSS 样式 |
| `@textory/extension-*` | 各类扩展（bold / table / image 等） |

## 外部示例

下面的示例来自独立文件 `demo/demo1.tsx`：

<code src="demo/demo1.tsx"></code>

更多问题见 [常见问题](/docs/faq)。
