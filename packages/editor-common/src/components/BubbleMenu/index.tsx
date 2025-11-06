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
      shouldShow,
    });

    editor.registerPlugin(plugin);
    return () => {
      editor.unregisterPlugin(pluginKey);
    };
  }, [editor, element]);

  return (
    <div
      ref={setElement}
      className={className}
      style={{ visibility: 'hidden' }}
    >
      {props.children}
    </div>
  );
};
