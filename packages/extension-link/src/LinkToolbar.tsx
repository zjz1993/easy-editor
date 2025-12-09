import {Iconfont, IntlComponent, MARK_TYPES, Tooltip,} from '@easy-editor/editor-common';
import {LinkPanelPopup} from '@easy-editor/editor-toolbar';
import {autoUpdate, flip, offset, shift, useFloating,} from '@floating-ui/react';
import {useState} from 'react';

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
  const [showEditPopup, setShowEditPopup] = useState(false);
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
    console.log('接收的参数是', params);
    editor
      .chain()
      .focus()
      .setTextSelection(linkPos)
      .insertContentAt(
        { from, to },
        {
          type: 'text',
          text,
          marks: [{ type: MARK_TYPES.LK, attrs: { href } }],
        },
      )
      .unsetMark(MARK_TYPES.LK)
      .run();
    onClose();
  };

  const handleDeleteLink = () => {
    editor.chain().focus().deleteRange({ from, to }).run();
    onClose();
  };

  const handleRemoveLink = () => {
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
        if (!showEditPopup) {
          onClose();
        }
      }}
    >
      {showEditPopup ? (
        <LinkPanelPopup
          text={text}
          href={href}
          onCancel={() => {
            console.log('onCancel触发');
            setShowEditPopup(false);
          }}
          onConfirm={({ text, href }) => {
            handleUpdate({ text, href });
          }}
        />
      ) : (
        <>
          <Iconfont
            type="icon-edit"
            className="easy-editor-link-toolbar-icon-edit"
            onClick={() => {
              setShowEditPopup(true);
            }}
          />
          <Tooltip content={IntlComponent.get('toolbar.link.unlink')}>
            <Iconfont
              type="icon-unlink"
              className="easy-editor-link-toolbar-icon-del"
              onClick={handleRemoveLink}
            />
          </Tooltip>
          <Tooltip content={IntlComponent.get('delete')}>
            <Iconfont
              type="icon-remove"
              className="easy-editor-link-toolbar-icon-del"
              onClick={handleDeleteLink}
            />
          </Tooltip>
        </>
      )}
    </div>
  );
};
export default LinkToolbar;
