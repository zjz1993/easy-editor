---
title: Standalone API
category: API
order: 3
description: Textory.create 工厂与 instance 句柄
---

# `@textory/standalone` API

UMD bundle 暴露的全局对象 `window.Textory` 与 npm 安装类型后 `import { Textory } from '@textory/standalone'` 等价。

## `Textory.create(element, options)`

创建一个编辑器实例,挂载到指定 DOM。

### 参数

| 名称 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `element` | `HTMLElement` | 是 | 挂载容器。多次 create 同一 element 行为未定义,请先 `destroy()` 旧的。 |
| `options` | [`TextoryOptions`](#textoryoptions) | 否 | 配置项 |

### 返回

[`TextoryInstance`](#textoryinstance) —— 同步返回,但内部 Tiptap editor 可能尚未就绪(`instance.editor === null`)。命令方法会自动排队,`onCreate` 触发后 flush。

## `TextoryOptions`

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `content` | `string \| JSONContent` | `''` | 初始内容(HTML 字符串或 Tiptap JSON) |
| `editable` | `boolean` | `true` | 是否可编辑 |
| `placeholder` | `string` | `'请输入'` | 占位提示 |
| `autoFocus` | `boolean` | `false` | 是否自动聚焦 |
| `title` | `string` | — | 标题(若 `titleProps.showTitle` 开启) |
| `features` | [`FeatureFlags`](./types.md#featureflags) | 全开 | 功能开关。仅在 mount 时生效,运行时修改不重载扩展 |
| **回调** | | | |
| `onChange` | `(html: string) => void` | — | 内容变化时触发(简化签名,仅 html) |
| `onCreate` | `() => void` | — | 编辑器就绪后触发 |
| `onFocus` | `() => void` | — | |
| `onBlur` | `() => void` | — | |
| `onError` | `(error: Error) => void` | — | 内部未捕获异常时触发 |
| **上传(双轨)** | | | |
| `upload` | [`UploadAdapters`](#uploadadapters) | — | 简化版,传 File 返 URL |
| `imageProps` | `Partial<IImageProps>` | — | 完整配置,与 React 版一致;同时设置时优先于 `upload.image` |
| `videoProps` | `Partial<IVideoProps>` | — | 同上 |
| `fileProps` | `Partial<IFileProps>` | — | 同上 |
| **其他(透传)** | | | |
| `exportProps` | `Partial<ExportProps>` | — | 导出 word 配置 |
| `titleProps` | `Partial<ITitleProps>` | — | 标题配置 |
| `className` | `string` | — | 容器 className |
| `style` | `CSSProperties` | — | 容器 style |
| `transformContent` | `(json: JSONContent) => JSONContent` | — | JSON content 预处理钩子 |

## `UploadAdapters`

```ts
interface UploadAdapters {
  image?: (file: File) => string | Promise<string>;
  video?: (file: File) => string | Promise<string>
                              | { url: string; poster?: string }
                              | Promise<{ url: string; poster?: string }>;
  file?: (file: File) => string | Promise<string>;
}
```

适合 80% CDN 场景。需要 progress / 多文件 / 错误细粒度控制时,走 `imageProps` / `videoProps` / `fileProps` escape hatch。

## `TextoryInstance`

### 基础命令

| 方法 | 返回 | 说明 |
|------|------|------|
| `getHTML()` | `string` | 当前 HTML |
| `setHTML(html)` | `void` | 替换内容。直接调 Tiptap `setContent`,跳过 React state 同步链路 |
| `getJSON()` | `JSONContent` | 当前 Tiptap JSON |
| `setJSON(json)` | `void` | 替换内容(JSON 形态) |
| `focus()` | `void` | 聚焦 |
| `blur()` | `void` | 失焦 |
| `clear()` | `void` | 清空 |

### 动态更新

| 方法 | 说明 |
|------|------|
| `setOptions(partial)` | 部分更新 options。等价 React 版改 props 触发 re-render。内部 setState 实现,所有可变字段都支持。 |

### 生命周期

| 方法 | 说明 |
|------|------|
| `destroy()` | 卸载编辑器,释放 React root + Tiptap 实例。之后再调用任何方法仅 `console.warn`,不 throw 不静默。 |

### Escape hatch

| 属性 | 类型 | 说明 |
|------|------|------|
| `editor` | `Editor \| null` | 原始 Tiptap `Editor` 实例。mount 完成前为 `null`,`destroy()` 后置为 `null`。**兼容性不保证跨 Tiptap 大版本**。 |

```js
const instance = Textory.create(el, {...});
// 等到 editor 就绪后(instance.editor 非 null):
instance.editor.chain().focus().toggleBold().run();
instance.editor.extensionManager.extensions;  // 自定义查询
```

## 时序

```
Textory.create(el, opts)
  │
  ├─ 同步返回 instance(instance.editor === null)
  ├─ ReactDOM.createRoot(el).render(<Container/>) (异步)
  │
  ├─ 用户调用 instance.setHTML(...) → push 到命令队列
  │
  ├─ React mount 完成
  ├─ Editor 组件 onEditorReady 触发
  ├─ instance.editor = editor
  ├─ flush 命令队列
  └─ opts.onCreate?.()
```

`setOptions` 与 `destroy` 立即生效,不排队。

## 失效保护

```js
const instance = Textory.create(el, {...});
instance.destroy();
instance.getHTML();  // console.warn: [Textory] instance destroyed; "getHTML" ignored
                     // 返回 undefined(不强 throw)
```

## 不支持的 API

以下 React 版字段在 UMD 版**不开放**:

- `extensions` —— 自定义 Tiptap 扩展追加。需要请走 `@textory/editor` npm 包。
- `locale` —— 仅中文 locale 实现,开放会让 UI 出现 key 字符串。

需要这些能力的高级场景,请使用 React 版 `<Editor>`。
