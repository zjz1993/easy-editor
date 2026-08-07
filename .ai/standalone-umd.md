# Standalone UMD 包设计与约束

> 配套阅读：`./tiptap-performance-guide.md`、`./performance-issues.md`
>
> 本文件是 Claude Code 在本仓库涉及 `@textory/standalone` 包或 UMD/CDN 构建时必须先读的约束文档。

## 背景

`@textory/editor` 是纯 ESM React 库，依赖 React / ReactDOM 单例，无法直接用 `<script>` 标签引入。`@textory/standalone` 包解决"非 React 环境通过 `<script>` 标签引入编辑器"的需求。

核心思路：UMD/IIFE bundle，把 `@textory/editor` 当作 dependency bundle 进去，对外暴露 `window.Textory = { create }` 工厂函数，内部用 `ReactDOM.createRoot` 挂载 React 子树。

## 决策定案

| # | 决策点 | 选择 |
|---|--------|------|
| 1 | 使用形态 | UMD 全量包 |
| 2 | React 处理 | 双产物：`textory.standalone.min.js`（all-in-one）+ `textory.externals.min.js`（external React/ReactDOM） |
| 3 | 入口 API | 工厂函数 `Textory.create(element, options): TextoryInstance` |
| 4 | instance API | 基础命令 + 5 回调（onChange/onCreate/onFocus/onBlur/onError）+ `.editor` escape hatch + `onChange(html: string)` payload |
| 5a | features 形态 | 对象 map，复用 `@textory/editor` 的 `FeatureFlags` |
| 5b | 上传配置 | 双轨 —— `upload.image(file) → string \| Promise<string>` 简单 API + `imageProps` / `videoProps` / `fileProps` escape hatch。同时存在时 escape hatch 优先 |
| 5c | locale | 不开放，仅中文 |
| 5c | extensions | 不开放，自定义扩展走 `instance.editor` |
| 6 | CSS | 单独 `textory.min.css` 用户外链 |
| 7 | 打包工具 | esbuild 独立脚本 `scripts/build-umd.mjs` |
| 8 | 发布形态 | 独立 npm 包 `@textory/standalone` |
| 9a | 挂载时序 | 命令队列，React mount 完成后 flush |
| 9b | `setHTML` 实现路径 | 直接 `instance.editor.commands.setContent()`，跳过 React state 同步链路 |
| 9c | options 动态更新 | `instance.setOptions(partial)` 全量支持 |
| 9d | `destroy()` 失效保护 | invalidated flag + `console.warn`，不 throw |
| 10a | 类型分发 | 包内 `dist/index.d.ts`，TS 用户 `npm i -D @textory/standalone` 拿类型 |
| 10b | demo 验证 | `dev/standalone-demo/` 独立目录 |

## 架构要点

### 包结构

```
packages/standalone/
├── src/
│   ├── index.ts            # 入口 export const Textory = { create }
│   ├── create.ts           # create() 工厂，ReactDOM.createRoot + 命令队列
│   ├── adapter.ts          # upload promise → imageProps.onImageUpload 适配
│   ├── container.tsx       # 内部 React 容器组件，useState 持有 options
│   └── types.ts            # UMD options / instance 类型，复用 @textory/editor props 类型
├── scripts/
│   ├── build-umd.mjs       # esbuild 脚本，两次调用打 standalone + external
│   └── copy-css.mjs        # 拷 @textory/editor theme/normal.css → dist/textory.min.css
├── package.json
├── tsconfig.json
└── tsup.config.ts          # 仅生成 d.ts，不打 JS（如果用得到）
```

### 桥接层时序

`Textory.create()` 是同步 API，但 React 18 `createRoot().render()` 是异步的。处理方式：

