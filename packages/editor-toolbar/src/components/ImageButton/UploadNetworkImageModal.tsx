import {Button, Modal} from '@easy-editor/editor-common/src/index.ts';
import type {FC} from 'react';
import './index.scss';
import cx from 'classnames';
import {type Control, useForm, useWatch} from 'react-hook-form';

type FormInputs = { src: string; href: string };

type TUploadNetworkImageModalProps = {
  open: boolean;
  onClose: () => void;
};

function FirstNameWatched({ control }: { control: Control<FormInputs> }) {
  const firstName = useWatch({
    control,
    name: 'src', // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
    defaultValue: 'default', // default value before the render
  });

  return <p>Watch: {firstName}</p>; // only re-render at the custom hook level, when firstName changes
}

const UploadNetworkImageModal: FC<TUploadNetworkImageModalProps> = props => {
  const { open, onClose } = props;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm<FormInputs>();
  const onSubmit = data => {
    console.log('触发了', onSubmit);
    console.log(data);
  };
  return (
    <Modal
      wrapperClassName="easy-editor-network-image-modal"
      open={open}
      onClose={onClose}
      title="插入图片"
      onSubmit={() => {
        console.log('触发');
        handleSubmit(onSubmit);
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
            456
          </div>
          <div className="preview-image">
            <Button
              onClick={e => {
                // e.stopPropagation();
                handleSubmit(onSubmit)();
              }}
            >
              测试
            </Button>
          </div>
        </div>
        <FirstNameWatched control={control} />
      </form>
    </Modal>
  );
};
export default UploadNetworkImageModal;
