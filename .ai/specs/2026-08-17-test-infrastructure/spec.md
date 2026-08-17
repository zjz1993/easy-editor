# Spec: 引入 Vitest 测试基础设施

- 日期：2026-08-17
- 状态：done（2026-08-17 实施完成，验收结果见会话交付报告）
- 相关讨论：本会话（源于 spec 模板验收标准中"覆盖率 > 80%"无法落地的讨论）

## 1. 背景与目标

仓库目前没有任何测试基础设施（无 vitest/jest 配置、无任何 `.test.ts` 文件），导致：

- spec 模板的验收标准里"单元测试覆盖率 > 80%"形同虚设
- 工具函数、数据变换、扩展命令等纯逻辑改动只能靠 demo 手测
- 回归风险全靠人工把关，重构没有安全网

目标：引入 Vitest 测试体系，使 `pnpm test` 一条命令可在 monorepo 内运行全部单测并统计覆盖率，为后续各包补测试铺路。

技术约束（防 AI 过度设计）：

- 仅引入测试相关依赖（vitest 及配套），**禁止**引入 e2e 框架（Playwright 等）、禁止改动任何业务代码、禁止改动 tsup 构建配置
- 测试依赖统一装在根 `package.json` devDependencies，**禁止**给每个包重复声明 vitest 依赖
- 不引入新的全局 mock 体系或自研测试工具，配置尽量薄

## 2. 非目标

- 不为存量代码补测试（那是后续逐包做的事，本 spec 只搭基础设施 + 少量示范用例）
- 不做 e2e / 视觉回归测试
- 不接 CI（本地先行，CI 是另一个需求）
- 不做 demo（dev/editor-demo）的测试

## 3. 交互 / 视觉描述

纯工程基础设施，无用户可见交互。开发者视角：

```bash
pnpm test              # turbo 编排，跑所有包的单测（vitest run）
pnpm test:watch        # watch 模式（开发时单包调试）
pnpm test:coverage     # 输出覆盖率报告（text + html）
```

## 4. 技术方案

- 核心数据模型 / 类型定义：

  ```ts
  // vitest.config.ts（根目录，workspace 模式）
  import { defineConfig } from 'vitest/config'

  export default defineConfig({
    test: {
      environment: 'happy-dom',   // 比 jsdom 快数倍，覆盖 DOM API 需求足够
      include: ['packages/*/src/**/*.test.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['packages/*/src/**/*.{ts,tsx}'],
        exclude: ['**/*.d.ts', '**/index.ts', '**/*.scss'],
        thresholds: 80,  // 立刻强制：pnpm test:coverage 在存量补齐前会失败，倒逼补测试
      },
    },
  })
  ```

- 涉及包：仅根目录（`package.json` 脚本、`vitest.config.ts`、`turbo.json` 增加 `test` 任务）；不动 packages/*
- 扩展 / 组件设计：无新扩展。示范用例 3 个：
  1. `packages/editor-common` 纯工具函数测试（挑 1 个现有 util）
  2. `packages/extension-*` 无头 Tiptap Editor 实例测试（验证 mark/node 命令生效，证明 happy-dom 下 Tiptap 可跑）
  3. `packages/extension-*` schema 测试（验证 `BLOCK_TYPES` 约束与 content 表达式）
- API / props：无变更
- 状态管理：无变更
- 样式：无变更
- 新增依赖（根 devDependencies）：`vitest`、`happy-dom`、`@vitest/coverage-v8`、`@testing-library/react`、`@testing-library/jest-dom`、`react`/`react-dom` 类型（如根缺失）；组件测试环境为 happy-dom + RTL，示范 1 个简单组件渲染用例（editor-common-ui 或 editor-toolbar 中挑一个纯展示组件）

## 5. 边界情况

- ESM-only 仓库与 vitest 兼容性：vitest 原生 ESM，无冲突；`@textory/*` 内部依赖在测试中通过 workspace 解析，无需 build 即可测源码
- `.turbo` 缓存：`test` 任务纳入 turbo 缓存需注意 vitest 输出目录不入缓存（`outputs: []`）
- React 组件测试依赖 jsdom/happy-dom 的 DOM 实现，个别 API（如 `getSelection` 细节）happy-dom 可能不全，遇到时单测文件内可覆写 `// @vitest-environment jsdom`
- Node 版本：沿用仓库 engines（>=20.19），无额外要求

## 6. 兼容性影响

- 不改 `<Editor>` props、不影响构建产物与发布（测试依赖全在 devDependencies，`sideEffects` 与 ESM 输出不变）
- `turbo.json` 新增任务不改变既有 build/dev 流程
- demo 无需同步（未涉及 props 变更）

依赖与版本环境：

- 新增 devDependencies：vitest@^3、happy-dom、@vitest/coverage-v8（具体版本以安装时 latest 稳定版为准）
- 无 polyfill、无浏览器要求（测试仅跑 Node）

## 7. 验收标准

- [ ] 根目录存在 `vitest.config.ts`，`pnpm test` 一条命令跑通全部用例且退出码为 0
- [ ] 示范用例 ≥ 4 个，覆盖纯函数 / Tiptap 无头实例 / schema / React 组件渲染（RTL）四类
- [ ] `pnpm test:coverage` 输出各包覆盖率报告（text + html），并已启用 `thresholds: 80`（存量未补齐时会失败，属预期）
- [ ] 存在后续补测试的追踪清单（记录在 `.ai/` 或 issue，列出各包补测优先级）
- [ ] turbo 正确编排 `test` 任务且不影响 `pnpm build`
- [ ] 各包 `package.json` 未新增任何测试依赖（依赖集中在根）
- [ ] 测试文件不计入构建产物（tsup 入口不含 `*.test.ts`）
- [ ] 本 spec 落地后，更新 `.ai/specs/TEMPLATE.md` 验收标准第 5 条为可执行版本

## 8. 开放问题

1. **覆盖率门槛是否立刻强制？** 建议：本期只出报告不设 threshold，等存量补齐后再在 vitest 配置里开 `thresholds: 80`（一期就强制会让 `pnpm test` 直接红）
2. **组件测试（React Testing Library）本期是否引入？** 建议：不引入，等第一个组件测试需求出现时再加，避免装了没人用
3. **示范用例选哪个包？** 建议：editor-common 的一个 util + extension-bold（最简单的扩展，无头实例与 schema 示范都放它身上）
