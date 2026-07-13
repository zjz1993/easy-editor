import { Link } from 'react-router-dom';
import type { FC } from 'react';

interface NavProps {
  onTryClick: () => void;
}

const Nav: FC<NavProps> = ({ onTryClick }) => {
  return (
    <nav className="intro-nav">
      <div className="intro-nav__brand">
        <span className="intro-nav__logo">EE</span>
        <span>Textory</span>
      </div>
      <div className="intro-nav__links">
        <a href="#features">特性</a>
        <a href="#demo">演示</a>
        <a href="#quickstart">快速开始</a>
        <a href="#architecture">架构</a>
        <Link className="intro-nav__link" to="/playground">
          演练场
        </Link>
        <a className="intro-nav__tag" href="#demo" onClick={(e) => { e.preventDefault(); onTryClick(); }}>
          立即体验
        </a>
      </div>
    </nav>
  );
};

export default Nav;
