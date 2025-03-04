import { LinkPanelPopup } from '@easy-editor/editor-toolbar/src/components/LinkButton/LinkPanel.tsx';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { useEffect, useState } from 'react';

const LinkToolbar = ({ editor, linkPos, referenceEl, onClose }) => {
  const [href, setHref] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    const { from, to } = editor.state.selection;
    const link = editor.getAttributes('link');
    setHref(link.href || '');
    setText(editor.state.doc.textBetween(from, to));
  }, [editor, linkPos]);

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(8), shift(), flip()],
    whileElementsMounted: autoUpdate,
    elements: {
      reference: referenceEl,
    },
  });

  const handleUpdate = () => {
    editor
      .chain()
      .focus()
      .setTextSelection(linkPos)
      .updateAttributes('link', { href })
      .insertContent(text)
      .run();
    onClose();
  };

  const handleRemove = () => {
    editor.chain().focus().unsetLink().run();
    onClose();
  };

  return (
    <div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        padding: '8px',
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
      className="link-toolbar"
    >
      <LinkPanelPopup
        onConfirm={({ text, href }) => {
          console.log('text是', text, href);
        }}
      />
    </div>
  );
};
export default LinkToolbar;
