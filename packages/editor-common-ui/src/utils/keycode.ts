/**
 * UI 组件包内部使用的最小 KeyCode 常量。
 * 仅保留组件实际使用的按键，避免与 editor-common 的完整 KeyCode 重复维护。
 */
export const KeyCode = {
  ESC: 27,
} as const;
