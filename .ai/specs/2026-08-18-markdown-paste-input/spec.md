# Spec: Markdown 粘贴 / 输入支持

- 日期：2026-08-18
- 状态：done（2026-08-18 实现完成，验收结果见交付报告）
- 相关讨论：本次会话

## 1. 背景与目标

用户从 Typora、VSCode、GitHub、AI 对话窗口等来源复制 Markdown 文本粘贴进编辑器时，`# 标题`、`**加粗**`、`- 列表` 等语法会以纯文本原样出现，不被识别为富文本格式，需要手动逐个重新排版。输入方面，部分 Markdown 语法已通过 Tiptap input rules 支持（标题、加粗、列表、任务列表等），但覆盖不全、从未系统性验证过。

本需求目标：

1. **粘贴转换**：粘贴检测到 Markdown 纯文本时，自动解析并转换为编辑器富文本节点插入（标题、行内标记、列表、任务列表、引用、代码块、链接、图片、分割线、表格等）。
2. **输入规则补齐与验证**：盘点并补齐常用 Markdown 输入规则的缺口，保证"边打字边转"的行为一致可用。
3. **附带能力**（实现成本≈0，随依赖自然获得）：`editor.markdown.parse()/serialize()`、`editor.getMarkdown()`，以及 `setContent(str, {contentType: 'markdown'})`，文档化后供外部使用。

### 现状盘点（调研结论）

- 编辑器 packages 内**没有任何 Markdown 解析依赖**（无 marked / markdown-it / prosemirror-markdown）。
- 现有粘贴处理：`extension-upload`（仅 File 对象分发上传）、`extension-link`（纯 URL 对选区 setMark）、`extension-code-block`（VSCode 剪贴板/多行文本 → codeBlock）。均不处理 Markdown 文本。
- 输入规则现状：StarterKit 内建（`#` 标题、`>` 引用、`-`/`1.` 列表、`---` 分割线、`~~strike~~`、`*italic*`）；自研 Bold（`**bold**`）、TaskItem（`[ ]`/`[x]`）已覆盖。**缺口**：行内链接 `[text](url)` 输入规则（CustomLink 仅有粘贴 URL 处理）。
- 官方 `@tiptap/markdown` 扩展（3.7.0+，本仓库 Tiptap 锁 3.28.0，版本匹配）基于 marked，提供 `editor.markdown` 管理器（parse/serialize）、命令覆盖（`contentType: 'markdown'`）、以及 per-extension 的 `markdownTokenizer` / `parseMarkdown` / `renderMarkdown` 扩展点。**它自身不注册任何粘贴钩子和输入规则**（已核实 3.28.0 产物源码：仅 `addCommands`/`addStorage`/`onBeforeCreate`），粘贴检测与转换必须由我们实现。

技术约束（防过度设计）：

- 选型**只用官方 `@tiptap/markdown`**，不引入 markdown-it / remark / 自写解析器。
- 全部逻辑收敛在新扩展包 `packages/extension-markdown` + `editor-main/src/root.tsx` 挂载点，不改全局 Context、不改现有扩展的粘贴行为。
- 不新增全局状态、不做 UI 改动（无新按钮、无新样式，除非文档示例需要）。

## 2. 非目标

- **不做 Markdown 导出为主线功能**：`getMarkdown()` 只是随依赖附带暴露 + 文档化，不提供 UI 入口（导出仍走现有 export WORD）。
- **不做 `.md` 文件拖拽/导入**：文件粘贴仍由 extension-upload 接管，`.md` 文件粘贴保持现状（不解析）。
- **不做 GFM 表格的逐字符输入规则**（`| a | b |` 边打边转不现实，仅支持粘贴解析）。
- 不支持 Markdown 扩展语法（脚注、数学公式、mermaid、emoji shortcodes 等）。
- 不改动现有富文本（HTML）粘贴路径、Word 导入、图片/文件上传流程。
- 不修复与本需求无关的既有欠账（如 demo features 文档表格缺 characterCount 等行；`BLOCK_TYPES.QUOTE` 命名不一致问题，见 §5）。

