import {describe, expect, it} from 'vitest';
import {IntlComponent} from '../index';
import {initIntl} from './initIntl';

describe('initIntl', () => {
  it('同步初始化：调用后 get 立即可读，无需 await', () => {
    initIntl();
    expect(IntlComponent.get('editor.placeholder.default')).toBe('请输入');
  });

  it('幂等：重复调用不重置、不报错', () => {
    initIntl();
    initIntl();
    expect(IntlComponent.getInitOptions().currentLocale).toBe('zh_cn');
    expect(IntlComponent.get('editor.placeholder.default')).toBe('请输入');
  });
});
