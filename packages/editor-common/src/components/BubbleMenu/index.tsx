import {BubbleMenuPlugin, type BubbleMenuPluginProps,} from '@tiptap/extension-bubble-menu';
import type React from 'react';
import {useEffect, useState} from 'react';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type BubbleMenuProps = Omit<
  Optional<BubbleMenuPluginProps, 'pluginKey'>,
  'element'
> & {
  className?: string;
  children: React.ReactNode;
  updateDelay?: number;
};

export const BubbleMenu = (props: BubbleMenuProps) => {
  const {
    pluginKey = 'bubbleMenu',
    editor,
    updateDelay,
    className,
    shouldShow = null,
  } = props;
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!element) {
      return;
    }

    if (editor.isDestroyed) {
      return;
    }

    const plugin = BubbleMenuPlugin({
      updateDelay,
      editor,
      element,
      pluginKey,
      shouldShow: props => {
        const show = shouldShow(props);

        // 3️⃣ React DOM 样式控制显示隐藏
        if (element) {
          element.style.display = show ? 'flex' : 'none';
        }

        return show;
      },
    });

    editor.registerPlugin(plugin);
    return () => {
      editor.unregisterPlugin(pluginKey);
    };
  }, [editor, element, shouldShow]);

  return (
    <>
      {editor.isEditable && (
        <div
          ref={setElement}
          className={className}
          // style={{ display: 'none' }}
          //style={{
          //  display: shouldShow({
          //    editor,
          //    element,
          //    view: editor.view,
          //    state: editor.state,
          //    from: editor.state.selection.from,
          //    to: editor.state.selection.to,
          //  })
          //    ? 'flex'
          //    : 'none',
          //}}
        >
          {props.children}
        </div>
      )}
    </>
  );
};
