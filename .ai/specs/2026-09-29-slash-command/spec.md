# Spec: Slash 菜单（/ 命令面板）

- 日期：2026-09-29
- 状态：draft（开放问题已全部经盘问决策，待用户确认后转 confirmed 并开始下一批实现）
- 相关讨论：本会话（代码评审 + 修复；实现先于本 spec 落地，本 spec 为补记既有设计、固化约束，并作为后续命令集扩展的依据）

## 1. 背景与目标

提供类 Notion 的 `/` 快捷插入：在块级段落行首输入 `/` 唤起命令菜单，键盘或鼠标选择后快速切换块类型、插入元素，免去到工具栏找按钮的路径。

当前已完成基础框架（Tiptap Suggestion 集成、菜单 UI、命令注册表、搜索过滤）与 3 个内置命令（标题 1/2/3），并经过一轮评审修复（intl、颜色变量、undo 合并、类型收紧、单测）。

本 spec 目的：固化既有设计与技术约束，作为后续扩展命令集的开发依据。

技术约束（防 AI 过度设计）：

- 代码闭环在 `packages/extension-slash-command`；共享命令放 `@textory/editor-utils`；样式放 `@textory/editor-style`；文案 key 放 `editor-common/src/locales/zh_cn.ts`
- 浮层定位必须走 `@tiptap/suggestion` 托管挂载（`props.mount` / `onExit` unmount），禁止自行维护 floating-ui 实例
- 所有用户可见文案走 intl；所有颜色引用 `colors.scss` 变量
- 命令实现复用 `editor-utils` 共享命令；**单事务原则**：一次用户操作（删触发文本 + 执行命令）只产生一条 undo 记录
- 不引入新的第三方依赖

## 2. 非目标

- 不做 AI 命令 / 动态内容命令（静态命令集）
- 不做嵌套子菜单、分组标题（当前命令数下无意义，超过约 12 个再评估）
- 不做命令自定义排序 / 拖拽配置
- **不做 features 门控**（决策：保持在 `useEditorExtensions.ts` 无条件挂载；后续有用户反馈不需要时再评估）
- **暂不补拼音搜索别名**（决策：keywords 仅保留英文别名，拼音后续需要时纯数据补充）
- **菜单不加 icon 列**（决策：维持纯标题文字；`description` 字段与样式预留不动，icon 届时另行评估）
- 不做菜单内搜索框（输入即过滤已覆盖）

## 3. 交互 / 视觉描述

- 空段落行首输入 `/`：光标下方弹出命令菜单（宽 260px，白底、圆角 8px、浮层投影）
- **仅行首触发**（决策：维持 `startOfLine: true`，行中输入 `/` 不唤起）
- **代码块 / 行内代码内输入 `/` 不唤起**（决策：配置 `allow` 排除，待实现）
- 继续输入即实时过滤：标题**前缀命中**排在包含命中前；`keywords` 别名（如 `h1`）参与匹配；大小写不敏感；无结果显示「未找到匹配命令」
- 键盘交互：`↑`/`↓` 循环移动高亮（高亮项滚动跟随，`scrollIntoView`）、`Enter` 选中、`Esc` 关闭（由 suggestion 插件原生处理）
- 鼠标交互：hover 高亮同步键盘选中态；`mousedown` 阻止编辑器失焦后执行选中
- 选中命令后：删除触发文本（`/` + 查询串）并执行对应块操作，合为一条 undo
- 查询串中出现空格、或删除触发字符 `/` 时菜单关闭（suggestion 默认行为）
- 内置命令规划：
  - 已上线：标题1、标题2、标题3
  - 下一批（P0 块切换组，决策）：正文、引用、无序列表、有序列表、待办列表、代码块、分割线
  - 依赖 editor props 的插入类（表格/图片/视频等）：不在本 spec 范围，单独评审

## 4. 技术方案

### 核心数据模型

```ts
// packages/extension-slash-command/src/types.ts
export interface SlashItem {
  id: string;
  /** 展示标题的 intl key，设置后渲染与搜索时经 IntlComponent.get 解析，优先于字面 title */
  titleKey?: string;
  /** titleKey 的插值参数，如 {level: 1} */
  titleValues?: Record<string, string | number>;
  /** 字面展示标题，titleKey 未设置时使用 */
  title?: string;
  description?: string;
  /** 搜索关键词（英文别名），与标题一同参与匹配 */
  keywords?: string[];
  /** 返回 false 时该项在当前编辑器状态下隐藏 */
  visible?: (context: { editor: Editor }) => boolean;
  command: ({ editor, range }: {
    editor: Editor;
    range: { from: number; to: number };
  }) => void;
}

// 扩展选项
export interface SlashCommandOptions {
  items: SlashItem[];  // 整体替换默认 basicCommands
  char: string;        // 触发字符，默认 '/'
}
```

- 搜索匹配档位：前缀命中 rank 0、包含命中 rank 1、未命中 -1；按档位稳定排序
- `resolveSlashItemTitle` 统一解析展示标题，**渲染与搜索匹配同一份文案**

### 涉及包

- `packages/extension-slash-command`：扩展本体、菜单组件、注册表、内置命令
- `packages/editor-utils`：`toggleHeadingCommand({editor, level, range?})` 等共享块命令（`level: HeadingLevel = 1|2|3|4|5|6`）；P0 批所需的列表/引用/代码块命令如仓库已有直接复用，没有的在此新增同风格共享命令
- `packages/editor-main`（`useEditorExtensions.ts`）：挂载 `SlashCommand`（无条件，不做门控）
- `packages/editor-common/src/locales/zh_cn.ts`：`slashCommand.noResult`；标题复用 `header.level`；P0 批文案新增 key
- `packages/editor-style`：`slash-menu.scss`（引用 `$border-grey`、`$primary-white`、`$menu-shadow`、`$primary-grey`、`$hover-grey`）

