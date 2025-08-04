// createFrontIconfont.tsx
import React from 'react';
import type {IconProps} from './Icon'; // 修改导入路径
import {Icon} from './Icon'; // 导入 Icon 组件

const loaded = new Set<string>();

export function createFromIconfont(scriptUrl: string) {
  if (
    typeof scriptUrl === 'string' &&
    scriptUrl.length &&
    !loaded.has(scriptUrl)
  ) {
    const script = document.createElement('script');
    script.setAttribute('src', scriptUrl);
    script.setAttribute('data-namespace', scriptUrl);
    document.body.appendChild(script);

    loaded.add(scriptUrl);
  }

  return React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    const { type, ...rest } = props;

    return (
      <Icon {...rest} ref={ref}>
        {type ? <use xlinkHref={`#${type}`} /> : null}
      </Icon>
    );
  });
}
