/**
 * UMD 桥接层用的 React 容器组件。
 *
 * 职责：
 * 1. 持有 `useState<TextoryOptions>` —— `setOptions()` 改 state 触发 re-render
 * 2. 把 `TextoryOptions` 映射为 `<Editor>` 的 `TTextoryEditorProps`
 * 3. 把简化 `upload` 适配器注入到 imageProps / videoProps / fileProps
 * 4. 把 5 个 UMD 回调（onChange/onCreate/onFocus/onBlur/onError）映射到 Editor props
 *
 * 不在这里做命令队列 —— 队列在 `create.ts` 里，由 `onEditorReady` flush。
 */
import {useEffect, useMemo, useState, type FC} from 'react';
import Editor from '@textory/editor';
import type {TTextoryEditorProps} from '@textory/context';
import {applyUploadAdapters} from './adapter';
import type {TextoryOptions} from './types';

export interface ContainerProps {
  initialOptions: TextoryOptions;
  onEditorReady: (editor: Parameters<NonNullable<TTextoryEditorProps['onEditorReady']>>[0]) => void;
  /**
   * 暴露 setState，让 create.ts 外部能触发 React re-render。
   * 容器组件本身不暴露 ref，create.ts 闭包持有这个 setState。
   */
  registerSetOptions: (set: (partial: Partial<TextoryOptions>) => void) => void;
}

const Container: FC<ContainerProps> = ({
  initialOptions,
  onEditorReady,
  registerSetOptions,
}) => {
  const [options, setOptions] = useState<TextoryOptions>(initialOptions);

  // 把 setState 注册给 create.ts 外部闭包。Container mount 后立刻执行一次。
  useEffect(() => {
    registerSetOptions((partial) =>
      setOptions((prev) => ({...prev, ...partial})),
    );
  }, [registerSetOptions]);

  // 把 TextoryOptions → TTextoryEditorProps
  const editorProps: TTextoryEditorProps = useMemo(() => {
    const uploadProps = applyUploadAdapters(options);

    return {
      content: options.content,
      editable: options.editable,
      placeholder: options.placeholder,
      autoFocus: options.autoFocus,
      title: options.title,
      features: options.features,
      className: options.className,
      style: options.style,
      transformContent: options.transformContent,
      imageProps: uploadProps.imageProps,
      videoProps: uploadProps.videoProps,
      fileProps: uploadProps.fileProps,
      exportProps: options.exportProps,
      titleProps: options.titleProps,
      // UMD onChange(html) → React 版 onChange({html, json}, title)
      onChange: options.onChange
        ? (content) => {
            try {
              options.onChange?.(content.html);
            } catch (err) {
              options.onError?.(err as Error);
            }
          }
        : undefined,
      onEditorReady,
    };
  }, [options, onEditorReady]);

  return <Editor {...editorProps} />;
};

Container.displayName = 'TextoryContainer';

export default Container;