## 3. 交互 / 视觉描述

**粘贴**：用户复制一段 Markdown 文本（例如从 GitHub README 或 ChatGPT 回答），在编辑器正文处 Ctrl/Cmd+V：

- 命中 Markdown 特征 → 直接插入转换后的富文本（标题变成真实标题、`**x**` 变加粗、`- [ ]` 变任务列表 checkbox……），一次 Ctrl+Z 可整体撤销。
- 剪贴板带富文本 HTML（从网页/Word 复制）→ 行为与现在完全一致，不做 Markdown 转换。
- 纯文本（无任何 Markdown 特征）→ 原样粘贴，与现在一致。
- 粘贴目标在代码块内部 → 保持纯文本，与现在一致。
- 无任何提示 UI、无开关按钮——转换静默发生。

**输入**：用户在空段落输入 `# ` 回车级触发后变为 H1；`[text](url)` 空格后变为链接文本；其余已支持的语法保持现状。补齐项只有行内链接，无新增可见交互。

**功能开关**：`features.markdown`，默认 `true`（§8-Q2 已决策），关闭后粘贴不转换、输入规则中的补齐项不注册。

## 4. 技术方案

### 核心数据流

```
paste 事件（text/plain，无 text/html）
  → isMarkdownLike(text) 启发式检测（纯函数，可单测）
  → false：返回 false，走默认粘贴
  → true：editor.markdown.parse(text) → JSONContent
      → 解析产物按本编辑器 schema 做节点名/属性映射修正（见下）
      → editor.commands.insertContent(json)（单事务，天然可一次撤销）
      → 返回 true 阻止默认粘贴
```

### 启发式检测（核心纯函数，`*.test.ts` 重点覆盖对象）

```ts
/**
 * 判断纯文本是否"看起来像 Markdown"。
 * 命中规则（满足任一，且非明显普通文本）：
 * - 行首：#{1,6} 空格 / [-*+] 空格 / \d+. 空格 / [-*+] \[[ xX]\] / > 空格 / ``` 围栏
 * - 行内：**x** / __x__ / *x* / ~~x~~ / ==x== / `x` / [x](url) / ![alt](url)
 * - GFM 表格行（| ... | ... |）
 * 纯函数、无状态；对空串/超长串直接短路。
 */
export function isMarkdownLike(text: string): boolean
```

- 设计取向：**严格启发式**（§8-Q1 已决策）——命中特征语法才转换，完全无特征的普通文本原样粘贴。
- 超长文本（如 > 100_000 字符）短路返回 false，避免极端大粘贴卡顿（阈值常量化）。

### 节点名 / Schema 映射（本编辑器与 Tiptap 默认 schema 的差异点）

| Markdown 语法 | marked token | 本编辑器实际节点/mark | 接入方式 |
|---|---|---|---|
| `# 标题` | heading | `heading`（同名） | 默认即可 |
| `**x**` `*x*` `~~x~~` `==x==` | strong/em/del/… | `bold`/`italic`/`strike`/`highlight`（同名） | 默认即可 |
| `` `x` `` | codespan | `code`（同名） | 默认即可 |
| `> x` | blockquote | **`blockquote`**（StarterKit 默认名；注意 `BLOCK_TYPES.QUOTE='quote'` 与实际不一致，映射按 `blockquote` 处理，见 §5） | 默认即可 |
| `- x` / `1. x` | list | `unorderedList`/`orderedList`（root.tsx 已重命名，`UL`/`OL`） | 需自定义 handler |
| `- [ ] x` | list(+task) | `checkList`/`checkListItem`（自研命名，非默认 taskList/taskItem） | 需自定义 handler |
| ``` ```x``` ``` | code | `codeBlock`（自研，子节点 `codeBlockLine`，非默认结构） | 需自定义 handler |
| `---` | hr | `divider`（horizontalRule 已重命名） | 需自定义 handler |
| `[x](url)` | link | `link`（CustomLink 同名） | 默认即可，属性需对齐 |
| `![alt](url)` | image | `image`（AttachmentExtension 同名，src/alt 属性对齐） | 默认 + 属性验证；**生成 image 节点（§8-Q3 已决策）** |
| GFM 表格 | table | `table`/`table_row`/`table_cell`（含 header 转换） | 需自定义 handler；**进第一期（§8-Q4 已决策）** |

