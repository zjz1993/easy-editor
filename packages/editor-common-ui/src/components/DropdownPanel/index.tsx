import {useSize} from 'ahooks';
import cx from 'classnames';
import {isUndefined} from 'lodash-es';
import Trigger, {type TriggerProps} from 'rc-trigger';
import {type CSSProperties, type FC, type ReactElement, useRef} from 'react';

interface IDropdownPanelProps extends TriggerProps {
  className?: string;
  style?: CSSProperties;
  children: ReactElement;
  sameWidth?: boolean;
}

const DropdownPanel: FC<IDropdownPanelProps> = props => {
  const {
    style,
    className,
    sameWidth,
    action,
    popup,
    children,
    popupAlign,
    popupClassName,
    popupStyle = {},
    ...otherProps
  } = props;
  const childrenRef = useRef<HTMLDivElement | null>(null);
  const childrenContainerSize = useSize(childrenRef);
  return (
    <Trigger
      {...otherProps}
      popupAlign={
        isUndefined(popupAlign)
          ? {
              points: ['tl', 'bl'],
            }
          : popupAlign
      }
      action={isUndefined(action) ? ['click'] : action}
      popup={popup}
      popupStyle={{
        ...popupStyle,
        width: sameWidth ? childrenContainerSize?.width : popupStyle.width,
      }}
      popupClassName={cx('textory-dropdown-panel', popupClassName)}
      popupMotion={{ motionName: 'rc-trigger-popup-fade' }}
    >
      <div
        style={style}
        ref={childrenRef}
        className={cx(
          className,
          'textory-dropdown-container',
          sameWidth && 'textory-dropdown-container-same-width',
        )}
        onMouseDown={e => {
          // 阻止编辑器失焦：保留 Tiptap 当前选区，
          // 否则后续 editor.chain().focus() 会回落到文档开头。
          e.preventDefault();
        }}
      >
        {children}
      </div>
    </Trigger>
  );
};
export default DropdownPanel;
