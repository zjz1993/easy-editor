'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var editorCommon = require('@easy-editor/editor-common');
var jsxRuntime = require('react/jsx-runtime');

var Toolbar = function Toolbar(props) {
  props.editor;
  return /*#__PURE__*/jsxRuntime.jsxs("div", {
    className: "easy-editor-toolbar",
    children: [/*#__PURE__*/jsxRuntime.jsx("div", {
      className: "easy-editor-toolbar__item",
      children: /*#__PURE__*/jsxRuntime.jsx("div", {
        className: "easy-editor-toolbar__btn",
        children: "123"
      })
    }), /*#__PURE__*/jsxRuntime.jsx("div", {
      className: "easy-editor-toolbar__item",
      children: /*#__PURE__*/jsxRuntime.jsx(editorCommon.Tooltip, {
        text: "aaa",
        children: /*#__PURE__*/jsxRuntime.jsx("div", {
          onClick: function onClick() {
            // editor?.chain().focus().toggleBold().run();
          },
          children: /*#__PURE__*/jsxRuntime.jsx(editorCommon.Iconfont, {
            type: "add"
          })
        })
      })
    })]
  });
};

exports["default"] = Toolbar;
//# sourceMappingURL=main.js.map
