import {cleanup, render} from '@testing-library/react';
import {Editor} from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import {initIntl, IntlComponent} from '@textory/editor-common';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import BubbleButton from './BubbleButton';

/**
 * tooltip prop 约定为 intl key（如 'bold'），组件内部解析。
 * 回归点：早期版本在组件内对「调用方已解析的文案」再查一次
 * IntlComponent.get，导致 react-intl-universal 报
 * `key "加粗 ({command} + B)" not defined in zh_cn` 警告。
 */
describe('BubbleButton tooltip intl', () => {
  let editor: Editor;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    initIntl();
    editor = new Editor({extensions: [StarterKit]});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    warnSpy.mockRestore();
    editor.destroy();
  });

  const notDefinedWarns = () =>
    warnSpy.mock.calls.map(c => String(c[0])).filter(t => t.includes('not defined'));

  it('tooltip 传 intl key：渲染时不产生 "not defined" 警告', () => {
    const {container} = render(
      <BubbleButton id="bold" editor={editor} mark="bold" icon="bold" tooltip="bold" />,
    );
    expect(container.querySelector('button')).toBeTruthy();
    expect(notDefinedWarns()).toEqual([]);
  });

  it('快捷键占位符 {command} 被正确替换', () => {
    expect(IntlComponent.get('bold', {command: '⌘', option: 'Option'})).toBe(
      '加粗 (⌘ + B)',
    );
    expect(IntlComponent.get('bold', {command: 'Ctrl', option: 'Alt'})).toBe(
      '加粗 (Ctrl + B)',
    );
  });

  it('不传 tooltip 时不查 intl、无警告', () => {
    render(<BubbleButton id="x" editor={editor} mark="bold" icon="bold" />);
    expect(notDefinedWarns()).toEqual([]);
  });
});
