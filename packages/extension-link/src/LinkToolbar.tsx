import { Iconfont, MARK_TYPES, Popover } from '@easy-editor/editor-common';
import { LinkPanelPopup } from '@easy-editor/editor-toolbar/src/components/LinkButton/LinkPanel.tsx';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import './toolbar.scss';

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
  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
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
      .unsetMark(MARK_TYPES.LK)
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
      }}
      className="easy-editor-link-toolbar"
      onMouseLeave={() => {
        // onClose();
      }}
    >
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
  );
};
export default LinkToolbar;
