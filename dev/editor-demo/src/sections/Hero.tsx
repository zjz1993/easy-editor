import type { FC } from 'react';
import { STATS } from '../data/features';

interface HeroProps {
  onPrimaryClick: () => void;
}

const Hero: FC<HeroProps> = ({ onPrimaryClick }) => {
  return (
    <header className="intro-hero">
      <span className="intro-hero__eyebrow">⚡ 基于 Tiptap 的模块化富文本编辑器</span>
      <h1 className="intro-hero__title">
        专注内容创作<br />让编辑器替你处理格式
      </h1>
      <p className="intro-hero__subtitle">
        Textory(Text + Factory) 是一个开箱即用的富文本编辑器，采用 TypeScript + pnpm workspaces 的 monorepo 架构。
        每个功能以独立扩展包的形式存在，便于按需组合与扩展。
      </p>
      <div className="intro-hero__cta">
        <a className="intro-hero__btn intro-hero__btn--primary" href="#demo" onClick={(e) => { e.preventDefault(); onPrimaryClick(); }}>
          在线体验 →
        </a>
        <a className="intro-hero__btn intro-hero__btn--ghost" href="#quickstart">
          快速开始
        </a>
      </div>
      <div className="intro-hero__stats">
        {STATS.map((s) => (
          <div className="intro-hero__stat" key={s.label}>
            <div className="intro-hero__stat-value">{s.value}</div>
            <div className="intro-hero__stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Hero;
