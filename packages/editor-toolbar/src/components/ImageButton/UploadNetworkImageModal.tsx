import {Iconfont, InputNumber, IntlComponent, Modal, Switch, Tooltip} from '@textory/editor-common';
import {type FC, useEffect, useRef, useState} from 'react';
import cx from 'classnames';
import {Controller, useForm} from 'react-hook-form';
import type {ImageNodeAttributes} from "@textory/context";

interface FormInputs extends ImageNodeAttributes {
  src: string;
  width: number;
  height: number;
  isLockRatio?: boolean;
}

type TUploadNetworkImageModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: FormInputs) => void;
};

const UploadNetworkImageModal: FC<TUploadNetworkImageModalProps> = props => {
  const imageRef = useRef<HTMLImageElement>();
  const [ratio, setRatio] = useState<number | undefined>(undefined);
  const { open, onClose, onSubmit: sendData } = props;
  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormInputs>();
  const onSubmit = (data: FormInputs) => {
    sendData({ ...data });
    onClose();
    reset();
  };
  const width = watch('width');
  const isLockRatio = watch('isLockRatio');

  useEffect(() => {
    if (isLockRatio && width && ratio) {
      const height = width / ratio;
      setValue('height', height);
    }
  }, [isLockRatio, width, ratio]);

  return (
    <Modal
      wrapperClassName="textory-network-image-modal"
      open={open}
      onClose={() => {
        onClose?.();
        reset();
      }}
      title={IntlComponent.get('image.modal.title')}
      onSubmit={() => {
        handleSubmit(onSubmit)();
      }}
    >
      {open && (
        <form
          className="textory-network-image-modal_panel"
          onSubmit={e => e.preventDefault()}
        >
          <div className={cx('row', errors.src && 'textory-link-panel__error')}>
            <div className="row__inner">
              <label className="row__label required">{IntlComponent.get('image.modal.url.label')}</label>
              <div className="row__input-wrapper">
                <input
                  className="row__input"
                  {...register('src', { required: IntlComponent.get('image.modal.url.required') })}
                />
                <div className="textory-link-panel__error__tips">
                  {errors?.src?.message}
                </div>
              </div>
            </div>
          </div>
          <div className="textory-network-image-modal_panel__inner">
            <div className="textory-network-image-modal_panel__inner__part">
              <div
                className={cx(
                  'row',
                  errors.width && 'textory-link-panel__error',
                )}
              >
                <div className="row__inner">
                  <label className="row__label required">{IntlComponent.get('image.modal.width.label')}</label>
                  <div className="row__input-wrapper">
                    <Controller
                      name="width"
                      control={control}
                      rules={{ required: IntlComponent.get('image.modal.width.required') }}
                      render={({ field }) => (
                        <InputNumber {...field} suffix="px" min={1} />
                      )}
                    />
                    <div className="textory-link-panel__error__tips">
                      {errors?.width?.message}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={cx(
                  'row',
                  errors.height && 'textory-link-panel__error',
                )}
              >
                <div className="row__inner">
                  <label className="row__label required">{IntlComponent.get('image.modal.height.label')}</label>
                  <div className="row__input-wrapper">
                    <Controller
                      name="height"
                      control={control}
                      rules={{ required: IntlComponent.get('image.modal.height.required') }}
                      render={({ field }) => (
                        <InputNumber
                          {...field}
                          suffix="px"
                          min={1}
                          disabled={isLockRatio}
                        />
                      )}
                    />
                    <div className="textory-link-panel__error__tips">
                      {errors?.height?.message}
                    </div>
                  </div>
                </div>
              </div>

              <div className={cx('row')}>
                <div className="row__inner">
                  <label className="row__label">{IntlComponent.get('image.modal.lockRatio.label')}</label>
                  <div className="row__input-wrapper input-wrapper-flex">
                    <Controller
                      name="isLockRatio"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checkedChildren={IntlComponent.get('image.modal.lockRatio.yes')}
                          unCheckedChildren={IntlComponent.get('image.modal.lockRatio.no')}
                          {...field}
                        />
                      )}
                    />
                    <Tooltip
                      className="icon"
                      content={IntlComponent.get('image.modal.lockRatio.tooltip')}
                    >
                      <Iconfont type="icon-icon-question" />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div className="preview-image">
              <img
                src={watch('src')}
                alt=""
                width={260}
                ref={imageRef}
                onError={() => {
                  setValue('width', undefined);
                  setValue('height', undefined);
                  setRatio(undefined);
                }}
                onLoad={event => {
                  const img = event.target as HTMLImageElement;
                  setValue('width', img.naturalWidth);
                  setValue('height', img.naturalHeight);
                  setRatio(img.naturalWidth / img.naturalHeight);
                }}
              />
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
export default UploadNetworkImageModal;