### 扩展设计

- `Extension.create`（无 schema，纯插件扩展），`addProseMirrorPlugins` 注册 `Suggestion({ char, startOfLine: true, allow, items, command, render })`
- `allow`（待实现）：排除代码块（`BLOCK_TYPES.CODE_BLOCK`）与行内代码（`MARK_TYPES.CODE`）内的触发
- render 用 `ReactRenderer` + `props.mount` 托管挂载；`onExit` 中 unmount + destroy
- `SlashCommandRegistry`：注册 / `visible` 过滤 / 搜索排序，纯逻辑可单测
- 包导出面：`SlashCommand`、`SlashCommandOptions`、`SlashItem`、`resolveSlashItemTitle`、`SlashCommandRegistry`、`SlashMenu`（及 props/ref 类型）、`basicCommands`

### 样式

- `.textory-slash-menu`：260px 宽、白底、`$menu-shadow` 投影（colors.scss 已新增变量）
- `.textory-slash-menu-item`：hover 与键盘选中 `.is-active` 共用 `$hover-grey`；`transition: background-color .2s`
- 空态 `.textory-slash-menu-empty`：`$primary-grey` 次要文案色

## 5. 边界情况

- 行中输入 `/`：`startOfLine: true` 拦截，不唤起（决策：维持）
- 代码块内输入 `/`：决策为排除，`allow` 配置待实现；实现前当前行为是会唤起（已知问题）
- 表格单元格内：块切换命令在 cell 内的行为需随 P0 批命令逐个验证
- IME 组合输入（拼音输入法）：composition 期间的输入不应触发过滤跳变，需 demo 实测确认
- 无命中后继续输入/退格：菜单保持开启，直到触发字符被删除；`Enter` 在空结果时不拦截（正常换行）
- undo/redo：删文本 + 执行命令合为一条记录（redo 行为对称）；P0 批所有命令必须遵守单事务原则
- 列表项内触发（P0 批上线后）：`/正文` 等命令在列表项内的升降级行为需明确验证
- 与 drag-handle、placeholder、bubble menu 共存：菜单为独立浮层，无 DOM 层级冲突
- SSR：`ReactRenderer` 仅在交互时挂载，无 SSR 风险
- 菜单项 `titleKey` 与 `title` 均未设置：`resolveSlashItemTitle` 返回空串，渲染空标题但不崩溃

## 6. 兼容性影响

- **不改 `<Editor>` props 形态**（决策：不加 features 门控，无条件挂载），无 demo/文档同步义务
- 对既有用户：无 breaking；`@textory/extension-slash-command` 为新包
- 依赖变化：`editor-utils` 移除误加的 `@textory/context`、devDeps 增加 `@tiptap/extension-heading`（toggleHeading 类型声明）；slash-command 依赖 `editor-common`（intl）与 `editor-utils`，peer 依赖 `@tiptap/suggestion ^3.31.3`
- 环境要求：Node 20+（仓库统一）、仅 ESM、无 polyfill、目标浏览器随仓库基线（ES2018）

## 7. 验收标准

已交付部分（本轮评审修复后逐条核验）：

- [x] 行首输入 `/` 唤起菜单；输入 `/标题1` 回车 → 变为 H1，触发文本被删除，一次 undo 可整体回退
- [x] `↑`/`↓`/`Enter`/`Esc`/hover/点击 交互可用，方向键循环滚动
- [x] 搜索：前缀优先、keywords 别名命中、大小写不敏感、空结果显示 intl 空态文案
- [x] 用户可见文案全部走 intl（`slashCommand.noResult`、复用 `header.level`），无硬编码
- [x] 样式无硬编码色值，全部引用 colors.scss 变量
- [x] `SlashCommandRegistry.test.ts` 覆盖注册表核心逻辑，`pnpm test` 全部通过
- [x] `pnpm build` 全量通过；react-doctor `--scope changed` 零问题

待办（用户确认 spec 后执行）：

- [ ] demo 启动实测（`pnpm start`）：菜单弹出/选中/关闭无 console error，含 IME 组合输入场景
- [ ] 配置 `allow` 排除代码块与行内代码，验证代码块内 `/` 不唤起
- [ ] P0 块切换批命令上线：正文、引用、无序/有序/待办列表、代码块、分割线；每条单事务、intl key、英文 keywords；表格单元格与列表项内行为验证
- [ ] P0 批补对应搜索/命令用例，`pnpm test` 全绿
- [ ] 命令数扩容后回归：菜单滚动 + 键盘导航跟随正常

## 8. 决策记录（原开放问题，2026-09-29 盘问定案）

1. **命令集扩展**：下一批为 P0 块切换组（正文、引用、无序/有序/待办列表、代码块、分割线）；依赖 editor props 的插入类命令（表格/图片/视频等）单独评审。
2. **features 门控**：不加，保持 `useEditorExtensions.ts` 无条件挂载；后续有用户反馈再评估。
3. **触发位置**：维持 `startOfLine: true` 仅行首触发。
4. **代码块行为**：配置 `allow` 排除代码块与行内代码（待实现）。
5. **拼音别名**：暂不补，keywords 仅英文别名。
6. **菜单视觉**：维持纯标题文字，不加 icon；`description` 字段与样式预留。
7. **命令分组**：命令数超过约 12 个时再议，当前非目标。
