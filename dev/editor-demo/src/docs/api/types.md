---
title: 类型定义
category: API 参考
order: 3
description: TTextoryEditorProps、EditorRef、ExportOptions 等类型
---

# 类型定义

Textory 完全用 TypeScript 编写，所有类型随包导出。

## TTextoryEditorProps

Editor 组件的完整 props 类型：

```ts
import type { TTextoryEditorProps } from '@textory/editor';
```

主要字段：

| 字段 | 类型 |
| --- | --- |
| `content` | `string \| object` |
| `editable` | `boolean` |
| `placeholder` | `string` |
| `outputHTML` | `boolean` |
| `onChange` | `(data: string \| object) => void` |
| `title` | `string` |
| `className` | `string` |
| `style` | `CSSProperties` |
| `autoFocus` | `boolean \| 'start' \| 'end'` |
| `imageProps` | 图片上传配置 |
| `exportProps` | 导出配置 |
| `features` | 可选功能开关，见 [FEATURES](#features) |
| `exportWORD` | 见 [Editor API](/docs/api/editor) |

## EditorRef

```ts
import type { EditorRef } from '@textory/editor';

const ref = useRef<EditorRef>(null);
```

| 方法 | 签名 |
| --- | --- |
| `export` | `(options?: ExportOptions) => Promise<void>` |

## ExportOptions

```ts
import type { ExportOptions } from '@textory/editor';
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `content` | `string \| object` | 自定义导出内容（默认用编辑器当前内容） |
| `filename` | `string` | 导出文件名 |
| `watermark` | `IExportWatermark` | 水印配置 |

## IExportWatermark

```ts
import type { IExportWatermark } from '@textory/editor';
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `text` | `string` | 水印文字 |
| `fontSize` | `number` | 字号（pt） |
| `color` | `string` | 颜色 |
| `opacity` | `number` | 透明度，0~1 |

## BLOCK_TYPES

所有块类型常量集中在 `@textory/editor-common`，用于扩展配置：

```ts
import { BLOCK_TYPES } from '@textory/editor-common';
```

包含：`P`、`H`、`UL`、`OL`、`CL`、`CLI`、`LI`、`QUOTE`、`HR`、`TL`、`IMG`、`TABLE` 等。

> [!IMPORTANT]
> 自定义扩展的 `name` 必须与 `BLOCK_TYPES` 常量保持一致，否则可能引起 schema 冲突。

## FEATURES

可选功能开关的常量集合，用于 `features` prop 的 key。从 `@textory/editor` 或 `@textory/context` 导入：

```ts
import { FEATURES, type FeatureFlags } from '@textory/editor';
```

| 常量 | 值 | 对应功能 |
| --- | --- | --- |
| `FEATURES.OUTLINE` | `'outline'` | 文档大纲（`OutlineExtension` + `<OutlineView />`） |

```ts
// FeatureName 由 FEATURES 推导得到，当前为 'outline'
type FeatureName = (typeof FEATURES)[keyof typeof FEATURES];

// features prop 的形状：每个 feature 都是可选 boolean，缺省视为 true
type FeatureFlags = Partial<Record<FeatureName, boolean>>;
```

> [!NOTE]
> 当前白名单只包含 `outline`。后续会逐步开放更多无 schema 依赖的可选功能（如 `export`、`link` 等）。新功能加入时只需扩展 `FEATURES` 常量，类型会自动推导。

## 函数组件约定

所有 Textory 内部组件：

- 使用 TypeScript 严格模式
- 类型与实现一同导出
- 函数组件使用 `FC` 泛型
- 为 props 定义清晰的 interface
