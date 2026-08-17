# 单元测试补测追踪清单

测试基础设施于 2026-08-17 落地（见 `.ai/specs/2026-08-17-test-infrastructure/spec.md`）。当前全局覆盖率约 1.7%，`pnpm test:coverage` 会因 80% 门槛失败，属预期倒逼机制。每补完一个包，把 `[ ]` 改成 `[x]` 并在文末补一行完成记录。

## 优先级（P0 最高）

### P0 — 纯逻辑、高风险、易测试

- [ ] `editor-utils/src/helpers.ts` — 判定函数（isInListSelection、isInTable 等剩余部分）
- [ ] `editor-utils/src/convertToTable.ts` — 数据变换核心逻辑
- [ ] `editor-utils/src/clipboard.ts` — 剪贴板处理（需 mock editor-common-ui 的 message）
- [ ] `editor-utils/src/filePreview.ts`
- [ ] `editor-common/src/locales` + intl 封装 — 键值完整性（防漏 key）

### P1 — 扩展核心行为（无头 Tiptap 实例）

- [ ] `extension-link` — 链接 mark、输入规则、XSS 处理（仓库有安全需求，优先）
- [ ] `extension-table` — 表格命令与 BubbleMenu 逻辑
- [ ] `extension-task-item` / 列表相关 — 自定义列表实现与 Tiptap 默认不同，回归风险高
- [ ] `extension-image` / `extension-upload` — 上传状态机、progress plugin
- [ ] `extension-indent`、`extension-highlight`、`extension-fontsize`、`extension-code-block`

### P2 — React 组件（RTL）

- [ ] `editor-toolbar` — 工具栏按钮激活状态
- [ ] `editor-main/src/components/*` — CharacterCount 等
- [ ] `editor-common-ui` — Button / InputNumber / Modal / Message / Popover 等基础组件

### P3 — 集成与外围

- [ ] `editor-context` — Provider、hooks（useEditorProps 默认值合并等）
- [ ] `standalone` — adapter / create（偏集成，可放最后或改用 e2e）

## 完成记录

| 日期 | 包 / 文件 | 覆盖率 | 备注 |
| ---- | --------- | ------ | ---- |
