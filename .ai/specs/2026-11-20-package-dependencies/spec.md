# 发布包依赖与入口修复

- 日期：2026-11-20
- 状态：done

## 1. 背景与目标

已用 Node 20.19.0 和 pnpm 9.13.0 对 28 个公开子包的现有 dist 执行 pack，核对 JS、公开类型引用和包入口。在仓库外建立 React 18.3.1 项目，应用仅声明 React、React DOM 和主包，内部包通过 pnpm overrides 指向本轮 tarball，关闭 hoist。安装成功，随后用 esbuild 构建导入主组件和主题的浏览器入口，分别报错找不到 `@tiptap/react` 和 `@textory/extension-highlight`。

目标是让宿主按文档安装即可构建，同时让单独安装子包的 TypeScript 用户能解析其公开类型。

## 2. 非目标

编辑交互、公开 props、CDN API 和整套 Tiptap 的大版本迁移均在本次范围之外。

## 3. 交互与使用方式

使用方继续通过 `@textory/editor` 和 `@textory/editor/theme/normal.css` 加载组件与样式。直接使用扩展、standalone 类型或公开 SCSS 入口时，包管理器应能从该包自己的清单获得所需依赖。

## 4. 技术方案

| 包 | 已查明的问题 | 拟修复 |
| --- | --- | --- |
| `@textory/editor` | 主入口直接导入的 `@textory/extension-highlight`、`@tiptap/react` 都仅在 dev 中。另有 `@tiptap/markdown` 同时在 dependencies 和 dev 中。 | 高亮移入 dependencies，使用 `workspace:^`。React 适配包和 Markdown 按仓库 Tiptap 约定列入 peer 和 dev。 |
| `@textory/extension-slash-command` | JS 和声明直接引用 React，清单缺少 React peer。本地锁定的 suggestion 3.31.3 要求 core/pm 精确为 3.31.3，工作区实际为 3.28.0。 | 声明 React peer。选择与现有 core/pm 兼容的 suggestion 版本，核对其上游 peer 并运行斜杠菜单回归。 |
| `@textory/editor-toolbar` | React 和 React DOM 的 peer 只允许 18，与主包声明的 18/19 不一致。 | 按主包的支持范围验证两代 React，再对齐 peer。 |
| `@textory/editor-utils` | 发布的 `index.d.mts` 引用 `rc-upload/es/interface`，但 rc-upload 只列在 dev。 | 将 rc-upload 列入 dependencies，保留现有公开类型。 |
| `@textory/standalone` | 公开声明 types.d.ts 引用 context、Tiptap core 和 Tiptap React，三者只在 dev。 | 将 context 列入 dependencies，为两个 Tiptap 包声明 peer，验证 ESM 类型入口及 CDN 产物。 |
| `@textory/styles` | exports 暴露 `./src/index.scss`，tarball 只收录 dist。 | 将 SCSS 入口及其引用的样式源文件纳入发布包，验证 Sass 可从 tarball 编译。 |

同步 pnpm 锁文件。现有 `check:external` 只检查外置策略及部分版本一致性，本次对上述实物检查仍返回成功。发布验证应逐包核对 tarball 内的 exports 目标、JS 和公开类型所引用的外部包，再从仓库外构建消费者入口。

## 5. 边界情况

React 19 消费者实测发现共享下拉面板的 rc-trigger 在获取 DOM 时回退到已移除的 ReactDOM.findDOMNode。使用面板已有的容器 ref 提供触发元素，同时保留调用方覆盖能力。验收增加工具栏下拉菜单打开与关闭。

验证覆盖关闭依赖提升、使用子包而非完整编辑器、仅使用 TypeScript 类型、自定义 SCSS 构建。测试专用依赖、已内联实现与未出现在公开声明中的内部类型可保留在 dev。

## 6. 兼容性影响

保留现有公开导入路径，包括样式包的 SCSS 子路径。宿主继续提供共享的 React 和 Tiptap 实例。兼容性分别按仓库锁定环境和独立消费者解析出的版本验证。

## 7. 验收标准

- [x] 28 个 tarball 的所有公开入口文件都存在，每个包的 JS 和公开类型的直接外部引用都有对应声明。
- [x] 空项目在关闭 hoist 时安装主包，React 18 和 React 19 分别能构建组件与主题并挂载编辑器。
- [x] 消费者只依赖相应子包时可解析 editor-utils 和 standalone 的公开类型；Sass 能编译已发布的 SCSS 入口。
- [x] 仓库安装可使用冻结锁文件，斜杠菜单的 suggestion、core 和 pm 满足彼此的 peer 范围。
- [x] 受影响的包和全量构建、外置检查、demo 基本编辑及斜杠菜单验证通过。

## 8. 开放问题

已确认按主包的 React 18/19 范围修复并验证工具栏兼容性。

## 验证记录

2026-11-20 使用 Node 20.19.0、pnpm 9.13.0 和本地 tarball 验证。28 个包全量构建成功，公开入口及发布依赖声明通过核对。关闭 hoist、启用严格 peer 检查后，React 18.3.1 和 19.3.0 均成功安装。两个消费者和仓库 demo 均通过 Chrome 挂载、打开和收起标题菜单、输入正文和斜杠命令转标题的实测。

独立 TypeScript 项目可使用 editor-utils 的文件类型和 standalone 的配置类型，Sass 可通过公开 SCSS 入口编译。冻结锁文件安装、外置检查和 7 项斜杠菜单单测通过。React Doctor 对变更源码评分 100/100。
