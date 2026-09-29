import type {Editor} from '@tiptap/core';
// 仅为加载 toggleHeading 的命令声明合并（ChainedCommands 的类型来自各扩展包
// 的 interface Commands 合并），无运行时副作用
import type {} from '@tiptap/extension-heading';

/** 标题级别，与 Tiptap Heading 扩展的 Level 一致 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * 切换标题级别（toggle 语义：当前已是该级别时回落为正文）。
 *
 * range 用于 slash 菜单这类需要先删除触发文本的场景：删除与切换
 * 合并进同一条 chain，保证一次用户操作只产生一条 undo 记录。
 */
export function toggleHeadingCommand({editor, level, range}: {
  editor: Editor;
  level: HeadingLevel;
  range?: {from: number; to: number};
}) {
  const chain = editor.chain().focus();

  if (range) {
    chain.deleteRange(range);
  }

  chain.toggleHeading({level}).run();
}
