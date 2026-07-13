---
title: 扩展包 API
category: API 参考
order: 2
description: 各扩展包的 props 与配置项
---

# 扩展包 API

每个扩展包单独发布，可以独立引入。下面是各包的 props 与配置摘要。

## @textory/extension-bold

替换 StarterKit 默认的 Bold 实现，支持快捷键 `Cmd / Ctrl + B`。

无需额外配置，引入即用。

## @textory/extension-code-block

基于 [lowlight](https://github.com/highlightjs/lowlight) 的代码块，支持语法高亮。

```jsx
// 默认已启用，无需配置
```

支持的语言列表见 lowlight 文档。

## @textory/extension-image

图片插入、上传与预览。

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `max` | `number` | `0` | 单次上传上限 |
| `minWidth` | `number` | `100` | 最小宽度限制 |
| `minHeight` | `number` | `100` | 最小高度限制 |
| `onImageUpload` | `(option) => void` | — | 自定义上传通道 |

## @textory/extension-indent

段落缩进，通过工具栏按钮或快捷键（Tab）触发。

## @textory/extension-link

超链接，支持工具栏添加 / 编辑链接。

## @textory/extension-outline

文档大纲视图，根据 H1/H2/H3 自动生成可点击导航。

## @textory/extension-table

表格 + 浮动菜单（合并单元格、增删行列、列宽调整）。

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `resizable` | `boolean` | `true` | 列宽是否可调整 |

## @textory/extension-task-item

任务清单（带 checkbox）。

> [!NOTE]
> TaskItem 需要配合 TaskList 使用，Textory 已经默认组装好。

## 扩展包内部约定

所有扩展包：

- 继承对应的 Tiptap 基础扩展
- 默认导出配置好的 Extension
- `peerDependencies` 仅声明 `@tiptap/core` 与具体用到的 Tiptap 扩展
- 扩展 `name` 与 `@textory/editor-common` 的 `BLOCK_TYPES` 常量保持一致
