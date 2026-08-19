import IntlComponent from 'react-intl-universal';
import Language_ZhCN from './zh_cn';

/**
 * 幂等的同步 intl 初始化。
 *
 * react-intl-universal 的 init() 对纯对象 locales 是同步生效的：内部仅
 * Object.assign 到单例 options，返回的 Promise 只是向后兼容（源码注释
 * "init() will not load external common locale data anymore"）。因此任何
 * 模块级（import 时求值）的 IntlComponent.get() 都必须先经过本函数——
 * 否则会在 init 之前读取，触发 `locales data "null" not exists` 警告并
 * 拿到空字符串（见 useIntlLoaded 时代把 init 放在 useEffect 里导致的时序问题）。
 *
 * 业务侧如需自定义 locale / 文案，可在渲染 <Editor> 之前再次调用
 * IntlComponent.init() 覆盖，或用 IntlComponent.load() 追加，后调用者生效。
 */
export function initIntl(): void {
  if (IntlComponent.getInitOptions().currentLocale) return;
  void IntlComponent.init({
    locales: {
      'zh-CN': Language_ZhCN,
      zh_cn: Language_ZhCN,
    },
    currentLocale: 'zh_cn',
    escapeHtml: false,
  });
}
