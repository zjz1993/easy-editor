---
title: 与 TinyMCE 对比
category: 其他
order: 9
description: Textory 与 TinyMCE 的功能、架构、体积、开发体验对比
---

# Textory vs TinyMCE

TinyMCE 是一款老牌的富文本编辑器，在企业应用、CMS、邮件客户端等场景广泛使用，生态成熟、插件丰富。Easy Editor（下称 Textory）则是基于 Tiptap/ProseMirror 的现代模块化编辑器，原生面向 React 生态。

本文从**架构、功能、体积、开发体验、适用场景**五个维度做客观对比，帮助你根据实际需求做选型。

> 说明：TinyMCE 6/7 的核心 + 常用插件免费（MIT 协议），但导出 Word/PDF、协同编辑、评论批注、高级表格等属于 **Premium 插件**，需商业授权。下文表格中会明确标注。

---

## 一、技术架构对比

| 维度 | Textory | TinyMCE |
| --- | --- | --- |
| 底层引擎 | ProseMirror（通过 Tiptap 3.x） | 自研引擎（基于 iframe / inline） |
| 语言 | TypeScript（全量严格模式） | TypeScript（部分模块） |
| 模块化 | pnpm workspaces monorepo，26 个独立包 | 单包 + 插件机制 |
| 输出产物 | 仅 ESM（`.mjs` + `.d.mts`）+ UMD（standalone） | UMD / CommonJS / ESM 均有 |
| 框架耦合 | 原生 React 组件（亦提供 UMD 供非 React 项目使用） | 框架无关，React 需 `@tinymce/tinymce-react` 包装 |
| Schema 模型 | ProseMirror 文档模型（严格、可校验） | 自由 HTML（更灵活但更难约束结构） |
| 包外置策略 | React / Tiptap / 工具库全部 external，体积优化 80%~95% | 整包加载，依赖云 CDN 或自托管整套资源 |
| 状态管理 | React Context + Tiptap `useEditorState` 精确订阅 | 命令式 API，需手动桥接 React 状态 |

### 架构差异带来的实际影响

- **文档结构可靠性**：Textory 走 ProseMirror 文档模型，非法结构会被 schema 拦截；TinyMCE 接近 contenteditable 的自由 HTML，粘贴脏数据更难清理。
- **React 集成成本**：Textory 是一等公民 React 组件，props/事件/类型完备；TinyMCE 需要额外的包装器与手动受控逻辑。
- **加载策略**：Textory 通过 external 让用户打包器做 tree-shaking；TinyMCE 通常走 CDN 或自托管整套 `tinymce.min.js` + 插件 + 皮肤。

---

## 二、功能对比

### 2.1 基础编辑能力

| 功能 | Textory | TinyMCE |
| --- | --- | --- |
| 加粗 / 斜体 / 下划线 / 删除线 | ✅ 全部支持，含 Markdown 快捷输入 | ✅ |
| 字体颜色 / 背景高亮 | ✅ 多色高亮，记忆上次颜色 | ✅（高亮需 premium `highlight` 相关） |
| 字号 / 字体 | ✅ 字号独立 Mark | ✅ |
| 文本对齐 / 缩进 | ✅ Tab / Shift+Tab 块级缩进 | ✅ |
| 撤销 / 重做 | ✅ | ✅ |
| 查找替换 | ❌ 暂未内置 | ✅（premium `searchreplace`） |
| 拼写检查 | ❌ 依赖浏览器原生 | ✅（premium Spell Checker Pro） |

### 2.2 块级结构

| 功能 | Textory | TinyMCE |
| --- | --- | --- |
| 标题 H1–H6 | ✅ | ✅ |
| 有序列表 / 无序列表 | ✅ 自定义实现 | ✅ |
| 任务列表（checkbox） | ✅ TaskList + TaskItem | ✅（`checklist`，premium） |
| 引用 blockquote | ✅ | ✅ |
| 分割线 | ✅ | ✅ |
| 代码块（语法高亮） | ✅ 基于 lowlight，20+ 语言，自动语言检测，VSCode 智能粘贴 | ✅（`codesample`，开源；高亮能力较弱） |