1. `create()` 内部 `createRoot(element).render(<Container .../>)`，**同步返回** instance
2. instance 内部持有 `editorRef`、`pendingQueue`、`destroyedFlag`
3. React 渲染完成、Tiptap `Editor` 实例就绪后，触发 `onCreate` → 桥接层 flush `pendingQueue`
4. 用户在 mount 完成前调用 `getHTML()` 等方法 → push 到队列，不阻塞
5. `setOptions(partial)` 与 `destroy()` 立即生效，不排队

### `setHTML` 跳过 React state 的合理性

直接调 `instance.editor.commands.setContent(html)`，不触发 React state 变更。原因：

- `useTiptapWithSync`（位于 `packages/editor-main/src/hooks/useTiptapWithSync.ts`）仅在 **`content` prop 引用变化** 时同步到 Tiptap 内部
- UMD 桥接层调用 `setHTML` 不改 React state（不 setState），`content` prop 引用不变，不会触发反向同步
- Tiptap editor 实例是同一份，下次 React 渲染取到的 editor 状态已是最新

**反例（错误做法）**：UMD 桥接层内部 useState<html> 然后 setState 触发 re-render。会与 Tiptap 内部 state 形成双向同步，触发不必要的 transaction。

### `destroy()` 生命周期

```ts
destroy() {
  if (this.destroyed) {
    console.warn('Textory: instance already destroyed')
    return
  }
  this.root.unmount()
  this.destroyed = true
  this.editorRef.current = null
}
```

destroy 后任何方法调用 `console.warn('Textory: instance destroyed')`，不 throw、不静默 noop。

## 构建约束

### 必须外置（external）

**standalone bundle（`textory.standalone.min.js`）**：**全部内联**。React、ReactDOM、Tiptap、所有扩展、lowlight、framer-motion、rc-* 全打进。用户引一个 script 即可用。

**externals bundle（`textory.externals.min.js`）**：仅 React / ReactDOM 外置，其他全部内联。esbuild 配置：

```js
external: ['react', 'react-dom'],
globalName: 'Textory',
format: 'iife'
```

