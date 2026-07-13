// Cmd+K 搜索面板：minisearch 全文索引 + 键盘导航
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSearchIndex } from '../utils/buildSearchIndex';
import type { SearchItem } from '../utils/buildSearchIndex';
import type { FC } from 'react';

interface DocsSearchProps {
  onClose: () => void;
}

type SearchResult = SearchItem & {
  score?: number;
  match?: Record<string, string[]>;
};

const DocsSearch: FC<DocsSearchProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // 关闭快捷键 Esc
  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // 输入变化时搜索
  useEffect(() => {
    let cancelled = false;
    if (query.trim().length === 0) {
      setResults([]);
      setActiveIdx(0);
      return;
    }
    setLoading(true);
    getSearchIndex()
      .then((index) => {
        if (cancelled) return;
        const r = index.search(query) as unknown as SearchResult[];
        setResults(r.slice(0, 12));
        setActiveIdx(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  // 键盘上下导航 + Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[activeIdx];
      if (target) {
        navigate(target.slug);
        onClose();
      }
    }
  };

  // active 项滚动到可见
  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    for (const r of results) {
      if (!map.has(r.category)) map.set(r.category, []);
      map.get(r.category)!.push(r);
    }
    return Array.from(map.entries());
  }, [results]);

  return (
    <div className="docs-search-overlay" onClick={onClose}>
      <div
        className="docs-search-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="docs-search__header">
          <span className="docs-search__icon">⌕</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="搜索文档…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="docs-search__input"
          />
          <kbd className="docs-search__esc" onClick={onClose}>
            Esc
          </kbd>
        </div>

        <ul ref={listRef} className="docs-search__list">
          {loading && <li className="docs-search__hint">加载中…</li>}
          {!loading && query && results.length === 0 && (
            <li className="docs-search__hint">没有匹配结果</li>
          )}
          {!loading && !query && (
            <li className="docs-search__hint">输入关键词开始搜索</li>
          )}
          {grouped.map(([category, items]) => (
            <li key={category} className="docs-search__group">
              <div className="docs-search__group-title">{category}</div>
              <ul>
                {items.map((r) => {
                  const idx = results.indexOf(r);
                  return (
                    <li key={r.slug}>
                      <button
                        type="button"
                        className={
                          'docs-search__item' +
                          (idx === activeIdx ? ' docs-search__item--active' : '')
                        }
                        onMouseEnter={() => setActiveIdx(idx)}
                        onClick={() => {
                          navigate(r.slug);
                          onClose();
                        }}
                      >
                        <span className="docs-search__item-title">{r.title}</span>
                        <span className="docs-search__item-slug">{r.slug}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>

        <div className="docs-search__footer">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> 切换
          </span>
          <span>
            <kbd>Enter</kbd> 跳转
          </span>
          <span>
            <kbd>Esc</kbd> 关闭
          </span>
        </div>
      </div>
    </div>
  );
};

export default DocsSearch;
