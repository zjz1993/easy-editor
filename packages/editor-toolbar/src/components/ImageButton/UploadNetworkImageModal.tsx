import {Modal} from '@easy-editor/editor-common/src/index.ts';
import type {FC} from 'react';
import './index.scss';
import '../InputNumber/index.scss';
import cx from 'classnames';
import InputNumber from 'rc-input-number';
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
  const { open, onClose, onSubmit: sendData } = props;
  const {
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
  };

  return (
    <Modal
      wrapperClassName="easy-editor-network-image-modal"
      open={open}
      onClose={onClose}
      title="插入图片"
      onSubmit={() => {
        handleSubmit(onSubmit)();
      }}
    >
      <form
        className="easy-editor-network-image-modal_panel"
        onSubmit={e => e.preventDefault()}
      >
        <div
          className={cx('row', errors.src && 'easy-editor-link-panel__error')}
        >
          <div className="row__inner">
            <label className="row__label">图片链接</label>
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
                <label className="row__label">图片高度</label>
                <div className="row__input-wrapper">
                  <Controller
                    name="width"
                    control={control}
                    rules={{ required: '请输入图片宽度' }}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        suffix="px"
                        min={1}
                        className="easy-editor-input-number"
                      />
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
                <label className="row__label">图片高度</label>
                <div className="row__input-wrapper">
                  <Controller
                    name="height"
                    control={control}
                    rules={{ required: '请输入图片高度' }}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        suffix="px"
                        className="easy-editor-input-number"
                        min={1}
                      />
                    )}
                  />
                  <div className="easy-editor-link-panel__error__tips">
                    {errors?.width?.message}
                  </div>
                </div>
              </div>
            </div>

            <div className={cx('row')}>
              <div className="row__inner">
                <label className="row__label">是否锁定宽高</label>
                <div className="row__input-wrapper">
                  <Controller
                    name="isLockRatio"
                    control={control}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        suffix="px"
                        className="easy-editor-input-number"
                        min={1}
                      />
                    )}
                  />
                  <div>123</div>
                </div>
              </div>
            </div>
          </div>
          <div className="preview-image">
            <img
              src={watch('src')}
              alt=""
              width={260}
              onError={() => {
                setValue('width', undefined);
                setValue('height', undefined);
              }}
              onLoad={event => {
                const img = event.target as HTMLImageElement;
                setValue('width', img.naturalWidth);
                setValue('height', img.naturalHeight);
              }}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
export default UploadNetworkImageModal;
