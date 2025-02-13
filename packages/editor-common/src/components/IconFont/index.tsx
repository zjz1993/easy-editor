import cs from 'classnames';
import type { CSSProperties, SVGAttributes } from 'react';
import { type PropsWithChildren, forwardRef } from 'react';
import { createFromIconfont } from './createFrontIconfont';
import './index.scss';

type BaseIconProps = {
  className?: string;
  style?: CSSProperties;
  size?: string | string[];
  spin?: boolean;
};

export type IconProps = BaseIconProps &
  Omit<SVGAttributes<SVGElement>, keyof BaseIconProps>;

export const getSize = (size: IconProps['size']) => {
  if (Array.isArray(size) && size.length === 2) {
    return size as string[];
  }

  const width = (size as string) || '1em';
  const height = (size as string) || '1em';

  return [width, height];
};

export const Icon = forwardRef<SVGSVGElement, PropsWithChildren<IconProps>>(
  (props, ref) => {
    const { style, className, spin, size = '1em', children, ...rest } = props;

    const [width, height] = getSize(size);

    const cn = cs(
      'icon',
      {
        'icon-spin': spin,
      },
      className,
    );

    return (
      <svg
        ref={ref}
        className={cn}
        style={style}
        width={width}
        height={height}
        fill="currentColor"
        {...rest}
      >
        {children}
      </svg>
    );
  },
);
const IconFont = createFromIconfont(
  '//at.alicdn.com/t/c/font_4437062_evksm2pcl4d.js',
);
const IconComponent: React.FC<{
  type: string;
  style?: CSSProperties;
}> = props => {
  const { type, style } = props;
  return (
    <span className="anticon">
      <IconFont type={type} style={style} />
    </span>
  );
};
export default IconComponent;
