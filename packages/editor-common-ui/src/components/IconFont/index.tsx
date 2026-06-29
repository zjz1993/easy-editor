// index.tsx
import cx from 'classnames';
import type {CSSProperties, FC} from 'react';
import {createFromIconfont} from './createFrontIconfont';
import {Icon} from './Icon'; // 导入 Icon 组件

const IconFont = createFromIconfont(
  '//at.alicdn.com/t/c/font_4437062_f8f2fydfxer.js',
);

const IconComponent: FC<{
  type: string;
  style?: CSSProperties;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  disabled?: boolean;
}> = props => {
  const {
    disabled,
    type,
    style,
    className,
    onMouseEnter,
    onMouseLeave,
    onClick,
  } = props;
  return (
    <span className="textory-icon">
      <span
        className={cx(
          className,
          'anticon',
          disabled && 'textory-icon-disabled',
        )}
      >
        <IconFont
          type={type.startsWith('icon') ? type : `icon-${type}`}
          style={style}
          onClick={onClick}
          onMouseLeave={onMouseLeave}
          onMouseEnter={onMouseEnter}
        />
      </span>
    </span>
  );
};

// 重新导出 Icon 组件和类型
export { Icon, type IconProps } from './Icon';
export default IconComponent;
