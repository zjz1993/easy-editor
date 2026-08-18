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

图片插入、上传与预览。上传基建（进度插件、paste/drop 分发）已抽出到 `@textory/extension-upload`，由 `@textory/editor` 在内部统一注册。

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `max` | `number` | `0` | 单次上传上限 |
| `minWidth` | `number` | `100` | 最小宽度限制 |
| `minHeight` | `number` | `100` | 最小高度限制 |
| `maxFileSize` | `number` | `500` | 单张最大体积（KB） |
| `onImageUpload` | `(option) => void` | — | 自定义上传通道，详见 [图片上传](/docs/guide/image-upload) |

## @textory/extension-file

文件附件节点 + 上传，序列化为 `<a href download>`。

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `accept` | `string` | `'*'` | 文件选择框 accept |
| `maxFileSize` | `number` | `51200` | 单个文件最大体积（KB），50MB |
| `onFileUpload` | `(option) => void` | — | 自定义上传通道，详见 [文件上传](/docs/guide/file-upload) |

提供 3 个命令：`setFile(attrs)`、`updateFileById(id, attrs)`、`updateFileByUploadKey(uploadKey, attrs)`。

## @textory/extension-video

视频节点（block 级），统一渲染为 `<video controls src poster>`。本地上传与网络视频走同一个 `<video>` 元素，浏览器按 src 指向的 codec/protocol 处理。

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `accept` | `string` | `'.mp4,.webm,.mov,.m4v'` | 视频选择框 accept |
| `maxFileSize` | `number` | `102400` | 单个视频最大体积（KB），100MB |
| `onVideoUpload` | `(option) => void \| string \| Promise<string>` | — | 视频自定义上传通道 |
| `onPosterUpload` | `(option) => void \| string \| Promise<string>` | — | 封面图自定义上传通道。用户在工具栏点击「设为封面」抓取当前播放帧后触发；不配置则降级为 base64 dataURL |

### 封面（poster）能力

- **网络视频弹窗**支持可选「封面地址」字段，粘贴图片 URL 直接写入 `attrs.poster`
- **节点工具栏**提供「设为封面」/「清除封面」按钮：抓取当前播放帧 → PNG File → 调 `onPosterUpload` 上传 → URL 写入 `attrs.poster`
- 跨域视频抓帧受浏览器 CORS 限制，需服务器返回 `Access-Control-Allow-Origin`

提供 3 个命令：`setVideo(attrs)`、`updateVideoById(id, attrs)`、`updateVideoByUploadKey(uploadKey, attrs)`。

> [!NOTE]
> 网络视频不会自动把观看页 URL 转换为可播放地址，请直接粘贴平台支持直接播放的 URL。

## @textory/extension-upload

image、file、video 共享的上传基建包：

- 进度状态插件（`uploadPluginKey` / 兼容别名 `attachmentUploadPluginKey`）
- paste/drop 分发器（按 MIME 分流到 `imgUploader` / `fileUploader` / `videoUploader`）
- 工具函数：`updateUploadProgress(editor, key, percent)`、`removeUploadProgress(editor, key)`

通常**不需要单独引入**，`@textory/editor` 内部已注册一次。仅在自定义集成时按需引入。

## @textory/extension-indent

段落缩进，通过工具栏按钮或快捷键（Tab）触发。

## @textory/extension-link

超链接，支持工具栏添加 / 编辑链接。

## @textory/extension-markdown

Markdown 粘贴 / 输入支持。由 `features.markdown` 门控（默认开启），内部组合官方 `@tiptap/markdown`：

- **粘贴转换**：纯文本剪贴板命中 Markdown 特征语法时自动解析为富文本（标题、列表、任务清单、引用、代码块、链接、图片、分割线、GFM 表格）；
- **输入规则**：补齐行内链接 `[text](url)` + 空格 触发转换；
- **schema 映射**：把官方解析产物的默认节点名映射到 Textory 自研命名（`unorderedList` / `checkList` / `divider` 等），并过滤非法 scheme 的链接与图片。

| 导出 | 说明 |
| --- | --- |
| `MarkdownPaste` | 粘贴管线扩展（含输入规则），随 `features.markdown` 挂载 |
| `MarkdownListHandler` | 列表 token 高优先级处理器，产出 Textory 列表节点名 |
| `isMarkdownLike(text)` | 严格启发式检测纯函数 |
| `convertMarkdownToContent(manager, text)` | 检测 → 解析 → 映射 管线纯函数 |

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
