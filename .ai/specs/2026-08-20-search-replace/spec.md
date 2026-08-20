# Spec: 搜索替换（search & replace）

- 日期：2026-08-20
- 状态：done
- 相关讨论：本会话（"高价值缺口"中的搜索替换）

## 1. 背景与目标

编辑器目前没有搜索/替换能力，长文档编辑（改错别字、批量改术语）只能靠肉眼定位。目标：提供 VSCode 风格的搜索替换——快捷键唤出浮层面板，实时高亮所有匹配项，支持逐个/全部替换。

技术约束（防 AI 过度设计）:
- 核心逻辑（匹配、替换、高亮 decoration）在独立新包 `packages/extension-search-replace` 内闭环，基于 ProseMirror Plugin + Decoration 自研，**不引入第三方搜索扩展**（tiptap pro 的 search-and-replace 是收费包）
- UI 面板放 `packages/editor-main/src/components/SearchReplace/`，不新建包
- 不引入新的第三方运行时依赖（正则匹配用原生 RegExp）
- 遵循 features 开关三步约定（features.ts / root.tsx 条件挂载）

## 2. 非目标

- 不支持正则表达式匹配（第一版，避免注入风险与 UI 复杂度）
- 不做"在选区内搜索"范围限定
- 不做搜索历史 / 持久化
- 不做移动端专用交互适配
- 不改 `<Editor>` 顶层 props 形态（仅新增 `features.searchReplace` 开关，默认开启）

## 3. 交互 / 视觉描述

入口：
1. 快捷键 `Mod+F`（Mac ⌘F / Win Ctrl+F）打开搜索面板并聚焦搜索框
2. `Mod+Alt+F`（Mac ⌘⌥F / Win Ctrl+Alt+F）打开并展开替换行
3. 工具栏暂不加按钮（搜索是键盘驱动的功能，浮层入口足够）

面板行为（仿 VSCode）：
- 浮层出现在编辑区右上角（absolute 覆盖，不挤动文档流）
- 输入搜索词后，编辑区内所有匹配项即时高亮（浅黄背景），当前项用深色/主色高亮并滚动到可见区域
- 计数显示 `2/15`（当前项/总数）；无结果显示 `无结果`（输入框标红）
- `Enter` / `Shift+Enter` = 下一个 / 上一个匹配
- 替换行（默认收起，点切换图标或 ⌘⌥F 展开）：替换当前项并跳下一个；全部替换
- 匹配开关：大小写敏感（Aa）、全词匹配（ab|）toggle 按钮
- `Esc` 关闭面板并清除高亮；面板失焦不清除（用户可能在编辑区内点击）
- 替换产生的历史进入统一 undo 栈（一次"全部替换"为单个 undo 单元）

## 4. 技术方案

### 核心数据模型

```ts
// extension-search-replace/src/search-replace.ts
interface Range { from: number; to: number }

interface SearchReplacePluginState {
  searchTerm: string;
  caseSensitive: boolean;
  wholeWord: boolean;
  matches: Range[];          // 由 searchTerm + doc 计算得出
  activeIndex: number;       // -1 表示无激活项
}

interface SearchReplaceStorage {
  matches: Range[];
  activeIndex: number;
  resultCount: number;
}
```

### 涉及包

- `packages/extension-search-replace`（新建）：Plugin + Decoration + commands + storage
- `packages/editor-main`：挂载扩展（features 门控）、`SearchReplacePanel` 组件、快捷键
- `packages/editor-context`：`FEATURES.SEARCH_REPLACE = 'searchReplace'`
- `packages/editor-common`：locale keys
- `packages/editor-style`：`search-replace.scss`

### 扩展设计

- `Extension.create({ name: 'searchReplace' })`，`addProseMirrorPlugins` 注册 plugin
- 匹配算法：`doc.descendants` 遍历 text node，对每段 text 用 `RegExp(escapeRegExp(term) + wordBoundary, flags)` 执行 `matchAll`；不做跨节点匹配（与 tiptap pro 行为一致）
- Decoration：`Decoration.inline(from, to, { class: 'textory-search-match' })`，激活项额外 class `textory-search-match--active`
- Commands（`declare module '@tiptap/core'` 扩展）：
  - `setSearchTerm(term: string)`
  - `setSearchOptions({ caseSensitive?, wholeWord? })`
  - `goToMatch(direction: 'next' | 'prev')` — 激活项变更 + `tr.scrollIntoView()` + setSelection
  - `replaceNext(replace: string)` — 替换当前激活项后自动跳到下一处
  - `replaceAll(replace: string)` — 从后向前逐个 `insertText`，合并为单个 transaction（单次 undo）
  - `clearSearch()` — 清空 searchTerm、移除高亮
- doc 变化（编辑/setContent）时在 `onTransaction`/`apply` 中重算 matches，activeIndex clamp 到新范围
- React 侧读取状态：storage 在 plugin apply 后同步更新，面板组件订阅 `editor.on('transaction')` 读 `editor.storage.searchReplace`（与 CharacterCountBar 同模式）
- **程序化选区标记（交付后补充）**：`goToMatch`/`replaceNext` 会 `setSelection` 到匹配项，若不处理会被 TextBubbleMenu 当成用户选择而唤起。plugin state 增加 `programmaticSelection` 标志——跳转事务显式置 true，任何用户交互产生的 selection/doc 事务重置为 false；`TextBubbleMenu.shouldShow` 检查该标记（读 plugin state 而非 storage，保证时序同步）

