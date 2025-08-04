// components/CodeLineNodeView.tsx
import React, {useEffect, useRef, useState} from 'react';
import {NodeViewContent, NodeViewWrapper} from '@tiptap/react';
import type {NodeViewRendererProps} from '@tiptap/core';

const CodeLineNodeView = (props: NodeViewRendererProps) => {
  const { editor, getPos, node } = props;
  const [htmlContent, setHtmlContent] = useState('');
  const [lineNumber, setLineNumber] = useState(1);
  const lineNumberRef = useRef<HTMLSpanElement>(null);

  const updateLineNumber = () => {
    const pos = getPos();
    if (typeof pos !== 'number') return;

    const resolvedPos = editor.state.doc.resolve(pos);
    const parent = resolvedPos.parent; // 使用 parent 属性更直接

    if (!parent) return;

    // 使用 Tiptap 提供的更高效方法
    const indexInParent = resolvedPos.index() + 1;
    setLineNumber(indexInParent);
  };
  const highlight = () => {
    const pos = getPos();
    if (typeof pos !== 'number') return;
    const resolvedPos = editor.state.doc.resolve(pos);
    const parent = resolvedPos.parent; // 使用 parent 属性更直接
    const lang = parent?.attrs?.language || 'plaintext';
    const text = node.textContent;
    console.log('lang是', lang, text);
  };

  // 每次文档变化时更新行号
  useEffect(() => {
    updateLineNumber();
    highlight();
    const update = () => {
      updateLineNumber();
      highlight();
    };
    editor.on('update', update);

    return () => {
      editor.off('update', update);
    };
  }, []);
  return (
    <NodeViewWrapper
      as="div"
      className="easy-editor-code-block__code-line"
      data-type="code-line"
      data-line-num={lineNumber}
    >
      <span className="line-number" ref={lineNumberRef}>
        {lineNumber}
      </span>
      <div className="code-line-container">
        <pre
          className="highlighted"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        <NodeViewContent as="div" className="code-line-editor" />
      </div>
    </NodeViewWrapper>
  );
};
export default CodeLineNodeView;
