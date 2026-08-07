---
title: script 标签引入
category: 指南
order: 2
description: 非 React 项目通过 <script> 引入编辑器
---

# 通过 `<script>` 标签引入编辑器

不使用 npm/bundler，想在旧项目、静态站、CMS、Vue / Angular / 原生 JS 项目里直接挂一个编辑器？用 `@textory/standalone` 包提供的 UMD bundle。

## 适用场景

| 场景 | 推荐 |
|------|------|
| React / Next.js / Remix 项目 | 走 npm，用 [`@textory/editor`](./start.md) |
| Vue / Angular / Svelte / 原生 JS | ✅ `@textory/standalone` |
| 静态 HTML 页面、CMS 模板、低代码平台 | ✅ `@textory/standalone` |
| 后台管理系统想插一个富文本输入框 | ✅ `@textory/standalone` |

## 两份 bundle 怎么选

| 文件 | 体积（minified） | 适用 |
|------|------------------|------|
| `textory.standalone.min.js` | ~2.0 MB | 页面完全没有 React，单文件引入 |
| `textory.externals.min.js`  | ~1.9 MB | 页面已经有 React，共用一份省 ~100KB |

样式都需要额外引一份 `textory.min.css`。

> [!WARNING]
> **standalone bundle 自带 React**。如果你的页面已经有 React（哪怕是另一个组件用的），**不要用 standalone** —— 会形成双 React 实例，hooks 报错。这种场景用 externals 版或干脆走 npm。

## 最小可用示例

新建一个 `index.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Textory Demo</title>
  <!-- 必引样式,放 head 里防首屏闪烁 -->
  <link rel="stylesheet" href="https://unpkg.com/@textory/standalone/dist/textory.min.css">
</head>
<body>
  <!-- 编辑器挂载点 -->
  <div id="editor"></div>

  <!-- 引 standalone bundle,window.Textory 自动可用 -->
  <script src="https://unpkg.com/@textory/standalone/dist/textory.standalone.min.js"></script>
  <script>
    const instance = Textory.create(document.getElementById('editor'), {
      content: '<h1>你好 Textory</h1><p>开始编辑...</p>',
      placeholder: '请输入',
      onChange(html) {
        console.log('content changed:', html);
      },
    });
  </script>
</body>
</html>
```

打开浏览器即可。无需 npm、无需 bundler、无需 React。

## Externals 版（页面已有 React）

```html
<link rel="stylesheet" href="https://unpkg.com/@textory/standalone/dist/textory.min.css">

<!-- 必须按顺序: React → ReactDOM → Textory -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@textory/standalone/dist/textory.externals.min.js"></script>
```

externals bundle 假设 `window.React` 与 `window.ReactDOM`（含 `createRoot`）已可用。

## 锁定版本

`@latest` / 不写版本号会拿到最新版，可能引入破坏性变更。生产环境**必须锁版本**：

```html
<script src="https://unpkg.com/@textory/standalone@0.1.0/dist/textory.standalone.min.js"></script>
```

`@0.1.0` 替换为实际发版号。SRI（integrity）属性进一步防篡改：

```html
<script
  src="https://unpkg.com/@textory/standalone@0.1.0/dist/textory.standalone.min.js"
  integrity="sha384-XXXX"
  crossorigin="anonymous"></script>
```

SRI 哈希计算：`curl -s https://unpkg.com/@textory/standalone@0.1.0/dist/textory.standalone.min.js | openssl dgst -sha384 -binary | openssl base64 -A`

## API 速览

```js
const instance = Textory.create(element, options);
```

### 常用 options

| 字段 | 类型 | 说明 |
|------|------|------|
| `content` | `string \| JSONContent` | 初始内容 |
| `editable` | `boolean` | 是否可编辑,默认 `true` |
| `placeholder` | `string` | 占位提示 |
| `features` | `FeatureFlags` | 功能开关,见下 |
| `onChange(html)` | `(html: string) => void` | 内容变化回调 |
| `onCreate` | `() => void` | 编辑器就绪 |
| `onFocus` / `onBlur` | `() => void` | |
| `upload.image(file)` | `(file) => string \| Promise<string>` | 简化图片上传 |
| `upload.video(file)` | 同上,可返 `{url, poster}` | 视频上传 |
| `upload.file(file)` | 同 image | 文件上传 |

完整字段见 [Standalone API](../api/standalone.md)。

### instance 方法

