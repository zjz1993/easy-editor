// Playground ambient 类型声明
//
// 注入到 Monaco TS service,让 scope 内的变量(Editor/hooks/DEMO_HTML/render)有类型。
//
// 单一来源:Editor props 直接 ?raw 引用 packages/editor-context/src/types/index.ts,
// 运行时去 import + 把外部类型(JSONContent / CSSProperties 等)替换成兼容 fallback,
// 这样 packages 那边改 props → playground 自动同步,无需维护两份。

import editorPropsRaw from '../../../../packages/editor-context/src/types/index.ts?raw';

// 去掉所有 import 语句,让源码变成自包含
const stripImports = (src: string): string =>
  src.replace(/^\s*import\b.*$/gm, '');

// 把源码里引用的外部类型替换为 fallback(递归引用就太重了,playground 不需要)
// 同时去掉 export 关键字 —— ambient 上下文不允许 export,需要全局可见
const EDITOR_PROPS_INLINE = stripImports(editorPropsRaw)
  .replace(/^\s*export\s+/gm, '')
  .replace(/\bJSONContent\b/g, 'unknown')
  .replace(/\bIImageProps\b/g, 'Record<string, unknown>')
  .replace(/\bExportProps\b/g, 'Record<string, unknown>')
  .replace(/\bFeatureFlags\b/g, 'Record<string, boolean>')
  // .replace(/\bITitleProps\b/g, 'Record<string, unknown>');
// CSSProperties 保留 —— 本文件下方已声明同名 interface

