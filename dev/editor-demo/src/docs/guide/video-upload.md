---
title: 视频上传
category: 指南
order: 6
description: videoProps 接入、视频与封面上传、网络视频、CORS 限制、HTML 序列化
---

# 视频上传

视频功能由 `@textory/extension-video` 提供，已内置在 `@textory/editor` 中，通过 `videoProps` 配置上传行为。`@textory/extension-upload` 作为 image / file / video 共享的上传基建（进度插件、paste/drop 分发器），被 `@textory/editor` 在内部注册一次，使用方无需感知。

视频节点统一渲染为 `<video controls src poster>`，本地上传与网络视频走同一条渲染路径，浏览器按 `src` 指向的 codec/protocol 处理。

## 最小示例（推荐：返回值风格）

`onVideoUpload` 直接返回 URL 字符串或 `Promise<string>`，编辑器自动接管成功/失败/进度：

```jsx
import Editor from '@textory/editor';

render(
  <Editor
    editable
    videoProps={{
      accept: '.mp4,.webm,.mov,.m4v',
      maxFileSize: 100 * 1024, // KB
      onVideoUpload: async ({ file }) => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: fd,
        });
        if (!res.ok) throw new Error('上传失败');
        const data = await res.json();
        return data.url; // 返回视频最终地址
      },
    }}
  />
);
```

返回值风格优势：

- 写法直观，跟普通 `async` 函数一致
- `throw` 自动转为失败 UI（视频节点显示错误占位）
- 无需手动调用 `onSuccess` / `onError`

## 回调风格（兼容旧用法）

如果上传流程涉及第三方组件（如 antd Upload），不方便返回值，可以使用回调风格：返回 `void`，手动调用 `option.onSuccess`：

```jsx
render(
  <Editor
    editable
    videoProps={{
      accept: '.mp4,.webm',
      maxFileSize: 100 * 1024,
      onVideoUpload: ({ file, onSuccess, onError, onProgress }) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload');
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            onProgress({ percent: (e.loaded / e.total) * 100 });
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            const url = JSON.parse(xhr.responseText).url;
            onSuccess?.({ data: url });
          } else {
            onError?.(new Error('HTTP ' + xhr.status));
          }
        };
        xhr.onerror = () => onError?.(new Error('network'));
        const fd = new FormData();
        fd.append('file', file);
        xhr.send(fd);
      },
    }}
  />
)
```

> [!IMPORTANT]
> 回调风格**必须**在失败时调用 `option.onError`。若吞掉错误（try/catch 不转发），视频节点会一直停在「上传中」状态，永远不会切换到错误 UI。

## 错误处理与 UI 状态

上传流程内置三态 UI：

| 状态 | 触发 | 节点外观 |
| --- | --- | --- |
| 上传中 | `onStart` 后立即进入 | 显示视频占位 + 圆形进度环 |
| 成功 | 返回 URL / 调用 `onSuccess` | 显示 `<video>` 播放器，hover 出节点工具栏 |
| 失败 | `throw` / 调用 `onError` | 显示错误占位，可删除重传 |

返回值风格中，任何 `throw` 的 `Error` 都会被自动转发到失败分支：

```jsx
onVideoUpload: async ({ file }) => {
  if (file.size > 200 * 1024 * 1024) {
    throw new Error('视频不能超过 200MB'); // 触发失败 UI
  }
  // ...
  return url;
}
```

## 上传生命周期钩子

需要在副作用里做埋点、loading 遮罩等，使用四个钩子：

| 钩子 | 触发时机 | 典型用途 |
| --- | --- | --- |
| `onVideoBeforeUpload(file, fileList)` | 上传前 | 校验，返回 `false` 取消上传 |
| `onVideoStartUpload()` | 每个视频开始上传 | 显示全局 loading |
| `onVideoEndUpload()` | 每个视频上传完成（成功/失败均触发） | 隐藏 loading |
| `onProgress({ percent })` | 进度变化（仅回调风格需要手动调） | 进度环 |

```jsx
render(
  <Editor
    editable
    videoProps={{
      onVideoBeforeUpload: (file) => {
        if (file.size === 0) {
          alert('文件为空');
          return false;
        }
        return true;
      },
      onVideoStartUpload: () => setUploadingCount((n) => n + 1),
      onVideoEndUpload: () => setUploadingCount((n) => n - 1),
      onVideoUpload: async ({ file }) => { /* ... */ return url; },
    }}
  />
)
```

