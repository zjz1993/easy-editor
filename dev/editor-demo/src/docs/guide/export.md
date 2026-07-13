---
title: 导出能力
category: 指南
order: 4
description: 导出 Word / 设置水印 / 图片处理
---

# 导出能力

Textory 内置 DOCX 导出，支持自定义水印。

## 最简导出

通过 `EditorRef` 拿到 editor 实例后调用 `export()`：

```jsx
function App() {
  const ref = useRef(null);
  return (
    <div>
      <button onClick={() => ref.current?.export()}>导出 Word</button>
      <Editor
        ref={ref}
        content="<h1>导出示例</h1><p>点击按钮下载 DOCX。</p>"
        editable
      />
    </div>
  );
}

render(<App />);
```

> [!NOTE]
> 上述示例中的 `useRef` 在 react-live 的 noInline 模式下需要被 scope 暴露。本文档为简化展示省略了 scope 暴露细节，实际项目里 `useRef` 由 React 自动可用。

## 水印

通过 `exportProps.watermark` 配置导出水印：

```jsx
render(
  <Editor
    editable
    content="<h1>机密文档</h1><p>本页导出后会带上水印。</p>"
    exportProps={{
      watermark: {
        text: '机密',
        fontSize: 52,
      },
    }}
  />
);
```

水印参数：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `text` | `string` | 水印文字 |
| `fontSize` | `number` | 字号（pt） |
| `color` | `string` | 颜色，默认浅灰 |
| `opacity` | `number` | 透明度，0~1 |

> [!TIP]
> 想直接调用导出函数而不依赖组件实例？`exportWORD` 也可以从 `@textory/editor` 直接 import 调用。

## 完整 API

完整导出选项见 [Editor API](/docs/api/editor)。
