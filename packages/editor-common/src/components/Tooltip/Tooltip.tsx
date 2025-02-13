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
  const getToolTipTitle = (tooltip: string) => {
    if (tooltip) {
      const regex = /\((.*?)\)/; // 匹配括号及其内容
      const result = tooltip.split(regex);
      return (
        <div style={{ textAlign: 'center' }}>
          <div className="text">{result[0]}</div>
          <div
            className="keyboard"
            style={{ color: '#ffffff', opacity: '0.7' }}
          >
            {result[1]}
          </div>
        </div>
      );
    }
    return null;
  };
  const title = getToolTipTitle(text);
  return (
    <Tippy interactive content={content || title} {...props}>
      {children}
    </Tippy>
  );
};
export default Tooltip;
