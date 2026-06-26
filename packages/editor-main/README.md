# @textory/editor

基于 Tiptap 构建的模块化富文本编辑器，支持丰富的文本格式化和扩展功能。

## 特性

- **富文本编辑**: 支持标题、段落、引用、列表等基础文本格式
- **文本样式**: 粗体、斜体、下划线、删除线、颜色、高亮
- **媒体支持**: 图片插入、代码块语法高亮
- **高级功能**: 表格编辑、任务列表、超链接、文本缩进、对齐方式
- **扩展性**: 基于 Tiptap 的插件架构，易于自定义扩展
- **国际化**: 内置 i18n 支持
- **大纲视图**: 文档结构导航

## 安装

```bash
pnpm add @textory/editor
```

### Peer Dependencies

需要安装以下依赖:

```bash
pnpm add react react-dom
pnpm add @tiptap/core @tiptap/react @tiptap/starter-kit
pnpm add @tiptap/extension-color @tiptap/extension-highlight
pnpm add @tiptap/extension-paragraph @tiptap/extension-text-align
pnpm add @tiptap/extension-text-style @tiptap/extension-underline
```

## 基本用法

```tsx
import Editor from '@textory/editor';
import type { TEasyEditorProps } from '@textory/editor';

function App() {
  const handleChange = (content: any) => {
    console.log('Editor content:', content);
  };

  return (
    <Editor
      content={initialContent}
      onChange={handleChange}
      placeholder="开始输入..."
      editable={true}
    />
  );
}
```

## API

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `content` | `JSON \| string` | - | 编辑器初始内容 |
| `onChange` | `(content: JSON) => void` | - | 内容变化回调函数 |
| `placeholder` | `string` | `"请输入"` | 占位符文本 |
| `editable` | `boolean` | `true` | 是否可编辑 |
| `autoFocus` | `boolean` | - | 是否自动聚焦 |
| `imageProps` | `ImageProps` | - | 图片配置选项 |

### ImageProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `max` | `number` | `0` | 最大图片数量 (0 为无限制) |
| `minWidth` | `number` | `100` | 最小图片宽度 (px) |
| `minHeight` | `number` | `100` | 最小图片高度 (px) |

## 内置扩展

编辑器默认包含以下扩展:

- **文本格式**: Bold, Italic, Underline, Strike, Color, Highlight
- **块级元素**: Heading, Paragraph, Blockquote, Horizontal Rule
- **列表**: Bullet List, Ordered List, Task List
- **媒体**: Image, Code Block (语法高亮)
- **表格**: 支持调整大小、气泡菜单编辑
- **其他**: Link, Indent, Text Align, Placeholder

## 开发

### 本地开发

```bash
# 开发模式
pnpm dev

# 构建
pnpm build

# 清理
pnpm clean
```

### 项目结构

```
src/
├── index.ts              # 导出入口
├── root.tsx              # 主编辑器组件
├── BulletList/           # 自定义列表实现
├── components/           # UI 组件
├── extension/            # 自定义扩展
├── hooks/                # React Hooks
├── node/                 # 节点定义
├── utils/                # 工具函数
└── views/                # 视图组件
```

## 依赖

该包依赖以下内部包:

- `@textory/context` - 编辑器上下文和状态管理
- `@textory/editor-common` - 共享工具和常量
- `@textory/editor-toolbar` - 工具栏组件
- `@textory/extension-*` - 各类扩展包

## License

MIT
