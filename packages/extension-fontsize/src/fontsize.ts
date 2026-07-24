import {Mark} from '@tiptap/core';

export interface FontSizeOptions {}

// 把 setFontSize / unsetFontSize 注册到 editor.commands 的类型上
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /** 设置选区字号（单位 px）。传空字符串等价于 unsetFontSize。 */
      setFontSize: (size: string) => ReturnType;
      /** 清除选区字号。 */
      unsetFontSize: () => ReturnType;
    };
  }
}

/**
 * 字号 mark。
 *
 * 设计要点：
 * - 以独立 Mark 形式注册（name: 'fontSize'），通过 `<span style="font-size: Npx">`
 *   序列化到 HTML，不修改 textStyle attrs，避免与 Color 等其它基于 textStyle
 *   的 mark 互相覆盖。
 * - `inclusive: false` 让选区右侧不再继承字号 —— 避免光标停在已格式化文字末尾
 *   时，继续打字带格式。
 * - parseHTML 用 `{ style: 'font-size' }` 让粘贴的 HTML 自动还原字号。
 *
 * 依赖：需要与 `@tiptap/extension-text-style` 同 schema 中存在（root.tsx 已注册），
 * 否则 setMark 仍可工作但建议在 textStyle 之后注册以保持 schema 一致。
 */
export const FontSize = Mark.create<FontSizeOptions>({
  name: 'fontSize',

  inclusive: false,

  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: element => {
          const raw = (element as HTMLElement).style.fontSize;
          if (!raw) return null;
          // '16px' -> '16'；'1em' 等其它单位原样保留
          return raw.replace(/px$/i, '');
        },
        renderHTML: attrs => {
          if (!attrs.size) return null;
          return {style: `font-size: ${attrs.size}px`};
        },
      },
    };
  },

  parseHTML() {
    return [
      {style: 'font-size'},
    ];
  },

  renderHTML({HTMLAttributes}) {
    return ['span', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setFontSize:
        size =>
        ({chain}) => {
          return chain().setMark(this.name, {size}).run();
        },
      unsetFontSize:
        () =>
        ({chain}) => {
          return chain().unsetMark(this.name).run();
        },
    };
  },
});
