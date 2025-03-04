import { ReactRenderer } from '@tiptap/react';
import { Plugin, PluginKey } from 'prosemirror-state';
import LinkToolbar from './LinkToolbar.tsx';
import { Link } from './link.ts';

const CustomLink = Link.extend({
  name: 'customLink',

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

            const pos = view.posAtDOM(target, 0);
            const resolvedPos = view.state.doc.resolve(pos);
            const linkMark = resolvedPos
              .marks()
              .find(mark => mark.type.name === 'customLink');

            if (linkMark) {
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
                  onClose: () => {
                    component.destroy();
                    container.remove();
                  },
                },
              });

              // 立即将 React 组件渲染到容器中
              container.appendChild(component.element);

              const handleMouseOut = (mouseoutEvent: MouseEvent) => {
                const relatedTarget = mouseoutEvent.relatedTarget;
                if (
                  relatedTarget instanceof Node &&
                  !container.contains(relatedTarget)
                ) {
                  component.destroy();
                  container.remove();
                  // target.removeEventListener('mouseout', handleMouseOut);
                  container.removeEventListener('mouseout', handleMouseOut);
                }
              };

              // 为链接和工具栏都添加 mouseout 监听
              // target.addEventListener('mouseout', handleMouseOut);
              container.addEventListener('mouseout', handleMouseOut);
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
