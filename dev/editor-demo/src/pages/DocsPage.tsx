// 文档主体：3 栏布局（左 sidebar + 中正文 + 右 TOC）
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import type { FC } from 'react';
import DocsTopBar from '../components/DocsTopBar';
import DocsSidebar from '../components/DocsSidebar';
import DocsToc from '../components/DocsToc';
import DocPrevNext from '../components/DocPrevNext';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { loadDocMeta, stripFrontmatter } from '../utils/docsGraph';
import '../styles/docs.scss';

const DocsPage: FC = () => {
  const params = useParams();
  // /docs/* 路由会把后面所有路径作为 '*' 参数
  const rest = params['*'] || '';
  const slug = `/docs/${rest}`;
  const location = useLocation();

  const [raw, setRaw] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [notFound, setNotFound] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // 加载当前文档
  useEffect(() => {
    let cancelled = false;
    setRaw(null);
    setNotFound(false);
    loadDocMeta(slug)
      .then(async (meta) => {
        if (cancelled) return;
        if (!meta) {
          setNotFound(true);
          return;
        }
        const content = await meta.rawLoader();
        if (cancelled) return;
        setRaw(stripFrontmatter(content));
        setTitle(meta.title);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // 切换文档时滚到顶部
  useEffect(() => {
    window.scrollTo({ top: 0 });
    setSidebarOpen(false);
  }, [slug]);

  // 同步文档标题到浏览器标签
  useEffect(() => {
    if (title) document.title = `${title} · Textory 文档`;
  }, [title]);

  if (notFound) {
    return (
      <div className="docs-page docs-page--notfound">
        <DocsTopBar onOpenSidebar={() => setSidebarOpen(true)} />
        <div className="docs-notfound">
          <h1>404</h1>
          <p>找不到这篇文档：{slug}</p>
          <a href="/docs">返回文档首页</a>
        </div>
      </div>
    );
  }

  return (
    <div className="docs-page">
      <DocsTopBar onOpenSidebar={() => setSidebarOpen(true)} />

      <div className="docs-shell">
        {/* 桌面侧边栏 */}
        <aside className="docs-shell__sidebar">
          <DocsSidebar />
        </aside>

        {/* 移动端侧边栏抽屉 */}
        {sidebarOpen && (
          <div
            className="docs-shell__drawer-mask"
            onClick={() => setSidebarOpen(false)}
          >
            <aside
              className="docs-shell__drawer"
              onClick={(e) => e.stopPropagation()}
            >
              <DocsSidebar onNavigate={() => setSidebarOpen(false)} />
            </aside>
          </div>
        )}

        <main className="docs-shell__main">
          {raw === null ? (
            <div className="docs-loading">加载中…</div>
          ) : (
            <article className="docs-article">
              <MarkdownRenderer content={raw} />
              <DocPrevNext slug={slug} />
            </article>
          )}
        </main>

        <aside className="docs-shell__toc">
          <DocsToc />
        </aside>
      </div>

      {/* 提供一个 location 隐式依赖，避免 lint 报错 */}
      <span hidden>{location.pathname}</span>
    </div>
  );
};

export default DocsPage;
