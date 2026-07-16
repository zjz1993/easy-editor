/**
 * 可被用户启用/停用的功能域白名单。
 *
 * 与 `BLOCK_TYPES`（schema 节点名，位于 `@textory/editor-utils`）不同：
 * `FEATURES` 描述的是面向编辑器使用方的"公开功能开关"，
 * 用于 `<Editor features={{ outline: false }} />` 这类 API 形状。
 *
 * 当前白名单仅包含无 schema 依赖、无 toolbar 按钮耦合的独立附加功能。
 * 新增 feature 时需要同步：
 * 1. 在此处追加常量项
 * 2. 在 `packages/editor-main/src/root.tsx` 增加条件渲染
 * 3. 若涉及 toolbar / React 辅助组件，需要联动条件渲染
 */
export const FEATURES = {
  OUTLINE: 'outline',
} as const;

export type FeatureName = (typeof FEATURES)[keyof typeof FEATURES];

export type FeatureFlags = Partial<Record<FeatureName, boolean>>;
