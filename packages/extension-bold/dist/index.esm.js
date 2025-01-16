import { markInputRule, markPasteRule } from '@tiptap/core';
import { Bold as Bold$1 } from '@tiptap/extension-bold';

var starInputRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))\s$/;
var starPasteRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g;
var underscoreInputRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))\s$/;
var underscorePasteRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g;
var Bold = Bold$1.extend({
  addInputRules: function addInputRules() {
    return [markInputRule({
      find: starInputRegex,
      type: this.type
    }), markInputRule({
      find: underscoreInputRegex,
      type: this.type
    })];
  },
  addPasteRules: function addPasteRules() {
    return [markPasteRule({
      find: starPasteRegex,
      type: this.type
    }), markPasteRule({
      find: underscorePasteRegex,
      type: this.type
    })];
  }
});

export { Bold, starInputRegex, starPasteRegex, underscoreInputRegex, underscorePasteRegex };
//# sourceMappingURL=index.esm.js.map
