import {type AnyExtension, type Editor, getExtensionField,} from '@tiptap/core';
import {isEmpty} from 'lodash-es'; // 检查是否在某种节点里
import type {EditorView} from '@tiptap/pm/view'; // 检查是否在某种节点里

// 检查是否在某种节点里
const isSelectionInsideBlockByType = (
  editor: Editor,
  type: string | string[],
) => {
  const { selection } = editor.state;
  const { $from, $to } = selection;
  let insideBlock = false;
  if (Array.isArray(type)) {
    for (let i = 0; i < type.length; i++) {
      const typeItem = type[i];
      const blockByType = editor.state.doc.type.schema.nodes[typeItem];

      editor.state.doc.nodesBetween($from.pos, $to.pos, node => {
        if (node.type === blockByType) {
          insideBlock = true;
          return insideBlock;
        }
      });
    }
  } else {
    const blockByType = editor.state.doc.type.schema.nodes[type];

    editor.state.doc.nodesBetween($from.pos, $to.pos, node => {
      if (node.type === blockByType) {
        insideBlock = true;
      }
    });
  }
  return insideBlock;
};

/**
 * 给所有节点块级元素加上一层div
 */
const wrapBlockExtensions = (
  extensions: any[],
  types: string | any[],
  suffix: any,
  inclusive = true,
): AnyExtension[] => {
  if (!extensions) {
    return [];
  }
  return extensions
    .map(extension => {
      const context = {
        name: extension.name,
        options: extension.options,
        storage: extension.storage,
      };
      const addExtensions = getExtensionField(
        extension,
        'addExtensions',
        context,
      );
      let childExtensions = [];
      if (addExtensions && extension.name !== 'blockWrapper') {
        childExtensions = wrapBlockExtensions(
          addExtensions(),
          types,
          suffix,
          inclusive,
        );
      }
      const isNode =
        extension.type === 'node' && types.includes(extension.name);
      if (!isEmpty(childExtensions) || isNode) {
        //@ts-ignore
        function renderHTML(props: any) {
          const dom = this.parent(props);
          return ['div', { class: 'easy-editor-block-container' }, dom];
        }
        const config = {
          ...extension.config,
          name: extension.name,
          addOptions: extension.options,
          addExtensions() {
            return childExtensions || [];
          },
        };
        if (isNode) {
          config.renderHTML = renderHTML;
        }
        return extension.extend(config);
      }
      return inclusive ? extension : null;
    })
    .filter(extension => extension);
};
const isViewEditable = (view: EditorView) => {
  return !!view.editable;
};
const isDomElement = (el: unknown): el is Element => {
  return el instanceof Element;
};

const closest = (
  $el: EventTarget | null,
  selector: string | Element,
): Element | null => {
  if (!$el || !isDomElement($el)) {
    return null;
  }

  // 到这里 $el 肯定是 Element 类型
  const element = $el as Element;

  if (isDomElement(selector)) {
    let $element: Element | null = element;

    while ($element) {
      if ($element === selector) {
        return $element;
      }
      $element = $element.parentElement;
    }
    return null;
  }

  if (element.closest) {
    return element.closest(selector);
  }

  const matchesSelector = element.matches;

  if (!matchesSelector) {
    return null;
  }

  let $element: Element | null = element;

  while ($element) {
    if (matchesSelector.call($element, selector)) {
      return $element;
    }
    $element = $element.parentElement;
  }

  return null;
};

export {
  isDomElement,
  closest,
  isSelectionInsideBlockByType,
  wrapBlockExtensions,
  isViewEditable,
};