```js
instance.getHTML();          // 拿 HTML 字符串
instance.setHTML('<p>...</p>');  // 替换内容
instance.getJSON();          // 拿 Tiptap JSON
instance.setJSON(json);
instance.focus();
instance.blur();
instance.clear();
instance.setOptions({ placeholder: '新的提示' });  // 动态更新 options
instance.destroy();         // 卸载,释放 React root
instance.editor;            // 原始 Tiptap Editor 实例(escape hatch)
```

## 配置图片上传

CDN 场景最常见需求。简化 API：

```js
Textory.create(el, {
  upload: {
    image: async (file) => {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      return data.url;  // 返回上传后的 URL
    },
  },
});
```

工具栏点图片按钮、复制粘贴图片、拖入图片都会走这个函数。

需要进度条 / 多文件 / 错误细粒度控制时,用 escape hatch `imageProps`（与 React 版签名一致,见 [图片上传](./image-upload.md)）。同时设置时 `imageProps` 优先。

## 功能开关

```js
Textory.create(el, {
  features: {
    outline: false,       // 关闭文档大纲
    importWord: false,    // 关闭导入 word
    fileUpload: false,    // 关闭附件上传
    videoUpload: false,   // 关闭视频上传
    textBubbleToolbar: true,  // 文本选中浮动菜单
  },
});
```

默认全开（opt-out）。`features` 仅在 mount 时生效,运行时修改不重载扩展。要切换 features 请 `destroy()` 后重新 `create()`。

## 动态切换 / 销毁重建

```js
let instance = Textory.create(el, options);

// 改 options
instance.setOptions({ editable: false });

// 销毁
instance.destroy();
instance = null;

// 重建
instance = Textory.create(el, newOptions);
```

destroy 后任何方法调用仅 `console.warn`,不 throw 不静默。

## TypeScript 提示

UMD 用户也想有 IDE 类型提示？装个 dev 依赖:

```bash
pnpm add -D @textory/standalone
# 或 npm i -D @textory/standalone
```

代码里加一行 reference,直接用全局 `Textory` 也能拿到类型:

```ts
import type { TextoryOptions } from '@textory/standalone';

declare const Textory: typeof import('@textory/standalone')['Textory'];

const options: TextoryOptions = {
  content: '<p>hi</p>',
  onChange(html) { /* ... */ },
};

Textory.create(document.getElementById('editor')!, options);
```

## 常见坑

### ❌ 双 React 实例

页面已经引过 React UMD,又用 standalone bundle —— hooks 报错、Context 失效。

**修复**:换 externals 版,或合并 React 引入路径,只用一份。

### ❌ 漏引 CSS

样式不自动注入到 `<head>`。漏引 `<link rel="stylesheet">` 编辑器会变成无样式（contenteditable 裸态）。

**修复**:把 `<link>` 放 `<head>` 里,`<script>` 放 `<body>` 末尾。

### ❌ mount 完成前调 getHTML

`Textory.create()` 同步返回 instance,但 React mount 是异步的。立即调 `instance.getHTML()` 可能拿到空串。

**修复**:命令队列已自动排队,但需要立刻拿 HTML 的逻辑放 `onCreate` 回调里:

```js
Textory.create(el, {
  content: '<p>...</p>',
  onCreate() {
    // editor 已就绪,这里调用 instance.getHTML() 拿到正确内容
  },
});
```

### ❌ 用 standalone 在 React 项目里

React 项目（即使只用一点点 React）必须用 externals 版或走 npm 装 `@textory/editor`。standalone 会带 React 第二份实例。

### ❌ 没锁版本

`@latest` 或不写版本号会拿到最新,可能引入破坏性变更。生产**必须**用 `@x.y.z` 锁版本。

## 已知限制

| 限制 | 原因 | 解决方案 |
|------|------|----------|
| 仅中文 locale | 只实现中文 locale | 用 `@textory/editor` npm 包扩展 |
| 不支持自定义扩展追加 | `extensions` 不开放 | 用 `@textory/editor` npm 包,或走 `instance.editor` escape hatch |
| bundle 体积大 (~2MB) | 含 React + Tiptap + lowlight + framer-motion | 用 externals 版,或接受 CDN 缓存 |
| 首屏加载略慢 | 大 bundle | `<script defer>` 或加 loading 占位 |

## 本地调试

仓库内置 5 个示例 HTML,涵盖基础 / externals / 上传 / features / destroy。两种方式查看:

**方式 1: 文档里直接体验**

启动主 demo (`pnpm start`) 后访问 [/docs/guide/standalone-demos](./standalone-demos.md),5 个示例以 iframe 嵌入文档,无需额外操作。

**方式 2: 独立 standalone-demo dev server**

```bash
pnpm start:standalone
```

访问 http://localhost:5174 看导航。

## 完整 API

详见 [Standalone API](../api/standalone.md)。