export const AMBIENT_DTS = `
// ============ 最小 React 类型(Monaco worker 内 @types/react 不可用)============
type Key = string | number;
type ReactNode =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSX.Element
  | Array<ReactNode>;

interface CSSProperties {
  [key: string]: string | number | null | undefined;
}

interface DOMAttributes<T = unknown> {
  children?: ReactNode;
  key?: Key | null;
  onClick?: (event: T) => void;
  onMouseDown?: (event: T) => void;
  onMouseUp?: (event: T) => void;
  onMouseMove?: (event: T) => void;
  onMouseEnter?: (event: T) => void;
  onMouseLeave?: (event: T) => void;
  onChange?: (event: T) => void;
  onInput?: (event: T) => void;
  onSubmit?: (event: T) => void;
  onFocus?: (event: T) => void;
  onBlur?: (event: T) => void;
  onKeyDown?: (event: T) => void;
  onKeyUp?: (event: T) => void;
  onKeyPress?: (event: T) => void;
  onLoad?: (event: T) => void;
  onError?: (event: T) => void;
  ref?: unknown;
  dangerouslySetInnerHTML?: { __html: string };
}

interface HTMLAttributes<T = unknown> extends DOMAttributes<T> {
  id?: string;
  title?: string;
  className?: string;
  style?: CSSProperties;
  tabIndex?: number;
  draggable?: boolean;
  hidden?: boolean;
  contentEditable?: boolean | 'inherit';
  spellCheck?: boolean;
  role?: string;
  accessKey?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  lang?: string;
  translate?: 'yes' | 'no';
  name?: string;
  type?: string;
  value?: string | string[] | number;
  defaultValue?: string | string[] | number;
  placeholder?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  multiple?: boolean;
  src?: string;
  href?: string;
  target?: string;
  rel?: string;
  htmlFor?: string;
  cols?: number;
  rows?: number;
  wrap?: 'hard' | 'soft' | 'off';
  width?: number | string;
  height?: number | string;
  alt?: string;
  selected?: boolean;
  start?: number;
  reversed?: boolean;
}

// JSX namespace:intrinsic elements
declare global {
  namespace JSX {
    interface Element {
      type: unknown;
      props: unknown;
      key: Key | null;
    }
    interface ElementClass {
      render: (...args: unknown[]) => unknown;
    }
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
    interface IntrinsicElements {
      div: HTMLAttributes;
      span: HTMLAttributes;
      p: HTMLAttributes;
      a: HTMLAttributes;
      img: HTMLAttributes;
      br: HTMLAttributes;
      hr: HTMLAttributes;
      h1: HTMLAttributes;
      h2: HTMLAttributes;
      h3: HTMLAttributes;
      h4: HTMLAttributes;
      h5: HTMLAttributes;
      h6: HTMLAttributes;
      ul: HTMLAttributes;
      ol: HTMLAttributes;
      li: HTMLAttributes;
      dl: HTMLAttributes;
      dt: HTMLAttributes;
      dd: HTMLAttributes;
      button: HTMLAttributes;
      input: HTMLAttributes;
      textarea: HTMLAttributes;
      select: HTMLAttributes;
      option: HTMLAttributes;
      optgroup: HTMLAttributes;
      form: HTMLAttributes;
      label: HTMLAttributes;
      fieldset: HTMLAttributes;
      legend: HTMLAttributes;
      header: HTMLAttributes;
      footer: HTMLAttributes;
      nav: HTMLAttributes;
      main: HTMLAttributes;
      section: HTMLAttributes;
      article: HTMLAttributes;
      aside: HTMLAttributes;
      table: HTMLAttributes;
      thead: HTMLAttributes;
      tbody: HTMLAttributes;
      tfoot: HTMLAttributes;
      tr: HTMLAttributes;
      th: HTMLAttributes;
      td: HTMLAttributes;
      caption: HTMLAttributes;
      colgroup: HTMLAttributes;
      col: HTMLAttributes;
      pre: HTMLAttributes;
      code: HTMLAttributes;
      kbd: HTMLAttributes;
      samp: HTMLAttributes;
      var: HTMLAttributes;
      blockquote: HTMLAttributes;
      q: HTMLAttributes;
      cite: HTMLAttributes;
      strong: HTMLAttributes;
      em: HTMLAttributes;
      b: HTMLAttributes;
      i: HTMLAttributes;
      u: HTMLAttributes;
      s: HTMLAttributes;
      small: HTMLAttributes;
      mark: HTMLAttributes;
      sub: HTMLAttributes;
      sup: HTMLAttributes;
      details: HTMLAttributes;
      summary: HTMLAttributes;
      dialog: HTMLAttributes;
      figure: HTMLAttributes;
      figcaption: HTMLAttributes;
      svg: HTMLAttributes & { viewBox?: string; xmlns?: string; fill?: string };
      path: HTMLAttributes & { d?: string; fill?: string };
      g: HTMLAttributes;
      circle: HTMLAttributes;
      rect: HTMLAttributes;
      line: HTMLAttributes;
      polyline: HTMLAttributes;
      polygon: HTMLAttributes;
      [elemName: string]: HTMLAttributes;
    }
  }
}

// Component / hook 类型
type FC<P = Record<string, unknown>> = (props: P) => JSX.Element | null;
type ComponentType<P = Record<string, unknown>> = FC<P>;
type DependencyList = readonly unknown[];

// ============ Editor props(从 packages/editor-context 实时同步)============
${EDITOR_PROPS_INLINE}

// ============ Playground scope ============
declare const Editor: ComponentType<TTextoryEditorProps>;
declare const React: {
  createElement: (type: unknown, props?: Record<string, unknown>, ...children: ReactNode[]) => JSX.Element;
  Fragment: unique symbol;
};
declare function useState<S>(): [S | undefined, (next: S | undefined | ((prev: S | undefined) => S | undefined)) => void];
declare function useState<S>(initial: S | (() => S)): [S, (next: S | ((prev: S) => S)) => void];
declare function useRef<T>(initial: T): { current: T };
declare function useRef<T = undefined>(): { current: T | undefined };
declare function useEffect(effect: () => void | (() => void), deps?: DependencyList): void;
declare function useMemo<T>(factory: () => T, deps: DependencyList): T;
declare function useCallback<T extends (...args: never[]) => unknown>(cb: T, deps: DependencyList): T;
declare const DEMO_HTML: string;
declare function render(node: ReactNode): void;
`;
