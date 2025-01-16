import { Tooltip, Iconfont } from '@easy-editor/editor-common';
import { jsxs, jsx } from 'react/jsx-runtime';

var Toolbar = function Toolbar(props) {
  props.editor;
  return /*#__PURE__*/jsxs("div", {
    className: "easy-editor-toolbar",
    children: [/*#__PURE__*/jsx("div", {
      className: "easy-editor-toolbar__item",
      children: /*#__PURE__*/jsx("div", {
        className: "easy-editor-toolbar__btn",
        children: "123"
      })
    }), /*#__PURE__*/jsx("div", {
      className: "easy-editor-toolbar__item",
      children: /*#__PURE__*/jsx(Tooltip, {
        text: "aaa",
        children: /*#__PURE__*/jsx("div", {
          onClick: function onClick() {
            // editor?.chain().focus().toggleBold().run();
          },
          children: /*#__PURE__*/jsx(Iconfont, {
            type: "add"
          })
        })
      })
    })]
  });
};

export { Toolbar as default };
//# sourceMappingURL=index.esm.js.map
