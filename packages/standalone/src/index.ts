/**
 * @textory/standalone 入口。
 *
 * UMD bundle 通过 `globalName: 'Textory'` 暴露到 window。
 * ESM 用户也可 `import { Textory } from '@textory/standalone'`。
 */
import {createTextoryInstance} from './create';
import type {TextoryAPI} from './types';

const Textory: TextoryAPI = {
  create: createTextoryInstance,
};

export {Textory};
export default Textory;

// 类型再导出，便于 TS 用户 `import type { TextoryOptions } from '@textory/standalone'`
export type {
  TextoryAPI,
  TextoryOptions,
  TextoryInstance,
  UploadAdapters,
  FeatureFlags,
  IImageProps,
  IFileProps,
  IVideoProps,
  ExportProps,
  ITitleProps,
} from './types';
