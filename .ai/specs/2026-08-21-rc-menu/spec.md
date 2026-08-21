# Spec: 通用 Menu 组件(rc-menu 封装)与多级菜单

- 日期：2026-08-21
- 状态：done（用户已确认：组件留 editor-toolbar / 一并改造插入菜单 / 叶子点击执行+收起）
- 相关讨论：本会话（用户提供了 `editor-toolbar/src/components/Menu/index.tsx` 现状：rc-menu 官方 demo 搬运，需通用化）

## 1. 背景与目标

`packages/editor-toolbar/src/components/Menu/index.tsx` 目前是 rc-menu 官方 demo 的硬编码拷贝（写死的嵌套菜单、console.log、class 组件），无法复用。目标：

1. 重写为**数据驱动的通用 Menu 组件**（`options` 传入，支持多级子菜单、分割线、禁用、图标、快捷键列），作为编辑器各处菜单的统一底座
2. 用它落地一个真实多级菜单场景：替换 `InsertGroupButton` 里手写的 accordion 二级面板，改为 rc-menu 原生的悬停展开多级子菜单

技术约束（防 AI 过度设计）:
- 底层 rc-menu（已在 `editor-toolbar/package.json: ^9.16.1`），不引入其他菜单库
- 组件放 `@textory/editor-common-ui`（通用 UI 组件包，与 Dropdown/DropdownList 同级），rc-menu 依赖同步迁移到该包
- 样式遵循 textory 现有视觉（白底/圆角/阴影/hover 灰、颜色引用 colors.scss 变量）
- 不改 `<Editor>` props 形态

## 2. 非目标

- 不做受控 selectedKeys 的表单场景联动（菜单是动作触发，非选择器）
- 不做主题化/自定义渲染器（第一版 options 的 label 支持 ReactNode 已够灵活）
- 不替换 rc-overflow 工具栏溢出折叠机制
- 不删除 DropdownList（既有按钮还在用）

## 3. 交互 / 视觉描述

通用 Menu 组件（textory-menu）：
- 数据驱动：`options` 数组递归渲染 MenuItem / SubMenu / Divider
- 叶子项：icon + label +（可选）快捷键列（右对齐浅色）
- 子菜单：悬停（或 click，可配 triggerSubMenuAction）展开下一级，级联支持任意深度；展开箭头随开关旋转
- 禁用项半透明 + not-allowed；分割线 1px 浅灰
- mode 支持 vertical（默认，弹层面板用）/ horizontal / inline
- 视觉与现有 `.textory-insert-menu` 一致（32px 行高、13px 文案、hover `$hover-grey`）

InsertGroupButton 改造后的多级菜单（第一个使用方）：
- 「表格」hover → 二级：网格选格面板（InsertTablePanel 作为自定义子菜单内容）
- 「图片」hover → 二级：插入网络图片 / 上传本地图片
- 「视频」hover → 二级：插入网络视频 / 上传本地视频
- 其余项（任务列表/分割线/代码块/附件）为叶子项
- 叶子点击执行 action 后收起整个菜单

## 4. 技术方案

### 核心 API

```ts
// editor-common-ui/src/components/Menu/index.tsx
export interface TextoryMenuItem {
  key: string;
  label?: ReactNode;            // Divider 时不需
  icon?: ReactNode;
  shortcut?: string;            // 纯展示,右对齐
  disabled?: boolean;
  danger?: boolean;             // 红色文案(删除类操作)
  type?: 'divider';             // type=divider 渲染分割线
  children?: TextoryMenuItem[]; // 子菜单(递归多级)
  onClick?: () => void;         // 叶子点击(在组件内部绑定)
}

export interface TextoryMenuProps {
  options: TextoryMenuItem[];
  mode?: 'horizontal' | 'vertical' | 'inline';   // 默认 vertical
  triggerSubMenuAction?: 'hover' | 'click';      // 默认 hover
  selectable?: boolean;                           // 默认 false(动作菜单不高亮)
  openKeys?: string[];                            // 受控展开
  defaultOpenKeys?: string[];
  onOpenChange?: (keys: string[]) => void;
  onCloseAll?: () => void;                        // 叶子点击后通知外层收起容器
  className?: string;
  style?: CSSProperties;
}
```

### 实现要点

