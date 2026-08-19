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
| `onChange` | `(content: { html: string, json: JSONContent }, title: string) => void` | — | 内容变更回调，同时返回 HTML 与 ProseMirror JSON；`title` 为标题输入框当前值（仅在启用 `titleProps.showTitle` 时有意义）。回调按 300ms 防抖触发（输入停顿后执行一次），编辑器失焦与 `getData()` 时会立即 flush，不会丢最后一次输入 |
| `title` | `string` | — | 文档标题（影响导出文件名） |
| `className` | `string` | — | 容器 className |
| `style` | `CSSProperties` | — | 容器样式 |
| `autoFocus` | `boolean \| 'start' \| 'end'` | `false` | 是否自动聚焦 |
| `features` | `FeatureFlags` | `{ outline: true }` | 可选功能的启用/停用开关，详见 [功能开关](#功能开关features) |
| `transformContent` | `(json: JSONContent) => JSONContent` | — | JSON content 预处理钩子，在传入 Tiptap 前对 JSON 做清洗/转换，详见 [内容预处理](#内容预处理transformcontent) |
| `onEditorReady` | `(editor: Editor) => void` | — | 内部 Tiptap Editor 实例就绪后触发一次。一般 React 项目无需使用（拿 editor 走 `useEditorInstance()`），主要给 UMD 桥接层（`@textory/standalone`）等非 React 集成场景用 |

## 功能开关（features）

`features` 用于按需关闭某些可选功能。默认全部启用（opt-out），只需在不需要时显式置为 `false`。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `features.outline` | `boolean` | `true` | 是否启用文档大纲（含 `OutlineExtension` 与右侧大纲面板） |
| `features.fileUpload` | `boolean` | `true` | 是否启用文件附件（含 `FileExtension`、工具栏附件按钮与 paste/drop 上传） |
| `features.videoUpload` | `boolean` | `true` | 是否启用视频（含 `VideoExtension`、工具栏视频按钮与 paste/drop 上传） |
| `features.markdown` | `boolean` | `true` | 是否启用 Markdown 支持（纯文本粘贴自动转换 + `[text](url)` 输入规则 + `getMarkdown()` 序列化，详见 [Markdown 支持](#markdown-支持)） |

```jsx
// 关闭文档大纲：右侧不会出现大纲面板
<Editor
  content="<h1>关闭大纲示例</h1><p>右侧不会出现大纲面板。</p>"
  editable
  features={{ outline: false }}
/>
```

```jsx
// 关闭 Markdown 粘贴转换：粘贴纯文本保持原样
<Editor
  content="<h1>关闭 Markdown 示例</h1><p>粘贴 Markdown 文本不再自动转换。</p>"
  editable
  features={{ markdown: false }}
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

## Markdown 支持

由 `features.markdown`（默认 `true`）控制，基于官方 `@tiptap/markdown` 扩展，包含三块能力：

### 1. 粘贴自动转换

从 Typora、VSCode、GitHub、AI 对话窗口等来源复制 Markdown 文本，粘贴到编辑器时自动转换为富文本：

| Markdown 语法 | 转换结果 |
| --- | --- |
| `# 标题` ~ `###### 标题` | H1–H6 |
| `**加粗**` / `*斜体*` / `~~删除线~~` / `==高亮==` | 对应文字标记 |
| `` `行内代码` `` | 行内代码 |
| `- 列表` / `1. 列表` | 无序 / 有序列表（支持嵌套） |
| `- [ ] 任务` / `- [x] 任务` | 任务清单（勾选状态保留） |
| `> 引用` | 引用块 |
| ` ```lang 代码块 ``` ` | 代码块（保留语言标注） |
| `[文字](https://...)` | 超链接 |
| `![图片](https://...)` | 图片（仅接受 http/https 外链） |
| `---` | 分割线 |
| GFM 表格 `\| a \| b \|` | 表格 |

行为边界：

- 剪贴板带富文本 HTML（从网页 / Word 复制）时不做转换，走原有 HTML 粘贴路径；
- 纯文本但无任何 Markdown 特征语法时保持原样粘贴；
- 代码块内粘贴保持纯文本；
- 转换插入为单事务，一次 Ctrl/Cmd+Z 可整体撤销；
- 链接与图片仅接受 `http(s)` 协议，`javascript:` 等非法 scheme 会被剥离（与链接输入校验策略一致）。

### 2. 输入规则

边打字边转：`# ` + 空格变标题、`- [ ] ` 变任务清单等由 Tiptap 内建规则支持；本功能额外补齐了行内链接——输入 `[文字](https://example.com)` + 空格，自动转为链接文本。

### 3. 序列化（getMarkdown）

挂载后 Tiptap 实例获得 Markdown 输出能力（任务清单会序列化为 `- [x] ...`）：

```ts
// 从 useEditorInstance() 或 ref 拿到 editor 实例
const md = editor.getMarkdown();

// 以 Markdown 作为初始内容 / 插入内容
editor.commands.setContent('# 标题\n\n正文', {contentType: 'markdown'});
editor.commands.insertContent('**加粗** 文本', {contentType: 'markdown'});

// 更底层的 parse / serialize
const json = editor.markdown.parse('# Hello');
const mdText = editor.markdown.serialize(editor.getJSON());
```

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

## 视频相关（videoProps）

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `videoProps.accept` | `string` | `'.mp4,.webm,.mov,.m4v'` | 工具栏视频选择框的 accept 属性 |
| `videoProps.maxFileSize` | `number` | `102400` | 单个视频最大体积（**KB**），100MB |
| `videoProps.onVideoBeforeUpload` | `(file, fileList) => boolean` | — | 上传前校验，返回 `false` 取消 |
| `videoProps.onVideoStartUpload` | `() => void` | — | 单个视频开始上传时触发 |
| `videoProps.onVideoEndUpload` | `() => void` | — | 单个视频上传完成（成功/失败均触发） |
| `videoProps.onVideoUpload` | `(option) => void \| string \| Promise<string>` | — | 视频自定义上传函数，**推荐返回 URL** |
| `videoProps.onPosterUpload` | `(option) => void \| string \| Promise<string>` | — | 封面图自定义上传函数，**推荐返回 URL**。仅在用户点击工具栏「设为封面」抓帧后触发；未配置则封面以 base64 dataURL 形式存入文档 JSON（不推荐用于生产） |

视频节点统一渲染为 `<video controls src poster>`，支持两种来源：

- **本地上传**：通过工具栏「上传本地视频」或拖拽/粘贴视频文件触发。
- **网络视频**：通过工具栏「插入网络视频」弹窗填写视频地址插入。弹窗同时支持可选的「封面地址」字段，填写后直接写入 `<video poster>`。

### 封面（poster）的三种来源

1. **网络视频弹窗贴 URL** — 在「插入网络视频」弹窗的「封面地址」输入框粘贴图片 URL，提交后直接写入 `attrs.poster`。
2. **工具栏抓帧上传** — 视频节点选中后 hover 出工具栏，点击「设为封面」(image 图标) 抓取当前播放帧 → 转为 PNG File → 调用 `onPosterUpload` 上传 → 返回 URL 写入 `attrs.poster`。点击「清除封面」(close 图标) 可移除。
3. **降级 dataURL** — 若未配置 `onPosterUpload`，抓取的帧会以 base64 dataURL 直接存入文档 JSON。大视频高分辨率帧会生成数 MB 字符串，拖累编辑器性能，**生产环境建议配置 `onPosterUpload`**。

> [!NOTE]
> 跨域视频抓帧受浏览器 CORS 限制：服务器需返回 `Access-Control-Allow-Origin` 头才能成功捕获。完全无 CORS 的跨域视频无法生成封面，会弹出 `video.poster.capture.failed` 提示。

> [!NOTE]
> 网络视频不会自动把观看页 URL（如 `https://www.bilibili.com/video/BV1xx`）转换为可播放 URL。请粘贴对应平台支持直接播放的地址。

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
  videoProps: {
    accept: '.mp4,.webm,.mov,.m4v',
    maxFileSize: 102400, // KB，100MB
  },
  features: {
    outline: true,
    fileUpload: true,
    videoUpload: true,
  },
}
```

## 类型定义

完整类型见 [类型定义](/docs/api/types)。

