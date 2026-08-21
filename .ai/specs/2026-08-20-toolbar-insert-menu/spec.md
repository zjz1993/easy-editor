# Spec: 工具栏「插入」分组下拉菜单

- 日期：2026-08-20
- 状态：draft
- 相关讨论：本会话（用户截图参考：图标 + 文字列表式下拉面板）

## 1. 背景与目标

工具栏按钮已达 25 项（含 undo/redo、格式化、颜色、对齐、列表、缩进、链接、代码、图片、视频、附件、表格、分割线、导入导出），窄屏下 rc-overflow 频繁折叠。目标：把低频的"插入类/文档操作类"按钮收进一个下拉菜单（用户截图样式：每项 icon + label，可带快捷键列），显著减少工具栏一级按钮数量，同时不损失任何功能。

技术约束（防 AI 过度设计）:
- 只动 `packages/editor-toolbar`（新组件 + menuArray 调整）+ `packages/editor-style`（样式）+ locale；**不改 root.tsx / 不改 Editor props 形态 / 不动扩展包**
- 复用现有 `Dropdown`（editor-common-ui）+ 自定义面板（仿 `HeaderButtonDropdown` 的 icon + label + 快捷键三列布局），不引入新第三方依赖
- 菜单项的功能逻辑直接复用各现有 Button 组件的 action 调用（不复制实现）
- features 门控行为保持：`fileProps`/`videoProps`/`onImportFile` 未传时对应菜单项不出现（与现有按钮门控完全一致）

## 2. 非目标

- 不做菜单项搜索框（≤9 项无意义）
- 不做菜单项自定义/配置 API（第一版固定分组；未来可加 `toolbarProps`）
- 不改 rc-overflow 溢出折叠机制（分组后自然减少触发）
- 不做"更多(…)"模式的动态收纳（区别于现有 renderRest，是显式分组）

## 3. 交互 / 视觉描述

- 工具栏中"链接/代码"之后出现一个「插入」触发按钮：文字"插入" + 下拉箭头（样式仿 HeaderButton 的当前块类型展示风格）
- 点击弹出面板（点击外部/再点触发器关闭；hover 项高亮）：
  - 每项：iconfont 图标 + 文案 + （有快捷键的显示快捷键列，右对齐浅色）
  - 项清单（与现有按钮一致的 disabled 逻辑，如 isInCodeBlock 时表格/图片禁用）：
    1. 任务列表（icon-check，⌘⇧9）
    2. 分割线（icon-fengefu）
    3. 代码块（icon-code）
    4. 表格（icon-table）
    5. 图片（icon-image）
    6. 视频（icon-video）*仅 videoProps 存在*
    7. 附件（icon-file）*仅 fileProps 存在*
    8. 导出 Word（icon-export）
    9. 导入 Word（icon-import）*仅 onImportFile 存在*
- 点击项执行对应 action 后面板自动收起；tooltip 与原按钮一致
- 原工具栏中的这 9 个一级按钮移除（这正是腾空间的目的）

## 4. 技术方案

### 组件

`packages/editor-toolbar/src/components/InsertGroupButton/index.tsx`：
- 触发器：`ToolbarItemButtonWrapper`（disabled = isInCodeBlock 等聚合）内放 `Dropdown`（showIcon 下拉箭头）
- 面板：自定义（不直接用 DropdownList——需要 icon + label + 快捷键三列，DropdownList 无快捷键列），DOM 结构仿 `HeaderButtonDropdown`：`.textory-insert-menu__item` = icon + span(label) + kbd(shortcut)
- 每项定义：

```ts
interface InsertMenuItem {
  key: string;
  icon: string;                 // iconfont type
  label: string;                // IntlComponent.get(key)
  shortcut?: string;            // 纯展示
  disabled?: boolean;           // useEditorState 派生
  action: () => void;           // editor.chain()... 或 Upload 触发
  visible?: boolean;            // video/file/import 门控
}
```

