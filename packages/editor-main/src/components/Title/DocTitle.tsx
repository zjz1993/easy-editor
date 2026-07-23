import { TitleTextArea } from '../TitleTextarea';
import ClassNames from 'classnames';
import { useEffect } from 'react';
import type {ReactElement, FC} from 'react';

type TDocTitleProps = {
  autoFocus?: boolean;
  disabled?: boolean;
  renderStatus?: () => ReactElement;
  title?: string;
  maxLength?: number;
  onChange?: (title: string | undefined) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
};

const DocTitle: FC<TDocTitleProps> = ({
  autoFocus,
  disabled,
  renderStatus,
  title,
  maxLength,
  onChange,
  onFocus,
  onBlur,
  placeholder = '输入文档的标题',
}) => {
  //const ref = useRef<any>();

  useEffect(() => {
    onChange?.(title);
  }, [title]);

  return (
    <div
      className={ClassNames('document-title-container', { disabled: disabled })}
    >
      <div className="document-title-wrapper">
        <TitleTextArea
          className="textory-document-title"
          placeholder={placeholder}
          disabled={disabled}
          value={title}
          maxLength={maxLength}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          autoFocus={autoFocus}
        />
        {/*{disabled && (*/}
        {/*  <span className="forbidden-change-name-tip">*/}
        {/*    <IconFont type="lock" />*/}
        {/*    由&nbsp;{author?.username}&nbsp;创建，仅创建者可修改标题*/}
        {/*  </span>*/}
        {/*)}*/}
      </div>
      <div className="doc-header-extra">
        <div className="editor-status-tip">{renderStatus?.()}</div>
      </div>
    </div>
  );
};
export default DocTitle;
