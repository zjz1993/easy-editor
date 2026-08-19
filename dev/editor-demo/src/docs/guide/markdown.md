# Markdown 支持

Textory 内置 Markdown 粘贴与输入支持（`features.markdown`，默认开启），基于官方 [`@tiptap/markdown`](https://tiptap.dev/docs/editor/markdown) 扩展实现。本文介绍用户可感知的三块能力与行为边界。

## 粘贴自动转换

从 Typora、VSCode、GitHub、AI 对话窗口等来源复制 Markdown 文本，粘贴进编辑器会自动转换为富文本，无需手动重排：

```markdown
# 项目周报

本周完成 **三件事**：

- [x] 编辑器支持 Markdown 粘贴
- [ ] 补充单元测试
  - 嵌套任务也支持

> 引用一段会议纪要

| 模块 | 状态 |
| ---- | ---- |
| 粘贴 | 完成 |

```ts
const done = true;
```
```

粘贴后：`# 项目周报` 变 H1、任务清单带勾选状态、表格与代码块直接成型，且**一次 Ctrl/Cmd+Z 可整体撤销**。

### 什么时候会转换

| 场景 | 行为 |
| --- | --- |
| 纯文本 + 命中 Markdown 特征语法（标题 / 列表 / 加粗 / 链接 / 围栏代码等） | 自动转换 |
| 剪贴板 html 只是 markdown 原文的 `<pre>` 裸包装（聊天窗口代码块、IDE 复制） | 自动转换（无格式可保留） |
| VSCode 复制 `.md` 文件 | 自动转换（按 markdown 而非代码块落地） |
| 纯文本 + 无任何特征语法（普通句子） | 原样粘贴 |
| 剪贴板带渲染后的富文本 HTML（从网页 / Word / ChatGPT 复制） | 走原有 HTML 粘贴，**不做** Markdown 转换 |
| VSCode 复制代码（非 .md 文件） | 代码块 |
| 粘贴目标在代码块内 | 保持纯文本原文 |
| 超长文本（> 100,000 字符） | 跳过检测，走默认粘贴 |

安全策略：链接与图片仅接受 `http(s)` 协议。`javascript:` 等非法 scheme 的链接会退化为纯文本、非法图片直接丢弃，与编辑器既有 XSS 处理一致。

## 输入规则

边打字边转（Tiptap 内建能力，Textory 组装时已启用）：

| 输入 | 触发后 |
| --- | --- |
| `# ` + 空格（1–6 级） | 标题 |
| `**文字**` + 空格 | 加粗 |
| `*文字*` + 空格 | 斜体 |
| `~~文字~~` + 空格 | 删除线 |
| `- ` / `1. ` + 空格 | 无序 / 有序列表 |
| `[ ] ` + 空格 | 任务清单 |
| `> ` + 空格 | 引用 |
| `---` | 分割线 |
| ` ``` ` + 回车 | 代码块 |
| `[文字](https://...)` + 空格 | 超链接（Textory 补齐） |

## Markdown 序列化输出

`features.markdown` 开启时，Tiptap 实例附带 Markdown 输出能力：

```ts
import {useEditorInstance} from '@textory/editor';

function MyComponent() {
  const editor = useEditorInstance();

  const exportMarkdown = () => {
    // 任务清单会正确序列化为 `- [x] ...`
    console.log(editor?.getMarkdown());
  };

  // 也可以用 Markdown 作为初始内容或插入内容
  // editor?.commands.setContent('# 标题', {contentType: 'markdown'});
}
```

## 关闭该功能

```jsx
<Editor features={{markdown: false}} />
```

关闭后：纯文本粘贴保持原样、`[text](url)` 输入不再转换、`editor.getMarkdown()` 不可用。`features` 仅 mount 时生效，运行时切换请配合 `key` 强制 remount。
