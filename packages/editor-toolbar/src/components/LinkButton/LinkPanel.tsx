import type React from 'react';
import {useForm} from 'react-hook-form';
import './index.scss';
import cx from 'classnames';
import {Button} from "@easy-editor/editor-common";

export type LinkEditPopupProps = {
  text?: string;
  href?: string;
  onConfirm?: (arg: { text: string; href: string }) => void;
  onCancel?: () => void;
};

export const LinkPanelPopup: React.FC<LinkEditPopupProps> = props => {
  const { text, href, onCancel, onConfirm } = props;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ text: string; href: string }>();
  const onSubmit = data => {
    onConfirm(data);
  };

  return (
    <div className="easy-editor-link-panel">
      <form onSubmit={e => e.preventDefault()}>
        <div
          className={cx(
            'easy-editor-link-panel__row',
            errors.text && 'easy-editor-link-panel__error',
          )}
        >
          <div className="easy-editor-link-panel__row__inner">
            <label className="easy-editor-link-panel__row__label">文字</label>
            <div>
              <input
                className="easy-editor-link-panel__row__input"
                defaultValue={text}
                {...register('text', { required: '请填写文字' })}
              />
              <div className="easy-editor-link-panel__error__tips">
                {errors?.href?.message}
              </div>
            </div>
          </div>
        </div>

        <div
          className={cx(
            'easy-editor-link-panel__row',
            errors.href && 'easy-editor-link-panel__error',
          )}
        >
          <div className="easy-editor-link-panel__row__inner">
            <label className="easy-editor-link-panel__row__label">链接</label>
            <div>
              <input
                className="easy-editor-link-panel__row__input"
                defaultValue={href}
                {...register('href', { required: '请填写链接' })}
              />
              <div className="easy-editor-link-panel__error__tips">
                {errors?.href?.message}
              </div>
            </div>
          </div>
        </div>
        <div className={cx('submit_row', 'easy-editor-link-panel__row')}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={handleSubmit(onSubmit)}>
            提交
          </Button>
        </div>
      </form>
    </div>
  );
};