## 体积与格式限制

| Prop | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `accept` | `string` | `'.mp4,.webm,.mov,.m4v'` | 文件选择框 accept 属性，逗号分隔扩展名 |
| `maxFileSize` | `number` | `102400` | 单个视频最大体积（**KB**），100MB，超出由 Upload 组件拦截 |

> [!NOTE]
> `accept` 仅约束工具栏文件选择框。粘贴/拖拽入口不校验扩展名——浏览器 MIME 不可信，校验应在 `onVideoBeforeUpload` 中自行实现。

## 支持的来源

| 入口 | 触发方式 | 是否可关闭 |
| --- | --- | --- |
| 工具栏「视频」按钮 → 上传本地视频 | 点击 → 选择文件 | 设 `features.videoUpload=false` 移除按钮 |
| 工具栏「视频」按钮 → 插入网络视频 | 点击 → 弹窗填 URL | 跟随 `features.videoUpload` |
| 粘贴 | 直接 Cmd/Ctrl+V 粘贴视频文件 | 跟随 `features.videoUpload` |
| 拖拽 | 拖视频到编辑器内任意位置 | 跟随 `features.videoUpload` |

> [!IMPORTANT]
> 图片、文件、视频使用独立的 paste/drop 分支。同一次粘贴同时含多种类型时，**第一个识别成功的类型会 preventDefault**，阻断后续分发。粘贴截图会走图片通道，粘贴 .mp4 会走视频通道。

## 网络视频

工具栏「视频」按钮的下拉里提供「插入网络视频」入口，弹窗支持两个字段：

- **视频地址**（必填）：需为平台支持**直接播放**的 URL
- **封面地址**（可选）：粘贴图片 URL 直接写入 `<video poster>`

> [!NOTE]
> 网络视频不会自动把观看页 URL（如 `https://www.bilibili.com/video/BV1xx`）转换为可播放 URL。请粘贴对应平台的播放器嵌入地址（如 `//player.bilibili.com/player.html?bvid=...`），浏览器按 `src` 指向的 codec/protocol 处理。

## 封面（poster）

视频节点支持可选的封面图 `<video poster>`，编辑器内与 Word 导出均会使用。封面有三种来源：

| 来源 | 触发方式 | 存储形式 |
| --- | --- | --- |
| 网络视频弹窗贴 URL | 弹窗「封面地址」字段提交 | URL 字符串写入 `attrs.poster` |
| 节点工具栏抓帧上传 | 选中视频 hover 出工具栏 → 点击「设为封面」→ 抓取当前播放帧 → 转 PNG File → 调 `onPosterUpload` 上传 | 返回的 URL 写入 `attrs.poster` |
| 降级 dataURL | 未配置 `onPosterUpload` 时的兜底 | base64 dataURL 直接存入 `attrs.poster`（不推荐） |

### `onPosterUpload` 最小示例（推荐：返回值风格）

`onPosterUpload` 与 `onVideoUpload` 的调用约定完全一致，只是触发时机不同——由「设为封面」按钮触发，传入的 `file` 是当前播放帧的 PNG：

```jsx
<Editor
  editable
  videoProps={{
    onVideoUpload: async ({ file }) => { /* ... */ return url; },
    onPosterUpload: async ({ file }) => {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error('封面上传失败');
      const data = await res.json();
      return data.url; // 返回封面最终地址
    },
  }}
/>
```

> [!IMPORTANT]
> **生产环境强烈建议配置 `onPosterUpload`**。未配置时，抓取的帧会以 base64 dataURL 直接存入文档 JSON——大视频高分辨率帧可能生成数 MB 字符串，拖累编辑器性能。

### CORS 限制与跨域抓帧

抓帧走 `canvas.drawImage(video)` → `canvas.toBlob()`，跨域视频会让 canvas 被 **taint**，导致 `toBlob` 抛 `SecurityError`。编辑器做了两层处理：

1. **直接抓帧失败**时，自动 fallback：用 offscreen `<video crossOrigin="anonymous">` 重新加载 src 并 seek 到同一时间点再抓
2. **fallback 仍失败**（服务器未返回 `Access-Control-Allow-Origin`）时，弹出 `video.poster.capture.failed` 错误提示，**不会写入 `attrs.poster`**