实现方式：在 `extension-markdown` 内通过 `extend` 对相关扩展追加 `parseMarkdown` / `renderMarkdown` / `markdownTokenizer` 配置（官方扩展提供的扩展点），或对 parse 产物做后处理映射。**以产物正确性为准，两种手段在实现期择简**，但映射表本身是 spec 的硬性交付物（体现在单测断言里）。

- 列表嵌套：自研 BulletList 的 content 表达式允许 `listItem|UL|OL|CL` 嵌套，解析嵌套列表的产物需符合该表达式（单测覆盖两层嵌套 + 任务列表嵌套）。
- fontsize/color 无 Markdown 语法，不涉及。

### 涉及包

| 包 | 改动 |
|---|---|
| `packages/extension-markdown`（**新建**） | `MarkdownPaste` 扩展：`addProseMirrorPlugins` 注册 `editorProps.handlePaste`；`isMarkdownLike`；映射 handler；`index.ts` 导出 |
| `packages/editor-main` | root.tsx 挂载 `@tiptap/markdown` 的 `Markdown` + 自研扩展（受 `features.markdown` 门控）；package.json 加依赖 |
| `packages/editor-context` | `features.ts` 加 `MARKDOWN: 'markdown'`；types 无破坏性变化 |
| `packages/editor-main/src/const/index.ts` | `DEFAULT_PROPS.features.markdown` 默认值 |
| `packages/extension-link` | 补行内链接 `[text](url)` input rule（随 `features.markdown` 开关门控：关闭时不注册） |
| `packages/standalone` | UMD 产物需把 marked 一起打进去（external 策略见 §6） |
| `dev/editor-demo` | EditorDemo.tsx 演示、`docs/api/editor.md` features 表加行、`docs/api/extensions.md` 新增条目 |

### 扩展 / 命令设计

```ts
// packages/extension-markdown/src/markdown.ts（形态草稿）
import {Extension} from '@tiptap/core';
import {Markdown as TiptapMarkdown} from '@tiptap/markdown';

export const MarkdownSupport = Extension.create({
  name: 'markdownSupport', // 不与 BLOCK_TYPES 冲突，非块级节点
  addOptions() {
    return {
      enabled: true,          // features.markdown 注入
      maxCheckLength: 100_000,
      // 透传 markedOptions: {gfm: true, breaks: false}
    };
  },
  addProseMirrorPlugins() {
    /* plugin with props.handlePaste，逻辑见数据流 */
  },
});
```

- `@tiptap/markdown` 的 `Markdown.configure({markedOptions: {gfm: true}})` 常驻挂载（序列化能力与粘贴共用 parse 管线）；粘贴行为由 `MarkdownSupport` 门控。
- 插件顺序（2026-08-18 交付后修订）：**MarkdownPaste 必须排在 CodeBlock 的 handlePaste 之前**（priority 200 > CodeBlock 默认 100）。原因：CodeBlock 的粘贴条件过宽——任意多行纯文本被 `detectLanguage()` 判定出语言即被截为代码块，Markdown 文本几乎必然命中，若 CodeBlock 在前则 Markdown 转换永远不生效。让位规则：剪贴板含 `vscode-editor-data`（VSCode 源码复制）或 `text/html` 时 MarkdownPaste 直接放行，交还 CodeBlock / 默认 HTML 路径。link 的 URL 处理不受影响（纯 URL 不命中 Markdown 特征，仍由 link 处理）。

### API / props

```ts
// editor-context/src/features.ts
export const FEATURES = {
  // ...existing
  MARKDOWN: 'markdown',
} as const;

// 默认值（待 Q2 确认）
features.markdown: true
```