### 2.3 表格

| 功能 | Textory | TinyMCE |
| --- | --- | --- |
| 插入 N×M 表格 | ✅ | ✅ |
| 列宽拖拽调整 | ✅（含拖动时高亮、防宽度突变） | ✅ |
| 单元格合并 / 拆分 | ✅ | ✅ |
| 单元格背景色 | ✅ 色板选择 | ✅ |
| 行列增删 | ✅ | ✅ |
| 浮动菜单（BubbleMenu） | ✅ 原生 React NodeView | ✅ 上下文工具栏 |
| 均分列宽 / 复制整表 | ✅ | 部分（需 premium 高级表格） |

### 2.4 多媒体

| 功能 | Textory | TinyMCE |
| --- | --- | --- |
| 图片上传 | ✅ 工具栏 / 拖拽 / 粘贴，进度环 | ✅（`image` + 自定义 handler） |
| 图片尺寸 / 边框限制 | ✅ 最小宽高、最大文件大小 | ✅ |
| 文件附件节点 | ✅ 独立 file 节点 + 图标 + 大小展示 | ⚠️ 仅以超链接形式 |
| 视频节点 | ✅ 本地上传 + 网络地址 + 抓帧封面 | ⚠️ `media` 插件（embed iframe 为主） |
| 视频封面抓帧 | ✅ 工具栏"设为封面" | ❌ |
| 拖拽 / 粘贴分发 | ✅ 按 MIME 自动分流到图片/文件/视频 | ✅ |

### 2.5 链接 / 锚点

| 功能 | Textory | TinyMCE |
| --- | --- | --- |
| 插入 / 编辑 / 移除链接 | ✅ | ✅ |
| URL 格式校验（`https?://`） | ✅ | ✅ |
| 悬停链接工具栏 | ✅ ReactRenderer 渲染 | ⚠️ 通过 `link` 插件弹窗 |

### 2.6 导入导出

| 功能 | Textory | TinyMCE |
| --- | --- | --- |
| 导出 Word（DOCX） | ✅ 内置，支持水印（字号/颜色/透明度）、回调 | ⚠️ 需 premium `export` 插件 |
| 导出 PDF | ❌ 暂未内置 | ⚠️ 需 premium `export` |
| 导入 Word（DOCX） | ✅ 基于 mammoth.js，图片自动转存 | ❌ 没有官方 DOCX 导入 |
| 导出 HTML | ✅ 原生能力 | ✅ |

### 2.7 导航与结构化

| 功能 | Textory | TinyMCE |
| --- | --- | --- |
| 文档大纲（基于 H1–H6） | ✅ 实时生成、点击跳转、滚动同步、标题高亮闪烁 | ⚠️ 需第三方或自行实现 |
| 只读模式 | ✅ `editable={false}` | ✅ |
| 占位符 | ✅ | ✅ |

### 2.8 协同与团队（TinyMCE 强势区）

| 功能 | Textory | TinyMCE |
| --- | --- | --- |
| 实时协同编辑 | ❌ 暂未内置 | ✅ TinyMCE Collaboration（premium） |
| 评论 / 批注 | ❌ | ✅ TinyMCE Comments（premium） |
| 版本历史 | ❌ | ✅（premium） |
| 权限管控 | ❌ | ✅（premium） |

### 2.9 国际化与可访问性

| 功能 | Textory | TinyMCE |
| --- | --- | --- |
| 国际化方案 | `react-intl-universal`，目前内置简体中文 | 内置多语言，开箱即用 20+ 语言 |
| 文案硬编码 | 项目强制走 intl，禁止 JSX 硬编码 | 通过 `tinymce.addI18n` 注入 |
| 可访问性（a11y） | 基础支持 | 较完善（premium `a11ychecker`） |

> Textory 想新增语言只需扩 `packages/editor-common/src/locales/` 即可，但目前**仅内置中文**，多语言开箱体验不如 TinyMCE。

