import Tippy, { type TippyProps } from '@tippyjs/react';
import type React from 'react';
import 'tippy.js/dist/tippy.css'; // optional

export type TooltipProps = TippyProps & {
  text?: string;
};

const Tooltip: React.FC<TooltipProps> = ({
  text,
  content,
  children,
  ...props
}) => {
  return (
    <Tippy
      interactive
      content={
        content || <div className={'tide-menu-bar__tooltip'}>{text}</div>
      }
      {...props}
    >
      {children}
    </Tippy>
  );
};
export default Tooltip;
