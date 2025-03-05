import { MARK_TYPES } from '@easy-editor/editor-common/src/index.ts';
import { ReactRenderer } from '@tiptap/react';
import { Plugin, PluginKey } from 'prosemirror-state';
import LinkToolbar from './LinkToolbar.tsx';
import { Link } from './link.ts';

function getLinkRange(doc, pos, linkMark) {
  let from = pos;
  let to = pos;

  // 向前查找链接的起始位置
  while (from > 0) {
    const prevPos = doc.resolve(from - 1);
    if (!prevPos.marks().some(mark => mark.eq(linkMark))) {
      break;
    }
    from--;
  }

  // 向后查找链接的结束位置
  const docSize = doc.content.size;
  while (to < docSize) {
    const nextPos = doc.resolve(to + 1);
    if (!nextPos.marks().some(mark => mark.eq(linkMark))) {
      break;
    }
    to++;
  }

  return { from, to };
}
let inToolbar = false;

const CustomLink = Link.extend({
  name: MARK_TYPES.LK,

  addProseMirrorPlugins() {
    const plugins = this.parent?.() || [];

    const toolbarPlugin = new Plugin({
      key: new PluginKey('linkToolbar'),
      props: {
        handleDOMEvents: {
          mouseover: (view, event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement) || !target.closest('a'))
              return false;
            const linkElement = target.closest('a');

            const textNode = [...linkElement.childNodes].find(
              node => node.nodeType === Node.TEXT_NODE,
            );
            if (!textNode) return false;
            // 计算 pos
            const pos = view.posAtDOM(textNode, 0);
            const resolvedPos = view.state.doc.resolve(pos);
            // 获取 link mark
            const linkMark = resolvedPos
              .marks()
              .find(mark => mark.type.name === MARK_TYPES.LK);
            if (linkMark) {
              const { from, to } = getLinkRange(view.state.doc, pos, linkMark);
              // 创建容器并立即渲染工具栏
              console.log('linkMark是', linkMark);
              const container = document.createElement('div');
              document.body.appendChild(container);

              const component = new ReactRenderer(LinkToolbar, {
                editor: this.editor,
                props: {
                  editor: this.editor,
                  linkPos: pos,
                  referenceEl: target,
                  href: linkMark.attrs.href,
                  text: this.editor.state.doc.textBetween(from, to),
                  from,
                  to,
                  onClose: () => {
                    component.destroy();
                    container.remove();
                    inToolbar = false;
                    container.removeEventListener(
                      'mouseenter',
                      handleContainerMouseEnter,
                    );
                    target.removeEventListener('mouseleave', handleMouseOut);
                  },
                },
              });

              // 立即将 React 组件渲染到容器中
              container.appendChild(component.element);

              const handleMouseOut = (mouseoutEvent: MouseEvent) => {
                console.log('mouseleave触发');
                const relatedTarget = mouseoutEvent.relatedTarget;
                if (
                  relatedTarget instanceof Node &&
                  !target.contains(relatedTarget)
                ) {
                  setTimeout(() => {
                    console.log('inToolbar有吗', inToolbar);
                    if (!inToolbar) {
                      container.remove();
                      target.removeEventListener('mouseleave', handleMouseOut);
                    }
                    //if (!container.contains(relatedTarget)) {
                    //  container.remove();
                    //  target.removeEventListener('mouseleave', handleMouseOut);
                    //}
                  }, 500);
                }
              };
              const handleContainerMouseEnter = (mouseoutEvent: MouseEvent) => {
                console.log('在工具栏上');
                inToolbar = true;
              };
              //
              //// 为链接和工具栏都添加 mouseout 监听
              target.addEventListener('mouseleave', handleMouseOut);
              container.addEventListener(
                'mouseenter',
                handleContainerMouseEnter,
              );
            }

            return false;
          },
        },
      },
    });

    return [...plugins, toolbarPlugin];
  },

  addOptions() {
    return {
      ...this.parent?.(),
      validate: href => /^https?:\/\//.test(href),
    };
  },
});
export default CustomLink;
