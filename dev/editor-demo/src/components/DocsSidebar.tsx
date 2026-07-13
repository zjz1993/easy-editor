// 左侧边栏：按 category 分组列出所有文档
import { Link, useLocation } from 'react-router-dom';
import { sidebarGroups } from '../utils/docsGraph';
import type { FC } from 'react';

interface DocsSidebarProps {
  onNavigate?: () => void;
}

const DocsSidebar: FC<DocsSidebarProps> = ({ onNavigate }) => {
  const { pathname } = useLocation();

  return (
    <nav className="docs-sidebar">
      {sidebarGroups.map((group) => (
        <div key={group.category} className="docs-sidebar__group">
          <h3 className="docs-sidebar__group-title">{group.category}</h3>
          <ul className="docs-sidebar__list">
            {group.items.map((doc) => {
              const active = pathname === doc.slug;
              return (
                <li key={doc.slug}>
                  <Link
                    to={doc.slug}
                    className={
                      'docs-sidebar__link' +
                      (active ? ' docs-sidebar__link--active' : '')
                    }
                    onClick={onNavigate}
                  >
                    {doc.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default DocsSidebar;
