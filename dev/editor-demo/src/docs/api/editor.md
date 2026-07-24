---
title: Editor 组件
category: API 参考
order: 1
description: Editor 组件所有 props 与事件
---

# `<Editor>` API

主入口组件，所有编辑器能力的统一对外接口。

```jsx
import Editor from '@textory/editor';
```

## 基础 Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string \| object` | `''` | 初始内容（HTML 字符串或 ProseMirror JSON） |
| `editable` | `boolean` | `true` | 是否可编辑 |
| `placeholder` | `string` | `'请输入'` | 空内容占位符 |
| `onChange` | `(content: { html: string, json: JSONContent }, title: string) => void` | — | 内容变更回调，同时返回 HTML 与 ProseMirror JSON；`title` 为标题输入框当前值（仅在启用 `titleProps.showTitle` 时有意义） |
| `title` | `string` | — | 文档标题（影响导出文件名） |
| `className` | `string` | — | 容器 className |
| `style` | `CSSProperties` | — | 容器样式 |
| `autoFocus` | `boolean \| 'start' \| 'end'` | `false` | 是否自动聚焦 |
| `features` | `FeatureFlags` | `{ outline: true }` | 可选功能的启用/停用开关，详见 [功能开关](#功能开关features) |

## 功能开关（features）

`features` 用于按需关闭某些可选功能。默认全部启用（opt-out），只需在不需要时显式置为 `false`。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `features.outline` | `boolean` | `true` | 是否启用文档大纲（含 `OutlineExtension` 与右侧大纲面板） |

```jsx
// 关闭文档大纲：右侧不会出现大纲面板
<Editor
  content="<h1>关闭大纲示例</h1><p>右侧不会出现大纲面板。</p>"
  editable
  features={{ outline: false }}
/>
```

> [!IMPORTANT]
> `features` **仅在编辑器 mount 时生效**。Tiptap 的扩展集合在创建 editor 时固定，运行时修改 `features` 不会重新加载扩展。
>
> 开发环境下修改 `features` 会触发 `console.warn` 提醒。如需运行时切换，请给 `<Editor>` 加 `key` 强制 remount：
>
> ```jsx
> const [outlineOn, setOutlineOn] = useState(true);
>
> <Editor
>   key={outlineOn ? 'with-outline' : 'no-outline'}
>   features={{ outline: outlineOn }}
> />
> ```
>
> 注意 remount 会重置 undo/redo 历史与光标位置，仅适合真正需要切换的场景。

## 图片相关（imageProps）

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `imageProps.max` | `number` | `0` | 单次最多上传数量（0 = 不限） |
| `imageProps.minWidth` | `number` | `100` | 最小宽度 |
| `imageProps.minHeight` | `number` | `100` | 最小高度 |
| `imageProps.onImageUpload` | `(option) => void` | — | 自定义上传函数 |

## 导出相关（exportProps）

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `exportProps.watermark` | `IExportWatermark` | — | 水印配置 |
| `exportProps.watermark.text` | `string` | — | 水印文字 |
| `exportProps.watermark.fontSize` | `number` | `52` | 字号（pt） |
| `exportProps.watermark.color` | `string` | — | 颜色 |
| `exportProps.watermark.opacity` | `number` | — | 透明度 |

## EditorRef 方法

通过 `useRef<EditorRef>(null)` 拿到 ref，可以调用：

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `export` | `(options?: ExportOptions) => Promise<void>` | 导出 DOCX |

示例：

<code src="demo/demo1.tsx"></code>

## 默认值兜底

未传入的 prop 会按下列默认值兜底：

```ts
{
  placeholder: '请输入',
  editable: true,
  imageProps: {
    max: 0,
    minWidth: 100,
    minHeight: 100,
  },
  features: {
    outline: true,
  },
}
```

## 类型定义

完整类型见 [类型定义](/docs/api/types)。

