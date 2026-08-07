// 在文档里嵌入 standalone-demo 的 HTML 示例，iframe 同源加载
import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';

interface StandaloneIframeProps {
  src: string;
  title: string;
}

const HEIGHT_DEFAULT = 720;
const HEIGHT_PRESETS: Record<string, number> = {
  'basic.html': 600,
  'external-react.html': 600,
  'upload.html': 720,
  'features.html': 760,
  'destroy.html': 720,
};

/**
 * 同源 iframe 加载 standalone-demo HTML。
 * - dev: editor-demo vite.config.ts 的 serveRepoFilesPlugin 服务 /standalone-demo/*
 * - prod: postbuild 把 HTML + UMD bundle 拷进 editor/ 输出目录，
 *   iframe 通过 ${BASE_URL}standalone-demo/<src> 访问
 */
const StandaloneIframe: FC<StandaloneIframeProps> = ({ src, title }) => {
  const [errored, setErrored] = useState(false);
  const [host, setHost] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // BASE_URL dev '/' prod '/editor/'
    const base = import.meta.env.BASE_URL;
    setHost(base.replace(/\/$/, '') + '/standalone-demo/' + src);
  }, [src]);

  const height = HEIGHT_PRESETS[src] ?? HEIGHT_DEFAULT;

  if (errored) {
    return (
      <div className="docs-iframe-fallback">
        <p>
          iframe 加载失败：<code>{host}</code>
        </p>
        <p style={{ marginTop: 8, fontSize: 13, color: '#57606a' }}>
          dev 模式请确认已运行 <code>pnpm start</code>；prod 模式请确认 build 时
          <code> @textory/standalone </code> UMD 产物存在（见
          <code> editor/standalone-demo/</code> 与
          <code> editor/packages/standalone/dist/</code>）。
        </p>
      </div>
    );
  }

  const barPath = host.replace(/^\w+:\/\/[^/]+/, '');

  return (
    <div className="docs-iframe-wrap">
      <div className="docs-iframe-bar">
        <span className="docs-iframe-dot" />
        <span className="docs-iframe-path">{barPath}</span>
        <a
          className="docs-iframe-open"
          href={host}
          target="_blank"
          rel="noopener noreferrer"
        >
          新窗口打开
        </a>
      </div>
      <iframe
        ref={iframeRef}
        title={title}
        src={host}
        height={height}
        className="docs-iframe"
        onError={() => setErrored(true)}
      />
    </div>
  );
};

export default StandaloneIframe;