- 图片/附件/视频的 Upload 触发：复用各 Button 内部的 `ToolbarContext`（imageProps/uploader），InsertGroupButton 从 context 取 props 构造 Upload（ref 包 Upload 组件 triggerRef.current.click()，模式与 VideoButton 一致）
- 导入：`onImportFile` 经 ToolbarContext 或 props 透传（现有 ImportButton 用隐藏 input，InsertGroupButton 内置同款 hidden input）

### menuArray 调整（toolbar.tsx）

- 删除 entries：checkList、divider(第23项 DividerButton)、code、image、video、file、table、export、import
- 新增 1 项：`{ key: 'insertGroup', component: <InsertGroupButton editor={editor} /> }`，位置在 `link` 之后
- `key: 'divider'` 重复的历史问题顺带修复：水平线按钮移入菜单后不再冲突

### 涉及包

- `packages/editor-toolbar`：新组件 + toolbar.tsx menuArray 调整
- `packages/editor-common/src/locales/zh_cn.ts`：`toolbar.insert`（"插入"）新 key；菜单项 label 复用现有 key（check/divider/code/table/image.insert/video.insert/file.toolbar/export/import）
- `packages/editor-style/src/components/toolbar.scss` 或新 `insert-menu.scss`：面板样式（引用 colors.scss 变量）

### 样式

- 面板：白底、圆角 4px、阴影（复用 dropdown 面板变量）、min-width 200px、每项高 32px、hover 浅灰
- 快捷键列：`$primary-grey` 12px

## 5. 边界情况

- `isInCodeBlock`：菜单里除"代码块"外其余插入项 disabled（与原按钮逻辑一致；代码块项可点击用于退出）
- features 关闭（fileUpload/videoUpload/importWord）：对应菜单项不渲染
- 导出中/导出禁用态：ExportButton 原有 disabled 逻辑迁移到菜单项
- 面板打开时点编辑区：面板收起（Dropdown 默认行为），编辑器选区不丢（DropdownPanel 容器有 mousedown preventDefault 模式可参考）
- 溢出折叠：InsertGroupButton 本身作为普通 item 参与 rc-overflow，被折叠进"..."时仍可用
- 菜单项点击后 editor focus 保持（action 内 chain().focus()，与原按钮一致）

## 6. 兼容性影响

- **不新增/不改任何 `<Editor>` props**；features 行为不变
- 工具栏一级按钮减少 8 个（净 -8：移除 9 个 + 新增 1 个）
- 对外导出不变（EditorToolbar 接口不变）
- demo 文档：`api/editor.md` 无 toolbar 章节，本次无需改；demo 实测即可
- 无新依赖

## 7. 验收标准

- [ ] 工具栏出现「插入」按钮，点击弹出含 9 项（默认 features 全开时）的面板，图标/文案/快捷键正确
- [ ] 每项 action 与原一级按钮行为一致（任务列表、分割线、代码块、表格网格、图片上传/网络图、视频、附件、导出、导入）
- [ ] 原对应一级按钮已从工具栏移除；undo/格式化/颜色/对齐/列表/缩进/链接不受影响
- [ ] `features={{ fileUpload: false }}` 等关闭时菜单项同步消失
- [ ] isInCodeBlock 时菜单项禁用态与原按钮一致
- [ ] 面板外点击收起；菜单点击后执行 action 且编辑器焦点正常
- [ ] `pnpm build` 通过；demo 实测无 console error；`pnpm test` 全过
- [ ] locale 新 key 已加，无硬编码文案

## 8. 开放问题

1. **合并范围**：建议按截图 9 项（含导出/导入）。备选：仅插入类 7 项（导出导入保留一级）。
2. **入口外观**：建议「插入」文字 + 下拉箭头（截图风格）。备选：`+` 图标（Notion 风格）。
3. **表格插入交互**：原 TableButton 是网格选格面板；收进菜单后建议菜单项点击展开二级网格（或直接插入 3×3 默认表）。备选：点击直接插 3×3。
4. **代码块项**：原 CodeButton 是"代码块/行内代码"双项下拉；菜单里建议放"代码块"一项（toggleCodeBlock），行内代码保留在文字气泡菜单（TextBubbleMenu 已有）。