无其他 props 变更；`onChange`/`getData` 输出格式不变（仍是 html+json）。

### 状态管理 / 样式

- 不新增状态、不改 Context。
- 无样式改动（转换产物使用既有节点渲染）。颜色相关无涉及。

### 依赖与打包

- `@tiptap/markdown@^3.28.0`：`extension-markdown` 的 `peerDependencies`（+devDependencies 同版本），`editor-main` 的 `dependencies`（workspace 外部依赖）。tsup external 已被 `/^@tiptap\/.*/` 覆盖，`pnpm check:external` 验证。
- marked（`@tiptap/markdown` 的传递依赖）：**打进 `extension-markdown` 产物（§8-Q6 已决策）**（约 40KB、纯函数、仅本包使用，按 external 决策表属 MAY external → 不 external）；standalone UMD 同理打入。若 react-doctor 体积扫描超标，仅允许调整为 external + dependencies（fallback，不改 API）。

## 5. 边界情况

- **空剪贴板 / 空文本**：`isMarkdownLike` 短路 false，默认行为。
- **剪贴板同时有 text/html 与 text/plain**（网页、Word、VSCode 带样式复制）：html 优先，本扩展不介入（`handlePaste` 检查 `clipboardData.getData('text/html')` 非空即放行）。VSCode「Copy Without Formatting」（仅 text/plain + `vscode-editor-data`）同样让位给 code-block 处理器。
- **代码块内粘贴**：code-block 的 handlePaste 优先级更高（扩展顺序保证）；实测验证在代码块内粘贴 markdown 文本不转换。
- **表格单元格内 / 引用内粘贴**：正常转换插入（段落级替换），实测验证上下文 schema 兼容（例如在单元格内粘贴整篇文档只插入允许的节点）。
- **撤销/重做**：`insertContent` 单事务，一次 Ctrl+Z 整体撤销；redo 对称。
- **与 extension-upload 共存**：upload 的 `handleDOMEvents.paste` 只处理 File 对象；文本粘贴互不干扰，实测确认两者顺序无回归（图片/文件粘贴上传不受影响）。
- **XSS**：marked 配置禁用 HTML 直通（`html: false` 为 marked 默认，显式声明）；解析产物经 Tiptap schema 白名单过滤，未知节点/mark 被丢弃。粘贴 `![](javascript:...)`、`[x](javascript:...)` 等恶意载荷不得产生可执行链接属性（复用 CustomLink 既有协议校验；无则映射时丢弃非法 scheme）。与既有 XSS 处理（commit 9ba11b1）不冲突：本路径产物同样过 schema。
- **超长文本**：> `maxCheckLength` 直接默认粘贴，不做检测/解析（防卡顿）。
- **嵌套结构**：两层以上嵌套列表、任务列表嵌套（自研 content 表达式）、代码块内含 markdown 文本（作为 codeBlockLine 原文保留）。单测覆盖。
- **与 UniqueID 共存**：`insertContent` 后 UniqueID（types: 'all'）为节点补 id，实测验证无冲突。
- **editable=false**：不注册插件（参照 UploadExtension 的 `editor.isEditable` 模式）。
- **DocTitle 标题输入框**：独立 input，不经编辑器实例，天然不受影响。
- **既有命名不一致**：`BLOCK_TYPES.QUOTE = 'quote'` 但实际节点名是 StarterKit 默认的 `blockquote`（toolbar/Indent 里用 `'quote'` 判断本就可能失灵）。本 spec 的映射按实际 schema 名 `blockquote` 处理，**不修**既有不一致（记入 `.ai/` 欠账清单，见 §7 验收最后一项）。
- **SSR / 受控模式**：粘贴是纯客户端事件，无 SSR 影响；`content` prop 仍是 html/json，不受影响（`contentType: 'markdown'` 仅在用户显式传时生效）。

## 6. 兼容性影响

