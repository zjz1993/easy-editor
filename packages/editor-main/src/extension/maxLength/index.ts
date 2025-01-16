import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { isUndefined } from 'lodash-es';

const MaxLengthExtension = Extension.create({
  name: 'maxLength',

  addStorage() {
    return {
      count: 0,
    };
  },

  addOptions() {
    return {
      maxLength: undefined, // 默认最大字符数
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        filterTransaction: transaction => {
          const newContent = transaction.doc.textContent;
          // 如果新内容长度超出限制，阻止 transaction
          if (!isUndefined(this.options.maxLength)) {
            return newContent.length <= this.options.maxLength;
          }
          return true;
        },
      }),
    ];
  },
});
export default MaxLengthExtension;
