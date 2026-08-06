import {IntlComponent, Modal} from '@textory/editor-common';
import {type FC, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import cx from 'classnames';

interface FormInputs {
  src: string;
  poster: string;
}

type TUploadNetworkVideoModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: FormInputs) => void;
};

/**
 * Network-video insertion modal. Mirrors `UploadNetworkImageModal`'s
 * shape but simpler — no width/height fields (default 100% / aspect 16:9),
 * no preview (iframe sandboxing makes previews unreliable).
 *
 * URL contract: caller is expected to paste a player embed URL directly
 * (e.g. `//player.bilibili.com/player.html?bvid=...`). We do basic
 * validation (non-empty + http/https scheme) but do NOT convert watch
 * pages to embed URLs — that's the user's responsibility by design.
 *
 * Optional poster URL: if provided, persisted as the video node's
 * `poster` attribute (rendered as `<video poster>` and used by the Word
 * export converter).
 */
const UploadNetworkVideoModal: FC<TUploadNetworkVideoModalProps> = props => {
  const {open, onClose, onSubmit: sendData} = props;
  const {
    reset,
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormInputs>();

  // Close should always reset the form so stale errors don't persist
  // across reopens. Submit also resets after firing sendData.
  const onSubmit = (data: FormInputs) => {
    const poster = data.poster?.trim();
    sendData({src: data.src.trim(), poster: poster || undefined});
    onClose();
    reset();
  };

  // Auto-focus the URL input when modal opens.
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Modal
      wrapperClassName="textory-network-video-modal"
      open={open}
      onClose={() => {
        onClose?.();
        reset();
      }}
      title={IntlComponent.get('video.modal.title')}
      onSubmit={() => {
        handleSubmit(onSubmit)();
      }}
    >
      {open && (
        <form
          className="textory-network-video-modal_panel"
          onSubmit={e => e.preventDefault()}
        >
          <div className={cx('row', errors.src && 'textory-link-panel__error')}>
            <div className="row__inner">
              <label className="row__label required">
                {IntlComponent.get('video.modal.url.label')}
              </label>
              <div className="row__input-wrapper">
                <input
                  className="row__input"
                  placeholder={IntlComponent.get('video.modal.placeholder')}
                  {...register('src', {
                    required: IntlComponent.get('video.modal.url.required'),
                    validate: value => {
                      const v = (value || '').trim();
                      if (!v) return true;
                      if (!/^https?:\/\//i.test(v)) {
                        return IntlComponent.get('video.modal.url.invalid');
                      }
                      return true;
                    },
                  })}
                />
                <div className="textory-link-panel__error__tips">
                  {errors?.src?.message}
                </div>
              </div>
            </div>
          </div>
          <div
            className={cx('row', errors.poster && 'textory-link-panel__error')}
          >
            <div className="row__inner">
              <label className="row__label">
                {IntlComponent.get('video.modal.poster.label')}
              </label>
              <div className="row__input-wrapper">
                <input
                  className="row__input"
                  placeholder={IntlComponent.get('video.modal.poster.placeholder')}
                  {...register('poster', {
                    validate: value => {
                      const v = (value || '').trim();
                      if (!v) return true;
                      if (!/^https?:\/\//i.test(v)) {
                        return IntlComponent.get('video.modal.poster.invalid');
                      }
                      return true;
                    },
                  })}
                />
                <div className="textory-link-panel__error__tips">
                  {errors?.poster?.message}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
export default UploadNetworkVideoModal;
