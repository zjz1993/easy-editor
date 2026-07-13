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

## 定制方向（占位）

如果你需要：

- 关闭某个扩展（如不需要表格）
- 调整扩展配置（如表格列宽限制）
- 接入新扩展（如 mention、emoji）

> [!NOTE]
> 当前版本暂未暴露「按需关闭扩展」的 prop，所有扩展均默认启用。后续会通过 `extensions` prop 支持过滤/覆盖，请关注 [API 参考](/docs/api/extensions)。

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
