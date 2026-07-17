import Editor, { type EditorRef } from '@textory/editor';
import { useState, type FC, MutableRefObject } from 'react';
import { DEMO_HTML } from '../data/demoContent';

interface EditorDemoProps {
  editorRef: MutableRefObject<EditorRef | null>;
}

const EditorDemo: FC<EditorDemoProps> = ({ editorRef }) => {
  const [outlineEnabled, setOutlineEnabled] = useState(true);
  const features = { outline: outlineEnabled, importWord: true };
  return (
    <section className="intro-section" id="demo">
      <div className="intro-section__head">
        <span className="intro-section__tagline">LIVE DEMO</span>
        <h2 className="intro-section__title">所见即所得，开箱即用</h2>
        <p className="intro-section__desc">
          直接在下方编辑器中尝试各类格式：标题、列表、表格、代码块、任务清单等，工具栏一键切换。
        </p>
      </div>
      <div className="intro-demo">
        <div className="intro-demo__bar">
          <span />
          <span />
          <span />
          <label className="intro-demo__toggle">
            <input
              type="checkbox"
              checked={outlineEnabled}
              onChange={(e) => setOutlineEnabled(e.target.checked)}
            />
            Outline 功能
          </label>
        </div>
        <div className="intro-demo__editor">
          <Editor
            /**
             * features 只在 mount 时生效，
             * 切换 outline 时通过 key 强制 remount。
             */
            key={outlineEnabled ? 'with-outline' : 'no-outline'}
            ref={editorRef}
            content={DEMO_HTML}
            placeholder="开始你的创作..."
            title="Textory 示例文档"
            outputHTML
            editable
            features={features}
            onChange={(data) => {
              // 演示 onChange 回调，可在控制台查看输出
              console.log('[demo] content changed', data);
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default EditorDemo;
