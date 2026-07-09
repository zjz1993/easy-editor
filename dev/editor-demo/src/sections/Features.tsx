import type { FC } from 'react';
import { FEATURES } from '../data/features';

const Features: FC = () => {
  return (
    <section className="intro-section" id="features">
      <div className="intro-section__head">
        <span className="intro-section__tagline">FEATURES</span>
        <h2 className="intro-section__title">覆盖文档创作的全链路能力</h2>
        <p className="intro-section__desc">
          从文本格式、表格到代码高亮、Word 导出，每个能力都是独立扩展，互不耦合。
        </p>
      </div>
      <div className="intro-features">
        {FEATURES.map((f) => (
          <div className="intro-features__card" key={f.title}>
            <div className="intro-features__card-icon">{f.icon}</div>
            <h3 className="intro-features__card-title">{f.title}</h3>
            <p className="intro-features__card-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
