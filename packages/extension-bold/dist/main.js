'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@tiptap/core');
var extensionBold = require('@tiptap/extension-bold');

var starInputRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))\s$/;
var starPasteRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g;
var underscoreInputRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))\s$/;
var underscorePasteRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g;
var Bold = extensionBold.Bold.extend({
  addInputRules: function addInputRules() {
    return [core.markInputRule({
      find: starInputRegex,
      type: this.type
    }), core.markInputRule({
      find: underscoreInputRegex,
      type: this.type
    })];
  },
  addPasteRules: function addPasteRules() {
    return [core.markPasteRule({
      find: starPasteRegex,
      type: this.type
    }), core.markPasteRule({
      find: underscorePasteRegex,
      type: this.type
    })];
  }
});

exports.Bold = Bold;
exports.starInputRegex = starInputRegex;
exports.starPasteRegex = starPasteRegex;
exports.underscoreInputRegex = underscoreInputRegex;
exports.underscorePasteRegex = underscorePasteRegex;
//# sourceMappingURL=main.js.map
