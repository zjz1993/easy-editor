import {Iconfont, InputNumber, Modal, Switch, Tooltip} from '@easy-editor/editor-common';
import {type FC, useEffect, useRef, useState} from 'react';
import cx from 'classnames';
import {Controller, useForm} from 'react-hook-form';

type FormInputs = {
  src: string;
  width: number;
  height: number;
  isLockRatio?: boolean;
};

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
    console.log('data是', data);
    sendData(data);
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
      wrapperClassName="easy-editor-network-image-modal"
      open={open}
      onClose={() => {
        onClose?.();
        reset();
      }}
      title="插入图片"
      onSubmit={() => {
        handleSubmit(onSubmit)();
      }}
    >
      {open && (
        <form
          className="easy-editor-network-image-modal_panel"
          onSubmit={e => e.preventDefault()}
        >
          <div
            className={cx('row', errors.src && 'easy-editor-link-panel__error')}
          >
            <div className="row__inner">
              <label className="row__label required">图片链接</label>
              <div className="row__input-wrapper">
                <input
                  className="row__input"
                  {...register('src', { required: '请填写链接' })}
                />
                <div className="easy-editor-link-panel__error__tips">
                  {errors?.src?.message}
                </div>
              </div>
            </div>
          </div>
          <div className="easy-editor-network-image-modal_panel__inner">
            <div className="easy-editor-network-image-modal_panel__inner__part">
              <div
                className={cx(
                  'row',
                  errors.width && 'easy-editor-link-panel__error',
                )}
              >
                <div className="row__inner">
                  <label className="row__label required">图片宽度</label>
                  <div className="row__input-wrapper">
                    <Controller
                      name="width"
                      control={control}
                      rules={{ required: '请输入图片宽度' }}
                      render={({ field }) => (
                        <InputNumber {...field} suffix="px" min={1} />
                      )}
                    />
                    <div className="easy-editor-link-panel__error__tips">
                      {errors?.width?.message}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={cx(
                  'row',
                  errors.height && 'easy-editor-link-panel__error',
                )}
              >
                <div className="row__inner">
                  <label className="row__label required">图片高度</label>
                  <div className="row__input-wrapper">
                    <Controller
                      name="height"
                      control={control}
                      rules={{ required: '请输入图片高度' }}
                      render={({ field }) => (
                        <InputNumber
                          {...field}
                          suffix="px"
                          min={1}
                          disabled={isLockRatio}
                        />
                      )}
                    />
                    <div className="easy-editor-link-panel__error__tips">
                      {errors?.height?.message}
                    </div>
                  </div>
                </div>
              </div>

              <div className={cx('row')}>
                <div className="row__inner">
                  <label className="row__label">是否锁定宽高</label>
                  <div className="row__input-wrapper input-wrapper-flex">
                    <Controller
                      name="isLockRatio"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checkedChildren="是"
                          unCheckedChildren="否"
                          {...field}
                        />
                      )}
                    />
                    <Tooltip
                      className="icon"
                      content="锁定时，将根据当前设置的宽度自动计算图片的高度，用户无法输入高度"
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
