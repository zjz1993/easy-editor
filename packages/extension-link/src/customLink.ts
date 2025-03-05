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
let container;

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
            console.log('textNode是', textNode);
            // 计算 pos
            const pos = view.posAtDOM(textNode, 0);
            const resolvedPos = view.state.doc.resolve(pos);
            console.log('resolvedPos.node', resolvedPos.node());
            // 解决：检查 resolvedPos 位置是否正确
            console.log('Node at pos:', resolvedPos.parent.type.name);
            console.log(
              'Marks at pos:',
              resolvedPos.marks().map(m => m.type.name),
            );
            // 获取 link mark
            const linkMark = resolvedPos
              .marks()
              .find(mark => mark.type.name === MARK_TYPES.LK);
            console.log('linkMark是', linkMark);
            if (linkMark) {
              const { from, to } = getLinkRange(view.state.doc, pos, linkMark);
              // 创建容器并立即渲染工具栏
              console.log('linkMark是', linkMark);
              if (!container) {
                container = document.createElement('div');
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
                    },
                  },
                });

                // 立即将 React 组件渲染到容器中
                container.appendChild(component.element);

                //const handleMouseOut = (mouseoutEvent: MouseEvent) => {
                //  const relatedTarget = mouseoutEvent.relatedTarget;
                //  if (
                //    relatedTarget instanceof Node &&
                //    !container.contains(relatedTarget) &&
                //    !target.contains(relatedTarget)
                //  ) {
                //    target.removeEventListener('mouseout', handleMouseOut);
                //    // container.removeEventListener('mouseout', handleMouseOut);
                //  }
                //};
                //
                //// 为链接和工具栏都添加 mouseout 监听
                // target.addEventListener('mouseout', handleMouseOut);
                //container.addEventListener('mouseout', handleMouseOut);
              }
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
