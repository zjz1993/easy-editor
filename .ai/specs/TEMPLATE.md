# Spec: <需求名称>

- 日期：YYYY-MM-DD
- 状态：draft / confirmed / implementing / done
- 相关讨论：<如有，贴会话或 issue 链接>

## 1. 背景与目标

<为什么做这个需求，解决什么问题，谁会受益。>

技术约束（防 AI 过度设计）:
<明确技术边界，例如：仅限在 xx 包内闭环，禁止引入新全局状态库，禁止修改全局 Context，禁止引入新的第三方依赖等。>

## 2. 非目标

<明确不做的部分，防止范围蔓延。>

## 3. 交互 / 视觉描述

<用户视角的完整行为描述：入口在哪、怎么操作、看到什么反馈。有设计稿贴链接/截图。>

## 4. 技术方案
- 核心数据模型 / 类型定义（AI 编码核心依据）
  <强制在此处贴出核心 interface、type 定义，或关键算法的输入输出示例。>
- 涉及包：<如 packages/extension-xxx、editor-main、editor-style>
- 扩展 / 组件设计：<node/mark 结构、NodeView、命令名>
- API / props：<新增或变更的 props、类型定义草稿>
- 状态管理：<context / hooks 变化>
- 样式：<引用 colors.scss 变量，说明新增变量>

## 5. 边界情况

<逐条列出：空文档、超长内容、嵌套结构、与列表/表格/拖拽/撤销重做的交互、SSR、受控模式等。>

## 6. 兼容性影响

<是否改 <Editor> props 形态（新增/改名/改默认值）；是否需要同步 dev/editor-demo 文档；对既有用户是否 breaking。>
依赖与版本环境：
- 是否需要升级 package.json 中的依赖？（如 lodash、dayjs 等）
- 是否需要添加 polyfill？
- 目标浏览器/Node 版本要求是什么？（如：仅支持 Chrome 最新版，无需兼容 IE 11）

## 7. 验收标准

- [ ] <可验证的条目 1，如“在 demo 中输入文本，右下角实时显示字数”>
- [ ] <条目 2>
- [ ] <条目 3：文档已更新（EditorDemo.tsx / api 文档）>
- [ ] <条目 4：build 通过、demo 无 console error>
- [ ] <条目 5：本次新增/修改的核心逻辑有对应 `*.test.ts` 用例且 `pnpm test` 全部通过（纯 UI 调整 / 样式改动可豁免）>

## 8. 开放问题

<待用户决策的点，每条给出 AI 的建议选项。>
