// 右侧本页目录：从当前渲染的 md 提取 H2/H3，点击锚点跳转，scroll spy 高亮
import { useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';

interface TocItem {
  id: string;
  text: string;
  level: number; // 2 / 3
}

interface DocsTocProps {
  /** md 正文容器选择器 */
  contentSelector?: string;
}

const DocsToc: FC<DocsTocProps> = ({ contentSelector = '.docs-content' }) => {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const collect = () => {
      const root = document.querySelector(contentSelector);
      if (!root) return [];
      const headings = Array.from(
        root.querySelectorAll<HTMLElement>('h2, h3'),
      );
      return headings
        .filter((h) => h.id)
        .map((h) => ({
          id: h.id,
          text: h.textContent || '',
          level: h.tagName === 'H2' ? 2 : 3,
        }));
    };
    // 延迟一帧确保 react-markdown 已渲染
    const id = requestAnimationFrame(() => setItems(collect()));
    return () => cancelAnimationFrame(id);
  }, [contentSelector]);

  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const activeId = useScrollSpy(ids);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  };

  if (items.length === 0) return null;

  return (
    <nav className="docs-toc">
      <h4 className="docs-toc__title">本页目录</h4>
      <ul className="docs-toc__list">
        {items.map((item) => (
          <li
            key={item.id}
            className={
              'docs-toc__item' +
              (item.level === 3 ? ' docs-toc__item--nested' : '') +
              (activeId === item.id ? ' docs-toc__item--active' : '')
            }
          >
            <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DocsToc;
