---
title: 扩展包接入
category: 指南
order: 3
description: 按需开启 Bold / Table / Image / CodeBlock 等扩展
---

# 扩展包接入

Textory 把每个功能拆成独立扩展包，按需引入即可。

## 当前可用的扩展

| 包名 | 功能 |
| --- | --- |
| `@textory/extension-bold` | 加粗（替换 StarterKit 默认实现） |
| `@textory/extension-code-block` | 代码块（基于 lowlight 高亮） |
| `@textory/extension-image` | 图片插入、上传与预览 |
| `@textory/extension-indent` | 缩进 |
| `@textory/extension-link` | 超链接 |
| `@textory/extension-outline` | 文档大纲 |
| `@textory/extension-table` | 表格 + 浮动菜单 |
| `@textory/extension-task-item` | 任务列表 |

## 默认行为

`@textory/editor` 已经在内部组装了上述全部扩展，无需手动配置：

```jsx
// 直接使用，所有扩展都已启用
render(<Editor content="<p>开箱即用</p>" editable />);
```

## 关闭可选功能（features）

`<Editor>` 默认启用全部扩展，但有些功能（如文档大纲）属于"附加"性质，使用方可能不需要。这类功能通过 `features` prop 显式关闭：

```jsx
// 关闭文档大纲
<Editor
  content="<h1>关闭大纲示例</h1><p>右侧不会出现大纲面板。</p>"
  editable
  features={{ outline: false }}
/>
```

当前可通过 `features` 关闭的功能：

| feature | 默认值 | 说明 |
| --- | --- | --- |
| `outline` | `true` | 文档大纲（`OutlineExtension` + 右侧大纲面板） |

> [!IMPORTANT]
> `features` 仅在编辑器 mount 时生效。运行时修改不会重新加载扩展，开发环境下会触发 `console.warn`。
>
> 如需运行时切换，请配合 `key` 强制 remount：
>
> ```jsx
> const [outlineOn, setOutlineOn] = useState(true);
>
> <Editor
>   key={outlineOn ? 'with-outline' : 'no-outline'}
>   features={{ outline: outlineOn }}
> />
> ```
>
> 完整说明见 [Editor API · 功能开关](/docs/api/editor#功能开关features)。

## 调整扩展配置（暂未开放）

如果你需要：

- 调整扩展配置（如表格列宽限制）
- 接入新扩展（如 mention、emoji）
- 关闭核心扩展（如 bold / table / list 等）

> [!NOTE]
> 这些定制能力暂未暴露稳定 API。当前 `features` 白名单仅覆盖 `outline` 这类无 schema 依赖的独立附加功能；涉及核心 schema 的扩展（列表、缩进、对齐等）暂时必须保留默认启用，避免破坏文档结构一致性。后续会逐步开放更多开关。

## 图片上传

`@textory/extension-image` 提供图片上传能力，通过 `imageProps` 配置：

```jsx
render(
  <Editor
    editable
    imageProps={{
      max: 5,
      minWidth: 100,
      minHeight: 100,
      onImageUpload: async (option) => {
        const fd = new FormData();
        fd.append('file', option.file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: fd,
        }).then((r) => r.json());
        option.onSuccess?.({ data: res.url });
      },
    }}
  />
);
```

完整 props 见 [Editor API](/docs/api/editor)。
