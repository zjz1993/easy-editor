// 文档页专属简化顶栏：Logo + 搜索框 + 类别切换
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { FC } from 'react';
import DocsSearch from './DocsSearch';

interface DocsTopBarProps {
  onOpenSidebar?: () => void;
}

const DocsTopBar: FC<DocsTopBarProps> = ({ onOpenSidebar }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  // Cmd/Ctrl + K 唤起搜索
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <header className="docs-topbar">
        <div className="docs-topbar__left">
          {onOpenSidebar && (
            <button
              type="button"
              className="docs-topbar__menu"
              onClick={onOpenSidebar}
              aria-label="打开导航"
            >
              ☰
            </button>
          )}
          <Link className="docs-topbar__brand" to="/">
            <span className="docs-topbar__logo">EE</span>
            <span>Textory</span>
          </Link>
          <span className="docs-topbar__title">文档</span>
        </div>

        <div className="docs-topbar__right">
          <button
            type="button"
            className="docs-topbar__search"
            onClick={() => setSearchOpen(true)}
          >
            <span className="docs-topbar__search-icon">⌕</span>
            <span>搜索文档…</span>
            <kbd className="docs-topbar__kbd">⌘K</kbd>
          </button>
          <Link className="docs-topbar__link" to="/playground">
            演练场
          </Link>
        </div>
      </header>

      {searchOpen && <DocsSearch onClose={() => setSearchOpen(false)} />}
    </>
  );
};

export default DocsTopBar;
