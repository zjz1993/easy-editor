import type {FC, MouseEvent, ReactNode} from "react";
import './index.scss';
import cx from "classnames";

const Button: FC<{
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
  type?: 'primary';
}> = props => {
  const { children, type, onClick } = props;
  const calcClsByType = () => {
    switch (type) {
      case 'primary':
        return 'easy-editor-btn-primary';
      default:
        return '';
    }
  };
  return (
    <div
      className={cx('easy-editor-btn', calcClsByType())}
      onClick={e => {
        onClick?.(e);
      }}
    >
      {children}
    </div>
  );
};
export default Button;
