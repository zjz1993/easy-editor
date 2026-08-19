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
- **文件附件**：独立 file 节点 + 文件上传，工具栏一键插入，DOCX 导出为超链接

## 从这里开始

| 文档 | 适合人群 |
| --- | --- |
| [快速开始](/docs/guide/start) | 第一次接入 Textory 的开发者 |
| [基本用法](/docs/guide/usage) | 想了解常用 props 的开发者 |
| [扩展包接入](/docs/guide/extensions) | 想按需开启/关闭扩展的开发者 |
| [图片上传](/docs/guide/image-upload) | 想自定义图片上传通道的开发者 |
| [文件上传](/docs/guide/file-upload) | 想接入文件附件的开发者 |
| [视频上传](/docs/guide/video-upload) | 想接入视频与封面的开发者 |
| [导出能力](/docs/guide/export) | 想导出 Word 或图片的开发者 |
| [Markdown 支持](/docs/guide/markdown) | 想粘贴 Markdown 自动转换 / 输出 Markdown 的开发者 |
| [性能与大文档](/docs/guide/performance) | 关心大文档打字卡顿、超大表格成本量化的开发者 |
| [`<script>` 标签引入](/docs/guide/script-tag) | 非 React 项目用 UMD bundle 直接挂编辑器 |
| [Standalone 在线示例](/docs/guide/standalone-demos) | 在文档里直接体验 5 个 UMD 用法 |
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
