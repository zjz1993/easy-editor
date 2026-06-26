# CLAUDE.md

本文件为 Claude Code（claude.ai/code）在本仓库中协作时提供指引。

## 项目概述

Easy Editor 是一个基于 [Tiptap](https://www.tiptap.dev/) 的模块化富文本编辑器，采用 TypeScript + pnpm workspaces 的 monorepo 架构。每个功能以独立扩展包的形式存在，便于按需组合与扩展。

## 常用命令

### 构建 / 启动

```bash
pnpm install          # 安装依赖
pnpm start            # 启动 demo（dev/editor-demo）
pnpm build            # 构建所有 @textory/* 发布包
pnpm clean            # 清空所有包的 dist 与 .turbo
```

### 单包操作

每个包均提供以下脚本：

- `pnpm run clean`：清理 `dist`、`.turbo`
- `pnpm run dev`：watch 模式（基于 `tsup --watch`）
- `pnpm run build`：生产构建

针对某个包操作：

```bash
pnpm --filter @textory/extension-bold build
pnpm --filter @textory/editor dev
```

### 发布流程（基于 changesets）

```bash
# 进入 beta 预发布模式（只需一次）
pnpm pre:enter

# 写一条 changeset
pnpm changeset

# 版本号自增 + 构建 + 发布 beta
pnpm release:beta

# 在其他项目中验证
# pnpm add @textory/editor@beta

# 转正
pnpm pre:exit
pnpm release
```

发布前可执行 `pnpm check:external`，校验 tsup 的 external 配置是否覆盖到所有应当外置的依赖。

## Monorepo 结构

### 核心包

| 包名                      | 目录                       | 说明                              |
| ------------------------- | -------------------------- | --------------------------------- |
| `@textory/editor`         | `packages/editor-main`     | 主入口，组合所有扩展              |
| `@textory/context`        | `packages/editor-context`  | React Context、类型、hooks        |
| `@textory/editor-common`  | `packages/editor-common`   | 共享工具、常量、通用组件          |
| `@textory/editor-toolbar` | `packages/editor-toolbar`  | 模块化工具栏                      |
| `@textory/styles`         | `packages/editor-style`    | 共享 SCSS 样式                    |

### 扩展包

- `@textory/extension-bold`：加粗
- `@textory/extension-code-block`：代码块（基于 lowlight）
- `@textory/extension-image`：图片插入、上传与预览
- `@textory/extension-indent`：缩进
- `@textory/extension-link`：超链接
- `@textory/extension-outline`：文档大纲
- `@textory/extension-table`：表格 + 浮动菜单
- `@textory/extension-task-item`：任务列表

### Demo

`dev/editor-demo`：基于 Vite 的本地调试应用，是 `pnpm start` 的入口。

## 构建系统

- **tsup**：构建单包，仅输出 ESM
- **Turbo**：编排 monorepo 任务，按依赖图顺序构建
- **pnpm 9.13.0**：包管理器，内部依赖使用 `workspace:^`
- **esbuild-sass-plugin**：在构建时编译 SCSS

### tsup 公共配置

所有包继承 `tsup.config.base.ts`：

- 入口：`src/index.ts`
- 输出：ESM + `.d.mts`
- 外置（external）：React、Tiptap、`@textory/*` 以及大型工具库
- Platform：browser，Target：ES2018
- 资源：`.png/.jpg/.svg` 以 data URL 内联
- SCSS：编译为单独 CSS 文件

### 样式与 JS 分离（@textory/editor）

`@textory/editor` 把样式与 JS 拆开发布，用户通过子路径单独引入：

```ts
import Editor from '@textory/editor';             // JS
import '@textory/editor/theme/normal.css';        // CSS
```

实现要点：

- SCSS 源继续放在 `@textory/styles` 包
- `@textory/editor` 把 `@textory/styles` 作为 `devDependency`（构建期需要，用户运行时不需要装）
- editor 的 `build` 脚本在 tsup 之后追加 `node scripts/copy-theme.mjs`，把 `node_modules/@textory/styles/dist/index.css` 拷贝到 `dist/theme/normal.css`
- 通过 `package.json` 的 `exports` 字段暴露子路径：
  ```json
  "exports": {
    ".": { "types": "./dist/index.d.mts", "import": "./dist/index.mjs" },
    "./theme/normal.css": "./dist/theme/normal.css"
  }
  ```
- `files: ["dist"]` 已经覆盖 `dist/theme/normal.css`，发布时会被带上

后续若要加主题（dark/compact 等），在 `@textory/styles` 里加对应 SCSS，再在 `copy-theme.mjs` 里多加一条拷贝，并在 `exports` 里追加对应子路径即可。

## 架构要点

### 扩展组合

`packages/editor-main/src/root.tsx` 负责组装全部扩展：

1. 以 Tiptap `StarterKit` 为基础（关闭部分内置功能，如 `bold`、`codeBlock`、`underline`、`link`）
2. 注入自定义扩展（Bold、CodeBlock、Image、Link、Table、TaskItem、Indent、Outline 等）
3. 使用 `wrapBlockExtensions()` 统一包裹块级扩展
4. 扩展名以 `BLOCK_TYPES` 常量为准（位于 `@textory/editor-common`）

### 状态管理

- 顶层用 `@textory/context` 的 `EditorProvider` 包裹
- Props 通过 React Context 分发到子组件
- 核心 hooks：
  - `useEditorInstance()`：取 Tiptap editor 实例
  - `useEditorProps()`：合并默认值后的 props
  - `useTiptapWithSync()`：与外部 props 同步

### 扩展包目录约定

```
packages/extension-xxx/
├── src/
│   ├── index.ts        # 对外导出
│   └── xxx.ts          # 实现
├── package.json
└── tsup.config.ts      # 继承 base 配置
```

扩展通常：

1. 继承对应的 Tiptap 基础扩展
2. 默认导出配置好的 Extension
3. peerDependencies 尽量精简，仅声明 `@tiptap/core` 与具体用到的 Tiptap 扩展

### 工具栏架构

- 每个格式化按钮是独立组件，按需挂载
- 使用 `rc-overflow` 处理溢出
- 工具栏根据当前激活的 mark/node 动态刷新

### BLOCK_TYPES 常量

所有块类型集中在 `@textory/editor-common`：

- 用于扩展配置、Schema content 表达式、列表处理等
- 例：`P`、`H`、`UL`、`OL`、`CL`、`CLI`、`LI`、`QUOTE`、`HR`、`TL`、`IMG`、`TABLE`
- 扩展名必须与这些常量保持一致

## 编码规范

### package.json

- 内部依赖统一使用 `workspace:^`（或 `workspace:*` 用于样式）
- React 与 Tiptap 系列放在 `peerDependencies`，避免运行时多实例
- `dependencies` 仅放该包运行时实际需要的内部 `@textory/*` 与小型工具库
- `devDependencies` 放类型声明、`tsup`、`typescript` 等
- 扩展包设置 `"sideEffects": false`
- 仅通过 `module` 字段导出 ESM，不输出 CJS

### TypeScript

- 全量严格模式
- 类型与实现一同导出
- 函数组件使用 `FC`
- 为 props 定义清晰的 interface

### 样式

- 使用 SCSS
- 共享样式放在 `@textory/styles`
- 单包可在自己的 `src` 下放 SCSS，构建时自动编译

## 新增扩展的步骤

1. 在 `packages/extension-xxx/` 新建包，参考 `extension-bold` 等简单样例
2. 在 `package.json` 中声明 `peerDependencies`（必须包含 `@tiptap/core` 以及用到的具体 Tiptap 扩展）
3. 同时在 `devDependencies` 中复制一份相同版本的 Tiptap 包，方便本地类型解析
4. `tsup.config.ts` 继承 `tsup.config.base.ts`
5. 在 `packages/editor-main/package.json` 的 `dependencies` 中以 `workspace:^` 加入
6. 在 `packages/editor-main/src/root.tsx` 引入并放入 `extensions` 数组

## 重要约束

- 仅输出 ESM，不输出 CJS
- 内部依赖必须使用 `workspace:^`
- 扩展 `name` 必须与 `BLOCK_TYPES` 常量匹配
- 列表实现为自定义版本，与 Tiptap 默认不同
- 表格内置 BubbleMenu
- 构建期图片以 data URL 形式内联

## 依赖外置（external）规则

### 为什么要 external

external 意味着依赖不会被打进 `dist`，而是运行时从用户的 `node_modules` 引入。这样能：

1. **避免 React 双实例**：React 必须是单例，否则 hooks / context 会失效
2. **降低包体积**：依赖在多个包间共享而非重复打包
3. **版本一致性**：用户掌控依赖版本
4. **利于 tree-shaking**：未打包的依赖可被用户打包器进一步优化

### 必须外置（MUST external）

| 类别         | 原因                 | 例子                                              |
| ------------ | -------------------- | ------------------------------------------------- |
| React 生态   | 必须为单例           | `react`、`react-dom`、`use-sync-external-store`   |
| 有状态库     | 内部维护状态、版本敏感 | `@tiptap/*`、`prosemirror-*`                      |
| 内部包       | 避免循环依赖         | `@textory/*`                                      |

错误示例：

```typescript
// ❌ 如果 React 被打进包里：
// @textory/editor/dist/index.mjs 自带 React 实例 A
// 用户项目使用 React 实例 B
// 结果：hooks 报错、Context 失效，常见错误：
// "Hooks can only be called inside the body of a function component"

// ✅ 如果 React 被外置：
// 所有包共享用户 node_modules 中的同一个 React 实例
```

### 建议外置（SHOULD external）

体积较大或使用频繁的库建议外置，避免每个包重复打包：

| 类型         | 阈值/特征             | 例子                                       |
| ------------ | --------------------- | ------------------------------------------ |
| 大型库       | > 50KB                | `lodash-es`、`date-fns`                    |
| UI 框架      | 常用                  | `framer-motion`、`@floating-ui/react`      |
| 工具库       | 通用                  | `classnames`、`ahooks`、`rc-*`             |
| 开发工具     | 生产环境不需要        | `@types/*`（tsup 自动排除）                |

### 可选外置（MAY external）

根据具体情况决定，不强求：

| 类型         | 决策要素                       | 例子                       |
| ------------ | ------------------------------ | -------------------------- |
| 小工具       | < 5KB 且无依赖                 | `uuid`、`nanoid`           |
| 单包专用     | 仅被一个包使用                 | 自定义 parser、formatter   |
| 纯函数       | 无副作用、无状态               | 哈希、校验函数             |

### 不应外置（MUST NOT external）

通常应直接打进包里：

- 包内部实现细节（< 5KB）
- 包私有工具函数
- 无外部复用价值的小辅助函数

### 当前 external 配置

位于 `tsup.config.base.ts`：

```typescript
external: [
  // React 生态（必须）
  "react", "react-dom",
  "use-sync-external-store",
  "use-sync-external-store/shim",
  "use-sync-external-store/shim/index.js",

  // Tiptap 与内部包（必须）
  /^@tiptap\/.*/,
  /^@textory\/.*/,

  // 第三方库（建议）
  "lowlight", /^lowlight\/.*/,
  "classnames",
  "framer-motion",
  "ahooks",
  /^rc-.*/,
  "lodash-es",
  "react-intl-universal",
  "@floating-ui/react",
  "react-hook-form",
  "uuid",
  "linkifyjs", /^linkifyjs\/.*/
]
```

### 决策流程

新增依赖时按以下顺序判断：

```
是否 peerDependency？
├─ 是 → 必须 external
└─ 否
   ├─ 是 React / Tiptap / 有状态库？
   │  ├─ 是 → 必须 external
   │  └─ 否
   ├─ 体积 > 50KB 或被广泛使用？
   │  ├─ 是 → 建议 external
   │  └─ 否
   ├─ < 5KB 且仅当前包使用？
   │  ├─ 是 → 可以打进包里
   │  └─ 否 → 可选 external
```

### 不外置的代价

**包体积**：

```
未外置：每包约 500 KB
外置：每包约 25~80 KB
节省：80%~95%
```

**运行时风险**：

- React hooks 失效
- Context 找不到
- 多实例导致状态不一致

### 同步 external 与 package.json

新增依赖后必须同步：

1. 若依赖是 React/Tiptap/有状态库 → 同时加进 `peerDependencies` 和 tsup `external`
2. 若依赖是大型工具库（> 50KB） → 加进 tsup `external` 即可，可放在 `dependencies` 中
3. 若依赖是小型纯工具（< 5KB） → 可直接打进包里，无需 external

校验命令：

```bash
pnpm check:external
```

## 改动后的验证

1. 构建受影响的包：`pnpm --filter @textory/包名 build`
2. 全量构建：`pnpm build`
3. 启动 demo 实测：`pnpm start`
4. 发布前校验 external：`pnpm check:external`
