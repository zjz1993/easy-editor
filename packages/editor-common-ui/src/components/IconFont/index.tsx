// index.tsx
import cx from 'classnames';
import type {CSSProperties, FC} from 'react';
import {createFromIconfont} from './createFrontIconfont';
import './iconfont.js'

const IconFont = createFromIconfont(
  '',
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
