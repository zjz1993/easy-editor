// 全局 404 页
import { Link } from 'react-router-dom';
import type { FC } from 'react';

const NotFoundPage: FC = () => {
  return (
    <div className="docs-notfound docs-notfound--global">
      <h1>404</h1>
      <p>页面不存在</p>
      <div>
        <Link to="/">回首页</Link>
        <span style={{ margin: '0 12px', color: '#ccc' }}>·</span>
        <Link to="/docs">看文档</Link>
        <span style={{ margin: '0 12px', color: '#ccc' }}>·</span>
        <Link to="/playground">试演练场</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