用户使用前要先引 React CDN：

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="textory.externals.min.js"></script>
```

esbuild 会自动把模块 specifier `react` 映射到全局变量 `React`（`react-dom` → `ReactDOM`），通过 `--external` + IIFE `globalName` 机制。

### 双 React 实例风险

standalone bundle 内置 React。如果用户页面已有 React（例如偷偷用 React 渲染别的东西），会形成双 React 实例，hooks 报错、Context 失效。

**文档必须明示**：
- standalone bundle **禁止**用于已有 React 项目
- 已有 React 项目应使用 `textory.externals.min.js` 或直接 `npm install @textory/editor` 走 ESM

### CSS 单独引

CSS 不自动注入到 `<head>`。用户必须外链：

```html
<link rel="stylesheet" href="textory.min.css">
```

`scripts/copy-css.mjs` 把 `node_modules/@textory/editor/dist/theme/normal.css` 拷贝到 `packages/standalone/dist/textory.min.css`。

未来若 `@textory/editor` 增加主题（dark / compact），`copy-css.mjs` 跟着追加拷贝逻辑。

### 不参与 tsup ESM 构建

`@textory/standalone` 是 UMD-only 包，不走 `tsup.config.base.ts` 流程。tsup 仅用于生成 d.ts（或直接用 `tsc --emitDeclarationOnly`）。

**禁止**：在 `tsup.config.base.ts` 加 IIFE format 或 UMD entry。会污染所有 `@textory/*` 包的 ESM 构建。

## package.json 关键字段

```json
{
  "name": "@textory/standalone",
  "version": "0.0.1",
  "type": "module",
  "main": "dist/textory.externals.min.js",
  "module": "dist/textory.externals.min.js",
  "types": "dist/index.d.ts",
  "unpkg": "dist/textory.standalone.min.js",
  "jsdelivr": "dist/textory.standalone.min.js",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs"
    },
    "./standalone": "./dist/textory.standalone.min.js",
    "./externals": "./dist/textory.externals.min.js",
    "./style": "./dist/textory.min.css"
  },
  "files": ["dist"],
  "sideEffects": false,
  "scripts": {
    "build": "node scripts/build-umd.mjs && node scripts/copy-css.mjs && tsc --emitDeclarationOnly"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "dependencies": {
    "@textory/editor": "workspace:^"
  }
}
```

## Turbo 集成

`@textory/standalone` 依赖 `@textory/editor` 构建产物（拷贝 theme CSS）。`turbo.json` 配置：

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

`^build` 让 turbo 自动按 workspace 依赖图顺序构建。`packages/standalone/package.json` 的 `dependencies` 字段声明 `@textory/editor: workspace:^`，turbo 会识别。

## 反模式（禁止）

### ❌ 在 `@textory/editor` 包内塞 UMD 产物

会让所有 ESM 用户平白下载 ~1MB IIFE blob。包体积污染、发版耦合。UMD 必须独立包。

### ❌ 自动注入 CSS 到 `<head>`

UMD 用户漏引样式虽然易踩坑，但强制注入会让已有打包系统用户难复用。统一外链，文档强调。

### ❌ async create API

`await Textory.create()` 破坏同步 API 体验。CDN script 场景用户不友好。用命令队列透明化 mount 时序。

### ❌ 走 React state 触发 setHTML

`setHTML` 内部 `setState` → `useTiptapWithSync` 同步 → Tiptap transaction。链路长、慢、可能光标位置问题。直接调 Tiptap command 最干净。

### ❌ 暴露 locale / extensions 给 UMD 用户

- locale：目前仅中文 locale 实现，开放配置项让用户传 `en` 会得到全是 key 字符串的 UI
- extensions：开放承诺面扩大，破坏 `BLOCK_TYPES` 一致性约束。需要自定义扩展请用 `@textory/editor` ESM 包或 `instance.editor` escape hatch

### ❌ 用 tsup format: 'iife'

tsup 对 IIFE globalName / externals 映射支持不完整，单 config 多 entry 多 format 易冲突。UMD 必须用 esbuild 独立脚本。

## 验证 Checklist

实施完成后逐项过：

- [ ] `pnpm install` 无错误
- [ ] `pnpm --filter @textory/standalone build` 产出：
  - [ ] `dist/textory.standalone.min.js`
  - [ ] `dist/textory.externals.min.js`
  - [ ] `dist/textory.min.css`
  - [ ] `dist/index.d.ts`
- [ ] `pnpm build` 全量构建通过
- [ ] `pnpm check:external` 通过
- [ ] `pnpm start:standalone` 启动 demo 站，五个示例页全部：
  - [ ] 编辑器可见
  - [ ] 输入文字生效
  - [ ] 工具栏按钮可点
  - [ ] 浏览器 console 无 error
- [ ] TS 用户 `npm i -D @textory/standalone` + `<script>` 引 CDN，`Textory.create(...)` 有 IDE 提示
- [ ] beta 发布后 unpkg URL 可访问：
  - [ ] `https://unpkg.com/@textory/standalone@beta/dist/textory.standalone.min.js`
  - [ ] `https://unpkg.com/@textory/standalone@beta/dist/textory.min.css`
- [ ] destroy 后再调 `getHTML()` console.warn，不 throw
- [ ] 双 React 实例风险文档已写明

## 未决问题（实施中可能浮现）

1. `lowlight` 在 IIFE bundle 内体积（估 200KB+），是否考虑 lazy import 或动态加载？
2. framer-motion 在 standalone 中是否必需？若仅 BubbleMenu 用，可考虑 lighter alternative
3. `exportProps.watermark` 在 UMD 场景的图片资源加载策略
4. `titleProps.showTitle` 的标题编辑 UI 在 CDN 场景是否合理，可能默认关闭

这些不在第一阶段范围，实施时遇到再决策。
