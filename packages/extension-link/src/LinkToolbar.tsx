import { Iconfont, MARK_TYPES, Popover } from '@easy-editor/editor-common';
import { LinkPanelPopup } from '@easy-editor/editor-toolbar/src/components/LinkButton/LinkPanel.tsx';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';

const LinkToolbar = ({
  from,
  to,
  text,
  href,
  editor,
  linkPos,
  referenceEl,
  onClose,
}) => {
  //const [href, setHref] = useState('');
  //const [text, setText] = useState('');
  //

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(8), shift(), flip()],
    whileElementsMounted: autoUpdate,
    elements: {
      reference: referenceEl,
    },
    onOpenChange: open => {
      console.log('open是', open);
    },
  });

  const handleUpdate = (params: { text: string; href: string }) => {
    const { text, href } = params;
    editor
      .chain()
      .focus()
      .setTextSelection(linkPos)
      .updateAttributes(MARK_TYPES.LK, { href })
      .insertContentAt({ from, to }, text)
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
      onMouseLeave={() => {
        onClose();
      }}
    >
      <div>
        <Popover
          content={
            <LinkPanelPopup
              text={text}
              href={href}
              onCancel={onClose}
              onConfirm={({ text, href }) => {
                handleUpdate({ text, href });
              }}
            />
          }
        >
          <Iconfont type="icon-edit" />
        </Popover>
        <Iconfont type="icon-remove" />
      </div>
    </div>
  );
};
export default LinkToolbar;