### UI 组件

- `SearchReplacePanel`：受控状态 `searchTerm/replaceText/caseSensitive/wholeWord/替换行展开`，调 commands，订阅 transaction 读计数
- 打开/关闭状态提升到 root.tsx 的新 `SearchReplaceLayer`（memo 隔离，仅依赖 editor），面板内部自持快捷键监听
- root.tsx 通过事件委托实现 `Mod+F`：在 `EditorContent` 外层 div 上监听 keydown（浏览器默认 Ctrl+F 需 preventDefault）

### 样式

- `textory-search-match`：`$color-warning-bg` 类浅色背景（新增变量 `--textory-search-match-bg`、`--textory-search-match-active-bg` 到 colors.scss，禁止硬编码色值）
- 面板样式复用现有 dropdown/popover 的阴影、圆角、边框变量

## 5. 边界情况

- 空文档 / 空搜索词：无高亮，计数隐藏
- 搜索词在替换后消失（如搜索 "ab" 替换为 "ba" 不再匹配）：重算后 activeIndex 回退到 0 或 -1，不报错
- 匹配项跨表格单元格/列表项边界：不匹配（单 text node 内匹配，天然行为）
- 替换文本包含搜索词（如搜 "a" 换 "aa"）：replaceAll 从后向前替换，不会死循环
- `replaceAll` 在大文档（上千匹配）的性能：单 transaction 合并，一次重绘；`matchAll` 每次全 doc 遍历，10 万字级可接受（<50ms）
- undo/redo：replaceAll 单 transaction，一次 Ctrl+Z 全部回滚；替换后 redo 状态一致
- 与只读模式：`editor.isEditable === false` 时不挂载面板与快捷键（与 BubbleLayer 同条件）
- 面板打开时用户直接在编辑区输入：搜索词保持，matches 实时重算
- Esc 关闭后再按 Mod+F：重新打开并保留上次搜索词（组件状态保留在 Layer 内）

## 6. 兼容性影响

- 新增 `features.searchReplace`（默认 `true`），非 breaking；关闭后无快捷键占用、无扩展挂载
- 不新增顶层 props；不改既有 props
- 同步 dev/editor-demo：`src/docs/api/editor.md`（features 表加一行）、`EditorDemo.tsx` 不需改（默认开启）
- 依赖：无新增第三方依赖；peerDependencies 仅 `@tiptap/core`、`@tiptap/pm`
- 浏览器：`String.matchAll`（ES2020，目标 ES2018 需确认 tsup target——如不支持改用 `RegExp.exec` 循环）

## 7. 验收标准

- [x] demo 中输入含重复词的文本，按 ⌘F/Ctrl+F 弹出面板，所有匹配项高亮，计数正确（浏览器实测：搜 "Textory" 命中 2 处，计数 1/2，激活项带 `--active` class）
- [x] Enter/Shift+Enter 切换上/下一项，激活项样式区别于其他项并滚动到可视区（浏览器实测 Enter：1/2 → 2/2；Shift+Enter 与 prev 路径由单测 `goToMatch 循环跳转并更新选区` 覆盖）
- [x] Aa / 全词开关生效；大小写不敏感为默认（单测覆盖：`大小写 / 全词开关改变匹配数`）
- [x] 替换当前项：文本更新且自动跳到下一项；全部替换：所有项一次替换，Ctrl+Z 一次全部撤销（浏览器实测替换 + undo 回滚；单测覆盖 replaceNext / replaceAll / undo / 替换词含搜索词不死循环）
- [x] Esc 关闭面板并清除高亮；Mod+F 重新打开保留上次搜索词（浏览器实测关闭后 `.textory-search-match` 清零；搜索词保留由常驻挂载的组件 state 保证）
- [x] `features={{ searchReplace: false }}` 时无面板、无快捷键拦截（代码路径：root.tsx 的 `onKeyDown` 与 SearchLayer 均以 `isSearchReplaceEnabled && editor.isEditable` 门控；扩展不进 extensions 数组，浏览器原生 Ctrl+F 不受影响）
- [x] 文档已更新（editor.md features 表新增 `features.searchReplace`、`features.characterCount` 两行；locale 新增 `search.*` 11 个 key）
- [x] `pnpm build` 通过（含 standalone UMD，需 motion-dom override，见交付说明）；demo 启动无 console error（浏览器实测 console 无错误）
- [x] 扩展核心逻辑有 `*.test.ts`：`search-replace.test.ts` 17 个用例（含程序化选区标记生命周期）；`pnpm test` 全部通过
- [x] 交付后补充：搜索跳转不唤起 TextBubbleMenu（浏览器实测跳转后气泡 `visibility: hidden`；用户真实选区路径由单测覆盖 + shouldShow 条件短路保证）

## 8. 开放问题

1. **工具栏入口**：本 spec 建议"仅快捷键，不加工具栏按钮"。备选：加一个搜索图标按钮。
2. **匹配选项**：第一版做"大小写 + 全词"两个开关、不做正则。是否需要正则？
3. **面板位置**：编辑区右上角（VSCode 是顶部居中）。备选：顶部居中。
4. **默认展开替换行**：默认只显示搜索行（VSCode 行为）。备选：默认两行都显示。