---

## 三、体积与性能

### 3.1 包体积（粗略对比，仅供参考）

| 项目 | Textory | TinyMCE |
| --- | --- | --- |
| 核心包（未压缩） | 单包约 25~80 KB（external 策略后） | `tinymce.min.js` 约 500 KB+（含默认皮肤） |
| 按需加载 | ✅ 每个扩展独立包，可只装需要的 | ⚠️ 单体包，按插件 enable |
| Tree-shaking | ✅ ESM + external 友好 | ⚠️ UMD 为主，tree-shaking 受限 |
| CDN/UMD | ✅ `@textory/standalone` 双产物（standalone / externals） | ✅ 官方 CDN 与自托管 |

### 3.2 运行时性能

Textory 借鉴了 Tiptap 官方性能指南，做了多项优化（详见 `.ai/tiptap-performance-guide.md` 与 `.ai/performance-issues.md`）：

- 工具栏与编辑器组件隔离，减少重渲染
- `useEditorState` 精确订阅选区/标记变化
- NodeView 单独 memo 化
- UMD 桥接层走命令队列，避免 `flushSync` 滥用

TinyMCE 在超大文档下表现稳定，但其 iframe 模式会增加主线程开销，与 React 树通信成本较高。

---

## 四、开发体验

| 维度 | Textory | TinyMCE |
| --- | --- | --- |
| TypeScript 类型 | 完整类型，props/ref/hook 全覆盖 | 有 `tinymce` 类型包，但 API 偏命令式 |
| React 受控 | 一等公民：`content` / `onChange` / `features` | 需通过 wrapper 实现受控，易出 sync bug |
| 扩展开发 | 继承 Tiptap Extension，写 Plugin/Node/Mark | 写 TinyMCE 插件，API 风格偏旧 |
| 调试工具 | ProseMirror Dev Tools 完备 | 自带控制台日志，调试工具较少 |
| 文档完整度 | 本仓库 `docs/` 提供 API/类型/扩展/上传等专题 | 官网文档非常完整，社区资料多 |
| 升级路径 | Tiptap 主线推动，破坏性更新较多但发版频繁 | 商业产品，向后兼容性强 |


## 五、选型建议

### 选 Textory 的场景

- 主项目是 **React 18/19**，希望原生集成、类型安全
- 需要 **DOCX 导入/导出**、文档大纲、视频抓帧封面等开箱即用的功能
- 看重包体积、希望走 ESM + tree-shaking
- 业务有结构化文档需求（ProseMirror schema 约束）
- 不希望被商业授权绑定

### 选 TinyMCE 的场景

- 需要 **实时协同、评论批注、版本历史** 等企业能力（且预算允许 premium）
- 需要成熟的 **多语言开箱体验**、丰富的第三方插件生态
- 团队对 TinyMCE API 已有沉淀，迁移成本高于收益
- 非 React 主栈（jQuery / Vue / 原生 JS 项目 TinyMCE 适配更宽松）
- 需要严格的 a11y / 合规检查（premium）

---

## 六、总结一表

| 维度 | Textory 优势 | TinyMCE 优势 |
| --- | --- | --- |
| 架构 | 现代 ProseMirror + React + TS | 引擎成熟、兼容性广 |
| 体积 | external + ESM，单包小 | CDN 即开即用 |
| 功能深度 | Word 导入导出 / 大纲 / 视频封面 内置 | 协同 / 评论 / a11y / 拼写 等企业能力 |
| 开发体验 | 类型完备、props 驱动 | 文档丰富、社区资料多 |
| 商业成本 | MIT 类友好协议 | 核心免费，premium 收费 |

简单总结：

- **重协同、重企业能力的 ToB 场景** → TinyMCE（含 premium）依然是稳妥选择。
- **重现代技术栈、重 Word 处理、重 React 集成、对包体积敏感** → Textory 更值得尝试。

两者并非二选一，部分团队也会在主文档场景用 Textory，在评论/协同面板嵌入 TinyMCE，各取所长。
