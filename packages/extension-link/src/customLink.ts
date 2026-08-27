import {MARK_TYPES} from '@textory/editor-utils';
import {ReactRenderer} from '@tiptap/react';
import {Plugin, PluginKey} from '@tiptap/pm/state';
import LinkToolbar from './LinkToolbar.tsx';
import {Link} from './link.ts';

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
            if (!this.editor.isEditable){
              return false;
            }
            // 已有非空 selection（用户正在选中文字）时不弹出链接工具栏
            if (!view.state.selection.empty) {
              return false;
            }
            const linkElement = target.closest('a');

            // 链接内必须存在直接文本节点，纯嵌套结构不弹
            const hasTextNode = [...linkElement.childNodes].some(
              node => node.nodeType === Node.TEXT_NODE,
            );
            if (!hasTextNode) return false;

            // 计算 a 的文档位置
            const pos = view.posAtDOM(linkElement, 0);

            // 取锚点处的 link mark。不能用 resolve(pos).marks()：
            // 链接与普通文本交界处该值为空；也不能用 nodesBetween 全段扫描
            // 后赋值（回调返回 false 只是不下钻，后续无 mark 的节点会把结果
            // 覆盖回 undefined）。nodeAt(pos) 命中的就是 a 内首个文本节点。
            let linkMark = null;
            for (const p of [pos, Math.max(0, pos - 1)]) {
              const node = view.state.doc.nodeAt(p);
              linkMark = node?.marks?.find(
                mark => mark.type.name === MARK_TYPES.LK,
              );
              if (linkMark) break;
            }
            if (!linkMark) return false;

            const { from, to } = getLinkRange(view.state.doc, pos, linkMark);
            // 创建容器并立即渲染工具栏
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
                },
              },
            });

            // 立即将 React 组件渲染到容器中
            container.appendChild(component.element);

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
