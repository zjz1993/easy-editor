import { IntlComponent, Language_ZhCN } from '@textory/editor-common';
import { useEffect, useState } from 'react';

function useIntlLoaded() {
  const [intlInit, setIntlInit] = useState(false);
  useEffect(() => {
    const fun = async () => {
      const locales = {
        'zh-CN': Language_ZhCN,
        zh_cn: Language_ZhCN,
      };
      await IntlComponent.init({
        locales,
        currentLocale: 'zh_cn',
        escapeHtml: false,
      });
      setIntlInit(true);
    };
    fun();
  }, []);
  return { intlInit };
}
export default useIntlLoaded;
