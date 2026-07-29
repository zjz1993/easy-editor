import {BubbleMenuPlugin, type BubbleMenuPluginProps,} from '@tiptap/extension-bubble-menu';
import type React from 'react';
import {useEffect, useRef, useState} from 'react';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

// 淡出动画时长，需与 SCSS 里 .textory-text-bubble / .textory-table-menu
// 的 transition 时长保持一致。
const FADE_OUT_MS = 140;

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

  // 保存淡出 setTimeout 句柄，便于 onShow 取消。
  // Tiptap plugin 的 hide() 会立刻 element.remove()，淡出动画来不及播。
  // 这里在 onHide 里把节点 re-append 回编辑器容器，
  // 用 inline transition + opacity 0→0 的方式触发淡出，
  // 淡出结束再真正 remove。
  const fadeOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!element) {
      return;
    }

    if (editor.isDestroyed || !editor.isEditable) {
      return;
    }

    const plugin = BubbleMenuPlugin({
      updateDelay,
      editor,
      element,
      pluginKey,
      shouldShow,
      options: {
        onShow: () => {
          // 取消 pending 淡出，避免 hide 紧接 show 时动画错乱
          if (fadeOutTimerRef.current) {
            clearTimeout(fadeOutTimerRef.current);
            fadeOutTimerRef.current = null;
          }
          // 清掉淡出阶段写入的 inline transition / opacity，
          // 交还 plugin 接管（show 会把 opacity 设为 1）。
          element.style.transition = '';
        },
        onHide: () => {
          // plugin hide() 已把 opacity 设为 0、visibility 设为 hidden，
          // 并已 element.remove()。这里手动复活节点播一段淡出。
          const appendToProp = props.appendTo;
          const appendTo =
            typeof appendToProp === 'function' ? appendToProp() : appendToProp;
          const host =
            appendTo ?? editor.view.dom.parentElement ?? document.body;

          host.appendChild(element);
          // 必须先 visible 才能 visible，否则 visibility:hidden 整体不绘制
          element.style.visibility = 'visible';
          element.style.opacity = '1';
          element.style.transition = `opacity ${FADE_OUT_MS}ms ease-out`;
          // 强制 reflow，让浏览器把 opacity:1 当作起始值
          void element.offsetHeight;
          element.style.opacity = '0';

          if (fadeOutTimerRef.current) {
            clearTimeout(fadeOutTimerRef.current);
          }
          fadeOutTimerRef.current = setTimeout(() => {
            element.remove();
            element.style.transition = '';
            fadeOutTimerRef.current = null;
          }, FADE_OUT_MS);
        },
      },
    });

    editor.registerPlugin(plugin);
    return () => {
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
        fadeOutTimerRef.current = null;
      }
      editor.unregisterPlugin(pluginKey);
    };
  }, [editor, element, shouldShow]);

  return (
    <>
      {editor.isEditable && (
        <div ref={setElement} className={className}>
          {props.children}
        </div>
      )}
    </>
  );
};
