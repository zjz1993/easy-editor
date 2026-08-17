import {Extension} from '@tiptap/core';
import type {Node} from '@tiptap/pm/model';

export interface CharacterCountOptions {
  /**
   * 字数统计变化时触发（每次 doc update 后调用一次）。
   */
  onUpdate?: (count: {characters: number; words: number}) => void;
}

export interface CharacterCountStorage {
  characters: () => number;
  words: () => number;
}

declare module '@tiptap/core' {
  interface Storage {
    characterCount: CharacterCountStorage;
  }
}

// CJK 统一表意文字（含扩展 A 区），每个汉字算一个"词"
const CJK_REGEX = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/g;
// 拉丁字母/数字连续串算一个"词"（含带音标的拉丁字符）
const LATIN_WORD_REGEX = /[a-zA-Z0-9\u00C0-\u024F]+(?:['’-][a-zA-Z0-9\u00C0-\u024F]+)*/g;

function getDocText(doc: Node): string {
  // textBetween 对 leaf 节点（图片等）以 ' ' 兜底，避免相邻文本粘连
  return doc.textBetween(0, doc.content.size, '\n', ' ');
}

export function countCharacters(doc: Node): number {
  return getDocText(doc).replace(/\s/g, '').length;
}

export function countWords(doc: Node): number {
  const text = getDocText(doc);
  const cjk = text.match(CJK_REGEX)?.length ?? 0;
  const latin = text.match(LATIN_WORD_REGEX)?.length ?? 0;
  return cjk + latin;
}

export const CharacterCount = Extension.create<CharacterCountOptions, CharacterCountStorage>({
  name: 'characterCount',

  addOptions() {
    return {
      onUpdate: undefined,
    };
  },

  addStorage() {
    return {
      characters: () => 0,
      words: () => 0,
    };
  },

  onCreate() {
    this.storage.characters = () => countCharacters(this.editor.state.doc);
    this.storage.words = () => countWords(this.editor.state.doc);
    // 初始 content 不触发 onUpdate，这里补发一次，让 onCharacterCount 拿到初始值
    this.options.onUpdate?.({
      characters: this.storage.characters(),
      words: this.storage.words(),
    });
  },

  onUpdate() {
    this.options.onUpdate?.({
      characters: this.storage.characters(),
      words: this.storage.words(),
    });
  },
});