- 函数组件，`renderOptions(options)` 递归：`type==='divider'` → `Divider`；有 `children` → `SubMenu(title=icon+label+shortcut)`；否则 `MenuItem`
- 点击绑定：rc-menu `onClick(info)` 统一回调，按 `info.keyPath` 在 options 树中查找目标项执行其 `onClick`，随后调用 `onCloseAll`（外层收起弹层）
- 受控 openKeys：叶子点击后自动清空 openKeys（收起子菜单）
- 动画：`defaultMotions` 沿用 rc-menu 的 zoom/slide（vertical 用 open-zoom），配套 CSS keyframes 写在 scss
- expandIcon：统一右侧箭头（CSS 绘制，随 open 旋转），替换 demo 里的 SVG 搬运代码
- getPopupContainer 默认不限制（跟随 body），InsertGroupButton 场景传回 trigger 容器

### InsertGroupButton 改造

- popup 内容从手写 div 换成 `<TextoryMenu options={...} onCloseAll={closeMenu}/>`
- 表格子菜单：SubMenu 的 children 支持 ReactNode（不走 TextoryMenuItem，直接塞 InsertTablePanel）——TextoryMenu 增加一个 escape hatch：`popupClassName` + `children` 传节点的 `custom?: ReactNode` 字段
- 上传项：label 用 Upload 包裹（rc-menu MenuItem 内可包含触发上传的节点）

### 涉及包

- `packages/editor-common-ui`：新组件 Menu + rc-menu 依赖（dependencies + tsup external `/^rc-.*/` 已覆盖）
- `packages/editor-common/src/components/index.ts`：转发导出
- `packages/editor-toolbar`：InsertGroupButton 改用 TextoryMenu；rc-menu 从 deps 移除（仅 common-ui 用）
- `packages/editor-style/src/components/menu.scss`：rc-menu 结构样式（.rc-menu 类名树）+ 动画 keyframes
- locale：无新增（沿用 insert 的 keys）

## 5. 边界情况

- options 为空：不渲染（返回 null）
- 深层嵌套（3 级+）：rc-menu 原生支持，弹层自动翻转定位
- 禁用的 SubMenu：整个子菜单不可展开
- 快捷键列与箭头共存：shortcut 在箭头左侧
- InsertTablePanel 嵌入子菜单：键盘 Esc 收起（onEsc 已有）
- Upload 作为 label：点击菜单项触发文件选择，菜单收起时机在点击瞬间（onCloseAll 立即调）
- IAB/webview 下 rc-menu 弹层定位依赖 rc-trigger，与现有 Dropdown 同栈

## 6. 兼容性影响

- 纯新增组件 + InsertGroupButton 内部实现替换，无对外 API 变化
- 按用户确认：组件留在 `editor-toolbar`（未迁 common-ui），rc-menu 依赖保持原位
- tsup external 已含 `/^rc-.*/`，无需改 base 配置

## 7. 验收标准

- [x] TextoryMenu 组件：options 渲染正确（icon/label/shortcut/disabled/divider/多级子菜单），叶子点击触发 onClick 并收起（浏览器实测：叶子点击后根菜单与子菜单全部收起；本地 vitest 渲染测试验证无 React 错误）
- [x] 受控 openKeys / triggerSubMenuAction 可配（组件 props 实现并类型导出；triggerSubMenuAction 默认 hover 实测生效）
- [x] InsertGroupButton 使用 TextoryMenu 后功能不回退：7 项菜单、表格网格（实测 10×10 网格展开 + 2×3 选格插入 + 菜单收起）、图片二级（hover 展开紧贴根菜单、点「插入网络图片」打开 modal 且菜单收起）、视频/上传项门控正常
- [x] 样式与现有一致（menu.scss 全部引用 colors.scss 变量，替换了用户初版 demo 拷贝中的硬编码色值）
- [x] `pnpm build` 通过、`pnpm test` 全过（103 用例）、demo 实测无 console error
- [ ] react-doctor 无新增问题

## 8. 开放问题

1. **组件归属**：建议移到 `@textory/editor-common-ui`（通用组件统一管理，其他包也能用）。备选：留在 editor-toolbar。
2. **InsertGroupButton 是否本次一并改造**：建议是（作为第一个真实使用方验证组件）。备选：本次只做组件，菜单改造后续单独做。
3. **叶子点击后行为**：建议执行 action + 收起全部（含子菜单）。备选：可配置 keepOpen。
