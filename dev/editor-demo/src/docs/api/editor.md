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
| `transformContent` | `(json: JSONContent) => JSONContent` | — | JSON content 预处理钩子，在传入 Tiptap 前对 JSON 做清洗/转换，详见 [内容预处理](#内容预处理transformcontent) |

## 功能开关（features）

`features` 用于按需关闭某些可选功能。默认全部启用（opt-out），只需在不需要时显式置为 `false`。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `features.outline` | `boolean` | `true` | 是否启用文档大纲（含 `OutlineExtension` 与右侧大纲面板） |
| `features.fileUpload` | `boolean` | `true` | 是否启用文件附件（含 `FileExtension`、工具栏附件按钮与 paste/drop 上传） |

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

## 内容预处理（transformContent）

`transformContent` 是一个 JSON content 预处理钩子，在 content 传入 Tiptap 前对 JSON 做清洗/转换。

### 调用时机

| 时机 | 触发 |
| --- | --- |
| 初始 mount | `<Editor content={json} />` 的初始 content |
| content prop 变化 | 外部重新传入 content 触发的 `setContent` |

> [!NOTE]
> 仅对 **JSON 形式的 content** 调用。HTML 字符串直通（ProseMirror 的 DOMParser 会自动忽略未知标签，不需要此钩子）。

### 用途

- **旧编辑器数据迁移**：旧数据含新 schema 不再支持的节点类型，过滤后避免白屏
- **字段重命名**：如简道云风格的 `attrs.link` → 编辑器原生 `attrs.href`
- **业务侧清洗**：XSS 过滤、白名单字段、节点降级（如 tableCell 之外的段落提到 doc 顶层）

### 示例：过滤未知节点

利用 Tiptap 内置 `rewriteUnknownContent(json, schema)`，schema 不识别的 node/mark 会被静默丢弃或降级为段落：

```jsx
import Editor, {useRef} from '@textory/editor';
import {rewriteUnknownContent} from '@tiptap/core';

function App() {
  const ref = useRef(null);
  return (
    <Editor
      ref={ref}
      content={legacyJson}
      transformContent={json => {
        const schema = ref.current?.editor?.schema;
        if (!schema) return json; // editor 就绪前 schema 还没构造
        const result = rewriteUnknownContent(json, schema);
        return result.json ?? json;
      }}
    />
  );
}
```

### 示例：自定义字段重命名

```jsx
// 把 attrs.link 改名成 attrs.href
function remapLinkAttr(node) {
  if (node.marks?.some(m => m.type === 'link' && m.attrs?.link)) {
    node.marks = node.marks.map(m =>
      m.type === 'link'
        ? {...m, attrs: {href: m.attrs.link ?? m.attrs.href, ...m.attrs}}
        : m
    );
  }
  if (node.content) node.content = node.content.map(remapLinkAttr);
  return node;
}

<Editor content={oldJson} transformContent={remapLinkAttr} />
```

### 错误兜底

钩子内部抛错会被 try-catch 兜住，回退到原始 content 并打 `console.warn`，不会让编辑器白屏。

### 已知限制

- **初始 content 的白屏风险**：editor 创建前的首次 `transformContent` 调用时 `ref.current?.editor` 为 null，无法访问 `editor.schema`。若初始 JSON 含未知 node 类型，Tiptap 内部 `Node.fromJSON` 仍可能抛错导致白屏。建议在传入 content 前先用纯 JSON 递归过滤兜底，或把 content 转成 HTML 字符串（DOMParser 自身能容错）。
- 后续 `setContent` 调用时 editor 已就绪，`editor.schema` 可用，能正常做 schema-aware 过滤。

## 图片相关（imageProps）

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `imageProps.max` | `number` | `0` | 单次最多上传张数（0 = 不限） |
| `imageProps.minWidth` | `number` | `100` | 最小宽度（px） |
| `imageProps.minHeight` | `number` | `100` | 最小高度（px） |
| `imageProps.maxFileSize` | `number` | `500` | 单张最大体积（KB） |
| `imageProps.onImageBeforeUpload` | `(file, fileList) => boolean` | — | 上传前校验，返回 `false` 取消 |
| `imageProps.onImageStartUpload` | `() => void` | — | 单张图开始上传时触发 |
| `imageProps.onImageEndUpload` | `() => void` | — | 单张图上传完成（成功/失败均触发） |
| `imageProps.onImageUpload` | `(option) => void \| string \| Promise<string>` | — | 自定义上传函数，**推荐返回 URL**，详见 [图片上传](/docs/guide/image-upload) |
| `imageProps.onImagePaste` | `(url) => Promise<{data:{id,url}}>` | — | 粘贴网络图片时的远程抓取回调 |

## 文件附件相关（fileProps）

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `fileProps.accept` | `string` | `'*'` | 工具栏文件选择框的 accept 属性 |
| `fileProps.maxFileSize` | `number` | `51200` | 单个文件最大体积（**KB**），50MB |
| `fileProps.onFileBeforeUpload` | `(file, fileList) => boolean` | — | 上传前校验，返回 `false` 取消 |
| `fileProps.onFileStartUpload` | `() => void` | — | 单个文件开始上传时触发 |
| `fileProps.onFileEndUpload` | `() => void` | — | 单个文件上传完成（成功/失败均触发） |
| `fileProps.onFileUpload` | `(option) => void \| string \| Promise<string>` | — | 自定义上传函数，**推荐返回 URL**，详见 [文件上传](/docs/guide/file-upload) |

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
    maxFileSize: 500, // KB
  },
  fileProps: {
    accept: '*',
    maxFileSize: 51200, // KB，50MB
  },
  features: {
    outline: true,
    fileUpload: true,
  },
}
```

## 类型定义

完整类型见 [类型定义](/docs/api/types)。

