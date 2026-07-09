import type { FC } from 'react';
import { HIGHLIGHTS } from '../data/features';

const Highlights: FC = () => {
  return (
    <section className="intro-section" id="architecture">
      <div className="intro-section__head">
        <span className="intro-section__tagline">ARCHITECTURE</span>
        <h2 className="intro-section__title">为工程化而生</h2>
        <p className="intro-section__desc">
          清晰的包边界、依赖外置策略与统一构建，让二次开发与按需引入都游刃有余。
        </p>
      </div>
      <div className="intro-highlights">
        {HIGHLIGHTS.map((h) => (
          <div className="intro-highlights__item" key={h.title}>
            <div className="intro-highlights__item-icon">{h.icon}</div>
            <div>
              <h4>{h.title}</h4>
              <p>{h.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Highlights;
