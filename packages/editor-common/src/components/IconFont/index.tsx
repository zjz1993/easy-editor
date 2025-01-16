import React, { type FC } from 'react';
import createIconFont from '../createIconFont/index';
// 使用本地字体
const createFontIcon = (
  url = new URL('./iconfont.js', import.meta.url).href,
  // url = '//at.alicdn.com/t/c/font_4437062_evksm2pcl4d.js',
) => {
  return createIconFont({
    scriptUrl: [url],
  });
};

export interface IIconfontProps {
  url?: string;
  type: string;
}

const IconFont: FC<IIconfontProps> = props => {
  const { url } = props;
  const OnlineFontIcon = createFontIcon(url);

  let type = props.type || '';
  if (!type.startsWith('icon-')) {
    type = `icon-${type}`;
  }
  return <OnlineFontIcon {...props} type={type} />;
};
export default IconFont;
