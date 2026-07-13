---
title: 基本用法
category: 指南
order: 2
description: content / onChange / outputHTML / editable 等常用 props
---

# 基本用法

本篇覆盖日常使用 90% 场景需要的 props。

## 受控内容（content）

`content` 接收 HTML 字符串或 ProseMirror JSON，作为编辑器的初始内容。配合 `useState` 可以在外部切换内容：

```jsx
// 用 useState 控制 content
function App() {
  const [content, setContent] = useState(
    '<h1>初始内容</h1><p>点下面的按钮切换内容</p>'
  );
  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <button onClick={() => setContent('<h1>标题 A</h1><p>A 的段落</p>')}>
          切换 A
        </button>
        <button onClick={() => setContent('<h2>标题 B</h2><ul><li>列表项</li></ul>')}>
          切换 B
        </button>
      </div>
      <Editor content={content} editable />
    </div>
  );
}

render(<App />);
```

> [!WARNING]
> Editor 内部会在 `content` 变化时调用 `editor.commands.setContent()`，会**清空用户当前编辑的内容**。如果你不希望外部更新内容覆盖用户编辑，可以只在初始化时传入 `content`，之后通过 ref 调用 editor 实例方法控制。

## 内容变化（onChange）

`onChange` 在用户输入时触发。配合 `outputHTML` 决定回调收到的数据格式：

```jsx
function App() {
  const [html, setHtml] = useState('');
  return (
    <div>
      <Editor
        content="<p>编辑我，下方会实时显示输出的 HTML</p>"
        editable
        outputHTML
        onChange={(data) => setHtml(data)}
      />
      <pre
        style={{
          marginTop: 16,
          padding: 12,
          background: '#f5f5f5',
          borderRadius: 6,
          fontSize: 12,
          overflow: 'auto',
          maxHeight: 200,
        }}
      >
        {html || '(尚无输出)'}
      </pre>
    </div>
  );
}

render(<App />);
```

| prop | 类型 | 说明 |
| --- | --- | --- |
| `content` | `string \| object` | 初始内容（HTML 字符串或 ProseMirror JSON） |
| `editable` | `boolean` | 是否可编辑，`false` 时只读 |
| `placeholder` | `string` | 空内容占位符 |
| `outputHTML` | `boolean` | `onChange` 输出 HTML 字符串还是 JSON |
| `onChange` | `(data) => void` | 内容变更回调 |
| `title` | `string` | 文档标题（影响导出文件名） |

## 只读模式

`editable={false}` 让编辑器变成展示组件，用户无法修改，常用于详情页：

```jsx
render(
  <Editor
    content="<h1>只读模式</h1><p>editable 为 false 时，用户无法编辑，仅展示。</p><blockquote><p>适合做内容预览 / 详情页。</p></blockquote>"
    editable={false}
  />
);
```

## 富内容

直接传包含表格、任务清单、代码块的 HTML：

```jsx
render(<Editor content={DEMO_HTML} editable outputHTML />);
```

> [!TIP]
> 完整 props 列表见 [Editor API](/docs/api/editor)。
