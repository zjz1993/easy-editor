# Textory 开源接入评估

评估日期为 2026-11-20，面向将 `@textory/editor` 嵌入 React 产品的开发者。Textory 已有表格、附件、视频、大纲、Word 导入导出、Markdown 粘贴、查找替换和斜杠菜单。建议优先投入工具栏定制、第三方扩展接入、保存与草稿恢复。

本次评估依据仓库源码、包清单和 demo 文档。空项目安装、真机交互和真实 Word 样本往返仍待实测。下列优先级供排期讨论。

## 建议开发的功能

| 优先级 | 功能 | 接入方遇到的问题 | 建议验证场景 |
| --- | --- | --- | --- |
| P0 | 工具栏定制 | 现有 `features` 可关闭部分功能，但主组件缺少公开入口来选择、排序、分组或追加按钮。 | 同一个 `<Editor>` 可以展示完整工具栏、只含加粗/列表/链接的精简工具栏，也可以隐藏整栏。接入方能添加自己的按钮。[公开 Props](../../packages/editor-context/src/types/index.ts) |
| P0 | 第三方扩展接入 | 主组件在内部组装扩展。接入方想添加 @提及、公式或业务卡片时，缺少稳定的注册入口和同名冲突规则。 | 接入方通过公开 API 注册工单卡片，从斜杠菜单插入，保存 JSON 后重新打开，编辑和只读模式都能展示。[扩展组装](../../packages/editor-main/src/hooks/useEditorExtensions.ts) |
| P0 | 保存与草稿恢复 | 已有防抖回调和命令式读取。初始内容缓存为空，标题有独立回调，需核实不同保存时机取到的数据。 | 分别验证打开旧文档后直接保存、只改标题后保存、输入后立刻保存。提供自动保存示例，展示保存状态、失败重试以及刷新后按文档恢复草稿，存储后端由接入方选择。[读取入口](../../packages/editor-main/src/root.tsx) · [变更回调](../../packages/editor-main/src/hooks/useOnChangePipeline.ts) |
| P1 | Word 导入保真与结果提示 | 解析器仅处理基础表格，合并单元格缺少专门处理，脚注、批注、公式等超出当前解析范围。 | 用包含合并表格、多级编号和图片的 DOCX 完成导入、编辑、导出，核对表格结构与编号层级。对未保留的内容给出导入提示。[DOCX 解析器](../../packages/extension-import-word/src/docxParser.ts) |
| P1 | 多语言与键盘可访问性 | 目前内置简中，语言初始化依赖全局单例。工具栏的通用图标按钮已有提示文案，但没有把它传给按钮作为可访问名称。 | 提供英文语言包和文案覆盖入口。用读屏软件确认能听到按钮名称和激活状态，用键盘完成打开菜单、执行操作、回到正文。[语言初始化](../../packages/editor-common/src/locales/initIntl.ts) · [工具栏按钮](../../packages/editor-toolbar/src/components/ToolbarItem/ToolbarButton.tsx) |

## 对外发布前的接入检查

1. **验证独立安装。** 主包在运行时导入 `@textory/extension-highlight` 和 `@tiptap/react`，两者在主包清单中仅列入开发依赖。用实际打包产物在仓库外的空白 React 项目安装，按 README 引入组件和 CSS，输入并读回内容，核实运行时依赖声明。[主包清单](../../packages/editor-main/package.json)
2. **明确许可证。** 根项目声明 ISC，部分扩展声明 MIT，主包清单缺少许可证字段，仓库根目录也缺少许可证正文。明确各包适用的协议，核对发布包是否附带相应正文。[根包清单](../../package.json) · [扩展示例](../../packages/extension-highlight/package.json)
3. **校准首次接入文档。** README 标注 Node ≥18，仓库要求 ≥20.19。对比页仍将已实现的查找替换列为缺失。更新环境要求和功能表，在首页提供 demo 入口，以及加载已有文档、编辑和保存的最小示例。[README](../../README.md) · [对比页](../../dev/editor-demo/src/docs/comparison-tinymce.md) · [功能开关](../../packages/editor-context/src/features.ts)

## 建议的端到端场景

- **CMS 文章编辑页。** 作者打开已有文章，插入工单卡片，保存后重新打开，标题、正文和卡片内容均可读。
- **工单评论框。** 工具栏只显示加粗、列表、链接三个按钮，允许 @提及同事，刷新后可恢复当前工单的草稿。

若后续主要用户转向团队知识库，再评估段落批注、版本历史和多人协同的优先级。

## 后续功能的 spec 流程

每项新功能启动时，按模板在 `.ai/specs/<日期>-<需求短名>/spec.md` 起草独立规格，用 `grill-with-docs` 明确开放问题并写回 spec。用户确认最终稿后再实现，交付时逐条报告验收结果。具体步骤以仓库现有流程为准。[Spec 开发流程](../spec-workflow.md) · [Spec 模板](../specs/TEMPLATE.md)
