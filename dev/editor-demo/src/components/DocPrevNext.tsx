// 底部「上一页 / 下一页」按钮
import { Link } from 'react-router-dom';
import { getPrevNext } from '../utils/docsGraph';
import type { FC } from 'react';

interface DocPrevNextProps {
  slug: string;
}

const DocPrevNext: FC<DocPrevNextProps> = ({ slug }) => {
  const { prev, next } = getPrevNext(slug);
  if (!prev && !next) return null;

  return (
    <nav className="docs-prevnext">
      {prev ? (
        <Link to={prev.slug} className="docs-prevnext__item docs-prevnext__item--prev">
          <span className="docs-prevnext__label">← 上一页</span>
          <span className="docs-prevnext__title">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={next.slug} className="docs-prevnext__item docs-prevnext__item--next">
          <span className="docs-prevnext__label">下一页 →</span>
          <span className="docs-prevnext__title">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
};

export default DocPrevNext;
