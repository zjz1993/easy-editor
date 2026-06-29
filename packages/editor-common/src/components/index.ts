import '@textory/context';

// 14 个通用 UI 组件已迁移到 @textory/editor-common-ui，这里 re-export 维持向后兼容
export {
  Modal,
  DropdownPanel,
  Dropdown,
  DropdownList,
  Iconfont,
  Spin,
  FilePreview,
  Button,
  Tooltip,
  Popover,
  MessageContainer,
  message,
  Switch,
  InputNumber,
} from '@textory/editor-common-ui';

// 编辑器特定组件，保留在 editor-common
export { default as Upload } from './Upload';
export { BubbleMenu } from './BubbleMenu';