- **`<Editor>` props**：新增 `features.markdown`（可选 boolean，默认 `true`，§8-Q2 已决策），非 breaking。
- **附带能力文档化（§8-Q5 已决策）**：`editor.getMarkdown()`、`setContent(str, {contentType: 'markdown'})`、`editor.markdown.parse()/serialize()` 写入 API 文档并在 demo 演示。
- **依赖**：`editor-main` 新增 `@tiptap/markdown`（与已锁定 Tiptap 3.28.0 同源同版本），用户侧 peer 安装要求随之增加一条；demo、standalone 同步。无 polyfill，浏览器目标不变（ES2018+）。
- **文档同步**（AGENTS.md 硬性要求）：`dev/editor-demo/src/sections/EditorDemo.tsx` 演示 markdown 粘贴样例 + features 传参；`docs/api/editor.md` features 表加 `markdown` 行；`docs/api/types.md` 类型表；`docs/api/extensions.md` 加 `@textory/extension-markdown` 条目；`docs/guide/` 如新增"Markdown 支持"指南则更新 `intro.md` 导航。
- **既有用户**：默认开启粘贴转换属于行为变化（原样纯文本 → 转换）。通过 `features.markdown: false` 可关回旧行为；发布 notes（changeset）中标注 minor 行为变化。

## 7. 验收标准

- [ ] 粘贴转换样例集逐项通过（demo 手测 + 单测）：H1–H6 标题、加粗/斜体/删除线/高亮、行内代码、无序/有序/嵌套列表、任务列表 `- [ ]`/`- [x]`、引用、围栏代码块（含语言标注）、行内链接、图片 `![alt](url)`、分割线、GFM 表格
- [ ] 从网页复制富文本（带 html）粘贴行为与现状一致，不发生 Markdown 转换
- [ ] 无 Markdown 特征的纯文本粘贴原样插入
- [ ] 代码块内粘贴 Markdown 文本保持纯文本
- [ ] 转换插入后一次 Ctrl+Z 整体撤销、Ctrl+Shift+Z 恢复
- [ ] 图片/文件粘贴上传（extension-upload 路径）回归无影响
- [ ] 行内链接输入规则生效：输入 `[text](url)` + 空格 → 链接
- [ ] 恶意载荷粘贴（`javascript:` scheme 链接/图片）不产生可执行属性
- [ ] `isMarkdownLike` 与节点映射有 `*.test.ts` 用例，`pnpm test` 全绿（含覆盖率门槛）
- [ ] `pnpm build` 通过、`pnpm check:external` 通过、demo 启动无 console error、react-doctor 复检通过
- [ ] 文档已同步（EditorDemo.tsx / api/editor.md / api/types.md / api/extensions.md，grep 能搜到 `markdown`）
- [ ] `BLOCK_TYPES.QUOTE` 命名不一致已记入 `.ai/test-backlog.md` 同级的欠账清单（不修复，仅登记）

## 8. 开放问题 → 决策记录

以下 6 个开放问题已于 2026-08-18 经盘问全部决策（均采纳建议项），正文相关章节已同步：

1. **粘贴检测策略** ✅ 严格启发式：命中特征语法才转换，无特征纯文本原样粘贴；不做宽松模式、不新增配置项。
2. **`features.markdown` 默认值** ✅ 默认 `true`；changeset 标注 minor 行为变化，`features.markdown: false` 可关回旧行为；输入规则补齐项随开关门控。
3. **图片外链 `![alt](url)`** ✅ 生成 image 节点（src=外链 URL，走既有预览渲染），非法 scheme 在映射层丢弃。
4. **GFM 表格** ✅ 进第一期；若实现中发现 table 映射复杂度显著超预期，允许降级第二期，但需先在本 spec 记录原因。
5. **序列化能力** ✅ 文档化暴露：`editor.getMarkdown()`、`setContent(str, {contentType: 'markdown'})`、`editor.markdown.parse()/serialize()` 写入 API 文档 + demo 示例。
6. **marked 打包** ✅ 打进 `extension-markdown` 产物（不 external）；仅当体积扫描超标时降级为 external，API 不变。
