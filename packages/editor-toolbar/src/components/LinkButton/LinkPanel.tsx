import type React from 'react';
import {useForm} from 'react-hook-form';
import cx from 'classnames';
import {Button, IntlComponent} from "@textory/editor-common";

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
    <div className="textory-link-panel">
      <form onSubmit={e => e.preventDefault()}>
        <div
          className={cx(
            'textory-link-panel__row',
            errors.text && 'textory-link-panel__error',
          )}
        >
          <div className="textory-link-panel__row__inner">
            <label className="textory-link-panel__row__label">{IntlComponent.get('link.panel.text.label')}</label>
            <div>
              <input
                className="textory-link-panel__row__input"
                defaultValue={text}
                {...register('text', { required: IntlComponent.get('link.panel.text.required') })}
              />
              <div className="textory-link-panel__error__tips">
                {errors?.href?.message}
              </div>
            </div>
          </div>
        </div>

        <div
          className={cx(
            'textory-link-panel__row',
            errors.href && 'textory-link-panel__error',
          )}
        >
          <div className="textory-link-panel__row__inner">
            <label className="textory-link-panel__row__label">{IntlComponent.get('link.panel.href.label')}</label>
            <div>
              <input
                className="textory-link-panel__row__input"
                defaultValue={href}
                {...register('href', { required: IntlComponent.get('link.panel.href.required') })}
              />
              <div className="textory-link-panel__error__tips">
                {errors?.href?.message}
              </div>
            </div>
          </div>
        </div>
        <div className={cx('submit_row', 'textory-link-panel__row')}>
          <Button onClick={onCancel}>{IntlComponent.get('common.cancel')}</Button>
          <Button type="primary" onClick={handleSubmit(onSubmit)}>
            {IntlComponent.get('common.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
};
