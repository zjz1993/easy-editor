import {describe, expect, it} from 'vitest';
import {
  DEFAULT_MAX_CHECK_LENGTH,
  isMarkdownLike,
} from './isMarkdownLike';

describe('isMarkdownLike', () => {
  it('识别标题', () => {
    expect(isMarkdownLike('# 标题')).toBe(true);
    expect(isMarkdownLike('###### 六级标题')).toBe(true);
  });

  it('识别列表与任务列表', () => {
    expect(isMarkdownLike('- 无序列表')).toBe(true);
    expect(isMarkdownLike('* 星号列表')).toBe(true);
    expect(isMarkdownLike('1. 有序列表')).toBe(true);
    expect(isMarkdownLike('23) 括号有序列表')).toBe(true);
    expect(isMarkdownLike('- [ ] 未完成任务')).toBe(true);
    expect(isMarkdownLike('- [x] 已完成任务')).toBe(true);
    expect(isMarkdownLike('  - 缩进列表')).toBe(true);
  });

  it('识别引用、围栏与分割线', () => {
    expect(isMarkdownLike('> 引用内容')).toBe(true);
    expect(isMarkdownLike('```\ncode\n```')).toBe(true);
    expect(isMarkdownLike('---')).toBe(true);
    expect(isMarkdownLike('***')).toBe(true);
  });

  it('识别行内标记', () => {
    expect(isMarkdownLike('这句话里有 **加粗**')).toBe(true);
    expect(isMarkdownLike('这句话里有 *斜体*')).toBe(true);
    expect(isMarkdownLike('删除 ~~线~~ 效果')).toBe(true);
    expect(isMarkdownLike('高 ==亮== 效果')).toBe(true);
    expect(isMarkdownLike('行内 `代码` 效果')).toBe(true);
    expect(isMarkdownLike('看 [链接](https://a.com) 效果')).toBe(true);
    expect(isMarkdownLike('看 ![图片](https://a.com/x.png)')).toBe(true);
  });

  it('识别 GFM 表格行', () => {
    expect(isMarkdownLike('| a | b |\n| - | - |\n| 1 | 2 |')).toBe(true);
  });

  it('普通纯文本不命中', () => {
    expect(isMarkdownLike('')).toBe(false);
    expect(isMarkdownLike('hello world')).toBe(false);
    expect(isMarkdownLike('今天天气不错，适合出门散步。')).toBe(false);
    expect(isMarkdownLike('第一行\n第二行\n第三行')).toBe(false);
    // 乘号 / 星号脚注不应误判为斜体
    expect(isMarkdownLike('3 * 4 = 12')).toBe(false);
  });

  it('弱歧义文本：单行有序列表标记命中即转换（spec §8-Q1 决策）', () => {
    expect(isMarkdownLike('1. 买牛奶')).toBe(true);
  });

  it('中划线类普通文本不误判', () => {
    expect(isMarkdownLike('2024-08-18')).toBe(false);
    expect(isMarkdownLike('a-b-c-d')).toBe(false);
  });

  it('超长文本短路返回 false', () => {
    const long = 'a'.repeat(DEFAULT_MAX_CHECK_LENGTH + 1);
    expect(isMarkdownLike(long)).toBe(false);
    // 命中特征但超过阈值同样短路
    expect(isMarkdownLike(`# ${long}`)).toBe(false);
  });

  it('自定义阈值生效', () => {
    expect(isMarkdownLike('# x', 1)).toBe(false);
    expect(isMarkdownLike('# x', 100)).toBe(true);
  });
});
