import type { FC } from 'react';

const QuickStart: FC = () => {
  return (
    <section className="intro-section" id="quickstart">
      <div className="intro-section__head">
        <span className="intro-section__tagline">QUICK START</span>
        <h2 className="intro-section__title">三步即可在你的项目中集成</h2>
        <p className="intro-section__desc">
          样式与 JS 分离发布，通过子路径引入主题，纯净的 ESM 输出。
        </p>
      </div>
      <div className="intro-code">
        <div className="intro-code__col">
          <h3>安装</h3>
          <p>Textory 把样式与 JS 拆开发布，使用时分别引入：</p>
          <ul>
            <li><code>@textory/editor</code> — 编辑器 JS 主入口</li>
            <li><code>@textory/editor/theme/normal.css</code> — 主题样式</li>
            <li>React / Tiptap 系列作为 peerDependency 自动共享</li>
            <li>每个扩展包可单独引用，按需组合</li>
          </ul>
        </div>
        <div className="intro-code__block">
          <pre><code>{`# 1. 安装
pnpm add @textory/editor react react-dom

# 2. 在项目入口引入样式
# import '@textory/editor/theme/normal.css'

# 3. 使用`}</code></pre>
        </div>
      </div>
      <div className="intro-code" style={{ marginTop: 24 }}>
        <div className="intro-code__block">
          <pre><code>{`import Editor from '@textory/editor';
import '@textory/editor/theme/normal.css';

function App() {
  return (
    <Editor
      placeholder="开始书写..."
      title="我的文档"
      outputHTML
      onChange={(html) => console.log(html)}
      exportProps={{
        watermark: { text: '机密', fontSize: 52 },
      }}
      imageProps={{
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
}`}</code></pre>
        </div>
        <div className="intro-code__col">
          <h3>常用 Props</h3>
          <ul>
            <li><code>content</code> — 初始内容（HTML 或 JSON）</li>
            <li><code>editable</code> — 是否可编辑</li>
            <li><code>placeholder</code> — 空内容占位符</li>
            <li><code>outputHTML</code> — 输出 HTML 或 JSON</li>
            <li><code>exportProps</code> — 导出 Word 配置（含水印）</li>
            <li><code>imageProps</code> — 图片上传与校验配置</li>
            <li><code>onChange</code> — 内容变更回调</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default QuickStart;
