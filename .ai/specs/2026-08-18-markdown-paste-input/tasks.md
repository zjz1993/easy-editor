# Tasks: Markdown 粘贴 / 输入支持

对应 spec：`./spec.md`（2026-08-18，状态 implementing）

## 1. 新建 `packages/extension-markdown`

- [x] 脚手架：`package.json`（peerDeps：`@tiptap/core`、`@tiptap/markdown`；devDeps 同版本复制）、`tsup.config.ts` 继承 base、`src/index.ts`
- [x] `isMarkdownLike(text)` 严格启发式（含 maxCheckLength 短路）+ `isMarkdownLike.test.ts`
- [x] 节点映射层：marked 产物 → 本编辑器 schema（unorderedList/list_item 重命名、checkList/checkListItem、codeBlock/codeBlockLine、divider、image 属性对齐、GFM 表格、非法链接 scheme 过滤）+ 单测
- [x] `MarkdownSupport` 扩展：`addProseMirrorPlugins` 注册 `editorProps.handlePaste`（无 text/html 才介入；isMarkdownLike → editor.markdown.parse → 映射 → insertContent → return true）
- [x] 处理 marked 依赖策略：确认产物体积与 external 校验通过

## 2. 开关与挂载

- [x] `editor-context/src/features.ts`：`MARKDOWN: 'markdown'`
- [x] `editor-main/src/const/index.ts`：`DEFAULT_PROPS.features.markdown = true`
- [x] `editor-main/src/root.tsx`：挂载 `@tiptap/markdown` 的 `Markdown`（gfm: true）+ `MarkdownSupport`（`features.markdown` 门控）；扩展顺序在 code-block / link 之后
- [x] `editor-main/package.json`：`@textory/extension-markdown: workspace:^`、`@tiptap/markdown`

## 3. 输入规则补齐

- [x] `extension-link`：`[text](url)` input rule（随 `features.markdown` 门控：关闭时不注册）

## 4. standalone 适配

- [x] 检查 UMD 构建是否需要把 markdown 相关依赖打入（对照 `.ai/standalone-umd.md`）

## 5. demo 与文档

- [x] `EditorDemo.tsx`：markdown 粘贴样例区 + `features` 传参
- [x] `docs/api/editor.md` features 表加 `markdown` 行；`docs/api/types.md`；`docs/api/extensions.md` 新条目
- [x] 新增 guide（`docs/guide/markdown.md`）+ `intro.md` 导航；API 文档补 `editor.getMarkdown()` / `contentType: 'markdown'`

## 6. 验证与收尾

- [x] `pnpm install` → 单包 build → `pnpm test`（新用例全绿、覆盖率达标）
- [x] `pnpm build` 全量、`pnpm check:external`
- [x] `pnpm start` 浏览器实测：粘贴样例集 / 富文本粘贴不受影响 / 代码块内不转 / 一次撤销 / 上传回归 / 无 console error
- [x] react-doctor 复检
- [x] `.ai` 登记 QUOTE 命名不一致欠账
- [x] 对照 spec §7 验收 checklist 逐条报告
