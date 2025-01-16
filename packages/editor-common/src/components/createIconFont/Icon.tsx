// Seems this is used for iconFont
import classNames from 'classnames';
import { getShadowRoot } from 'rc-util/es/Dom/shadow';
import { updateCSS } from 'rc-util/lib/Dom/dynamicCSS';
import { useComposeRef } from 'rc-util/lib/ref';
import warn from 'rc-util/lib/warning';
import * as React from 'react';
import { useContext, useEffect, useRef } from 'react';
import IconContext from './IconContext';

function warning(valid: boolean, message: string) {
  warn(valid, `[@ant-design/icons] ${message}`);
}

const iconStyles = `
.anticon {
  display: inline-flex;
  align-items: center;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.anticon > * {
  line-height: 1;
}

.anticon svg {
  display: inline-block;
}

.anticon::before {
  display: none;
}

.anticon .anticon-icon {
  display: block;
}

.anticon[tabindex] {
  cursor: pointer;
}

.anticon-spin::before,
.anticon-spin {
  display: inline-block;
  -webkit-animation: loadingCircle 1s infinite linear;
  animation: loadingCircle 1s infinite linear;
}

@-webkit-keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
`;

const useInsertStyles = (eleRef: React.RefObject<HTMLElement>) => {
  const { csp, prefixCls } = useContext(IconContext);
  let mergedStyleStr = iconStyles;

  if (prefixCls) {
    mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls);
  }

  useEffect(() => {
    const ele = eleRef.current;
    if (ele) {
      const shadowRoot = getShadowRoot(ele);

      updateCSS(mergedStyleStr, '@ant-design-icons', {
        prepend: true,
        csp,
        attachTo: shadowRoot,
      });
    }
  }, []);
};

const svgBaseProps = {
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  'aria-hidden': 'true',
  focusable: 'false',
};

export interface IconBaseProps extends React.HTMLProps<HTMLSpanElement> {
  spin?: boolean;
  rotate?: number;
}

export interface CustomIconComponentProps {
  width: string | number;
  height: string | number;
  fill?: string;
  viewBox?: string;
  className?: string;
  style?: React.CSSProperties;
}
export interface IconComponentProps extends IconBaseProps {
  viewBox?: string;
  component?:
    | React.ComponentType<
        CustomIconComponentProps | React.SVGProps<SVGSVGElement>
      >
    | React.ForwardRefExoticComponent<CustomIconComponentProps>;
  ariaLabel?: React.AriaAttributes['aria-label'];
}

const Icon: React.ForwardRefExoticComponent<
  Omit<IconComponentProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
> = React.forwardRef<HTMLSpanElement, IconComponentProps>((props, ref) => {
  const prefixCls = 'anticon';
  const {
    // affect outter <i>...</i>
    className,

    // affect inner <svg>...</svg>
    component: Component,
    viewBox,
    spin,
    rotate,

    tabIndex,
    onClick,

    // children
    children,
    ...restProps
  } = props;

  const iconRef = useRef<HTMLElement>();
  const mergedRef = useComposeRef(iconRef, ref);

  warning(
    Boolean(Component || children),
    'Should have `component` prop or `children`.',
  );

  useInsertStyles(iconRef as any);

  const classString = classNames(
    prefixCls,
    {
      [`${prefixCls}-spin`]: !!spin && !!Component,
    },
    className,
  );

  const svgClassString = classNames({
    [`${prefixCls}-spin`]: !!spin,
  });

  const svgStyle = rotate
    ? {
        msTransform: `rotate(${rotate}deg)`,
        transform: `rotate(${rotate}deg)`,
      }
    : undefined;

  const innerSvgProps: CustomIconComponentProps = {
    ...svgBaseProps,
    className: svgClassString,
    style: svgStyle,
    viewBox,
  };

  if (!viewBox) {
    delete innerSvgProps.viewBox;
  }

  // component > children
  const renderInnerNode = () => {
    if (Component) {
      return <Component {...innerSvgProps}>{children}</Component>;
    }

    if (children) {
      warning(
        Boolean(viewBox) ||
          (React.Children.count(children) === 1 &&
            React.isValidElement(children) &&
            React.Children.only(children).type === 'use'),
        'Make sure that you provide correct `viewBox`' +
          ' prop (default `0 0 1024 1024`) to the icon.',
      );

      return (
        <svg {...innerSvgProps} viewBox={viewBox}>
          {children}
        </svg>
      );
    }

    return null;
  };

  let iconTabIndex = tabIndex;
  if (iconTabIndex === undefined && onClick) {
    iconTabIndex = -1;
  }

  return (
    <span
      role="img"
      {...restProps}
      ref={mergedRef as any}
      tabIndex={iconTabIndex}
      onClick={onClick}
      className={classString}
    >
      {renderInnerNode()}
    </span>
  );
});

Icon.displayName = 'AntdIcon';

export default Icon;