要让跨域视频支持抓帧，视频资源服务器需返回：

```
Access-Control-Allow-Origin: *
```

或对应的具体 origin。

> [!NOTE]
> 完全无 CORS 头的跨域视频无法生成封面，这是浏览器安全策略，编辑器无法绕过。

### 抓帧加载状态

「设为封面」是异步动作（抓帧 + 上传），按钮内置 loading 反馈：

- 点击后图标切换为 `loading` + 旋转动画
- 「设为封面」与「清除封面」按钮同时禁用
- 上传完成或失败后自动恢复

使用方无需额外处理。若 `onPosterUpload` 抛错，会触发 `video.poster.upload.failed` 提示并回退到 dataURL 兜底（避免功能完全失效）。

### 清除封面

节点工具栏点击「清除封面」按钮可移除 `attrs.poster`，无需走上传通道。

## 功能开关

```jsx
<Editor features={{ videoUpload: false }} />
```

`features.videoUpload` 默认 `true`。设为 `false` 后：

- 工具栏不渲染视频按钮
- `VideoExtension` 不注册（节点类型不存在）
- 粘贴/拖拽视频文件不会触发上传

> [!IMPORTANT]
> `features` **仅在 mount 时生效**。运行时切换需给 `<Editor>` 加 `key` 强制 remount，参见 [Editor API · 功能开关](/docs/api/editor#功能开关features)。

## HTML 序列化

视频节点序列化为标准 `<video>` 标签：

```html
<video controls src="https://cdn.example.com/foo.mp4" poster="https://cdn.example.com/foo.jpg" data-file-size="12345678" name="foo.mp4"></video>
```

- `src`：视频地址（对应 `attrs.src`）
- `poster`：封面地址（对应 `attrs.poster`，可选）
- `data-file-size`：文件字节数（对应 `attrs.size`，仅本地上传有）
- `name`：文件名（对应 `attrs.name`，仅本地上传有）

这保证：

- `editor.getHTML()` 拿到的 `<video>` 是标准 HTML5 元素，外部消费者（如静态站点、RSS 阅读器）可直接播放
- `setContent(html)` 再次注入时，视频节点能通过 `parseHTML` 规则（`tag: 'video[src]'`）恢复

## Word 导出

视频无法直接嵌入 .docx（docx-js 无原生 video run），编辑器采用**封面图 + 超链接**的复合方案：

- 若 `attrs.poster` 存在，渲染封面图为 `ImageRun`，并整体包裹 `ExternalHyperlink` 指向 `attrs.src`
- 若无封面，渲染「视频链接」文本超链接

详见 [导出能力](/docs/guide/export)。

## 内部机制：uploadKey

视频节点内部使用独立的 `uploadKey` 属性跟踪上传过程，**不依赖节点 `id`**。原因与图片一致：若使用方开启了 `@tiptap/extension-unique-id` 等会改写节点 `id` 的插件，上传流程通过 `id` 查找节点会失败。使用方**无需关心** `uploadKey`。

## 节点属性

```ts
type VideoNodeAttributes = {
  src?: string;        // 视频 URL，上传中为空（支持错误占位节点）
  poster?: string;     // 封面 URL / dataURL
  width?: number;
  height?: number;
  name?: string;       // 文件名（含扩展名，仅本地上传）
  size?: number;       // 文件字节数（仅本地上传）
  textAlign?: 'center' | 'left' | 'right';
  uploadKey?: string;  // 上传追踪 key，独立于 id
  id?: string;
  isError?: boolean;   // 是否显示错误占位
};
```

## 完整 Prop 列表

```ts
type IVideoProps = {
  accept?: string;
  maxFileSize: number; // KB
  onVideoBeforeUpload: (file: File, fileList: File[]) => boolean;
  onVideoStartUpload: () => void;
  onVideoEndUpload: () => void;
  onVideoUpload: (options: {
    file: File;
    onProgress?: (e: { percent: number }) => void;
    onSuccess?: (body: { data: string }) => void;
    onError?: (err: Error) => void;
  }) => void | string | Promise<string>;
  onPosterUpload?: (options: {
    file: File;
    onProgress?: (e: { percent: number }) => void;
    onSuccess?: (body: { data: string }) => void;
    onError?: (err: Error) => void;
  }) => void | string | Promise<string>;
};
```

完整类型定义见 [类型定义](/docs/api/types)。
