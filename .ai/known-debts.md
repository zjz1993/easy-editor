# 已知代码欠账清单

> 与 `test-backlog.md`（补测追踪）同级的债务登记。仅记录、不修复；修复时把对应条目移除并在 PR 说明。
> 来源：2026-08-18 Markdown 支持 spec（`.ai/specs/2026-08-18-markdown-paste-input/spec.md` §5）实现过程中的侦察结论。

## 1. `BLOCK_TYPES` / `MARK_TYPES` 常量与实际 schema 节点名不一致

`packages/editor-utils/src/constants.ts` 中的以下常量值与编辑器实际挂载的节点/mark 名不符。
使用处按常量判断会永远落空（如 `editor.isActive(BLOCK_TYPES.QUOTE)` 恒为 false）：

| 常量 | 常量值 | 实际节点名 | 实际来源 |
| --- | --- | --- | --- |
| `BLOCK_TYPES.QUOTE` | `'quote'` | `blockquote` | StarterKit 默认（root.tsx 未重命名） |
| `BLOCK_TYPES.TR` | `'table_row'` | `tableRow` | `@tiptap/extension-table-row` 默认名 |
| `MARK_TYPES.U` | `'underlined'` | `underline` | `@tiptap/extension-underline` 默认名 |

影响面（grep 确认）：

- `editor-main/src/root.tsx`：Indent `types` 里的 `QUOTE`、wrapBlockExtensions `types` 里的 `QUOTE`
- `editor-main/src/components/TextBubbleMenu/HeadingDropdown.tsx`：`isActive(BLOCK_TYPES.QUOTE)`
- `editor-toolbar/src/components/HeaderButton/HeaderButtonDropdown.tsx`：`[BLOCK_TYPES.QUOTE]` 分支

修复方向（二选一，需单独 spec 评估影响）：

1. 把 StarterKit 的 `blockquote` 在 root.tsx 重命名为 `'quote'`（与 UL/HR 的重命名惯例一致，但影响 HTML 序列化与既有存量数据识别）；
2. 把常量值改回实际名（最小改动，但需全量 grep 确认无下游依赖字面值 `'quote'`）。

## 2. demo features 文档表格缺行（部分 feature 未写入文档）

`dev/editor-demo/src/docs/api/editor.md`「功能开关（features）」表格缺 `characterCount`、`importWord`、`textBubbleToolbar` 三行（代码已支持、文档未同步）。`api/types.md` 的 FEATURES 表同样只列了 4 项。2026-08-18 的 markdown 行已补，其余待后续顺手补齐。
