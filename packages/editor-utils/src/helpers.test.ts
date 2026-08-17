import { describe, expect, it } from 'vitest';
import { BLOCK_TYPES } from './constants';
import { isListNode } from './helpers';

describe('isListNode', () => {
  it('对列表类型字符串返回 true', () => {
    expect(isListNode(BLOCK_TYPES.UL)).toBe(true);
    expect(isListNode(BLOCK_TYPES.OL)).toBe(true);
    expect(isListNode(BLOCK_TYPES.CL)).toBe(true);
  });

  it('对非列表类型字符串返回 false', () => {
    expect(isListNode(BLOCK_TYPES.P)).toBe(false);
    expect(isListNode(BLOCK_TYPES.H)).toBe(false);
    expect(isListNode(BLOCK_TYPES.QUOTE)).toBe(false);
  });

  it('对未知输入返回 false', () => {
    expect(isListNode('not-a-node')).toBe(false);
    expect(isListNode(123)).toBe(false);
    expect(isListNode(null)).toBe(false);
  });
});
