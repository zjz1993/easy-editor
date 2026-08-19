import {describe, expect, it} from 'vitest';
import {IntlComponent} from '@textory/editor-common';
import {DEFAULT_PROPS} from './index';

// 回归：DEFAULT_PROPS 在模块加载（import 时）求值。若 intl 尚未 init，
// IntlComponent.get 会触发 `locales data "null" not exists` 警告并返回
// 空字符串——默认 placeholder 从此被固化为 ''（模块级常量不会因 re-render
// 重新求值）。initIntl() 必须在求值前同步完成初始化。
describe('DEFAULT_PROPS 模块加载时序', () => {
  it('placeholder 读取到真实文案，而非 init 前的空字符串', () => {
    expect(DEFAULT_PROPS.placeholder).toBe('请输入');
  });

  it('titleProps.titlePlaceholder 读取到真实文案', () => {
    expect(DEFAULT_PROPS.titleProps?.titlePlaceholder).toBe('请输入标题');
  });

  it('求值时 intl 已初始化（与 get 结果一致且非空）', () => {
    expect(IntlComponent.getInitOptions().currentLocale).toBe('zh_cn');
  });
});
