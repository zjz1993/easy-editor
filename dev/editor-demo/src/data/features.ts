export interface Feature {
  icon: string;
  title: string;
  desc: string;
}

export interface Stat {
  value: string;
  label: string;
}

export const FEATURES: Feature[] = [
  {
    icon: '🧩',
    title: '模块化扩展',
    desc: '每个功能都是独立包，按需组合，自定义零负担。',
  },
  {
    icon: '🗂️',
    title: '文档大纲',
    desc: '自动汇总标题层级，点击跳转、跟随滚动高亮。',
  },
  {
    icon: '📥',
    title: '导出 Word',
    desc: '内置 DOCX 导出，支持文字 / 图片水印与回调。',
  },
  {
    icon: '🖼️',
    title: '图片处理',
    desc: '上传通道可定制，支持大小校验、粘贴插入。',
  },
  {
    icon: '📊',
    title: '专业表格',
    desc: '可调列宽、合并单元格、行列增删与浮动菜单。',
  },
  {
    icon: '💻',
    title: '代码高亮',
    desc: '集成 lowlight，多种语言语法高亮与主题。',
  },
  {
    icon: '✅',
    title: '任务列表',
    desc: '可勾选的任务清单，适合待办与流程类文档。',
  },
  {
    icon: '🔗',
    title: '链接管理',
    desc: '可视化插入、编辑超链接，所见即所得。',
  },
  {
    icon: '⚙️',
    title: 'TypeScript',
    desc: '全量严格模式，类型与实现一同导出。',
  },
];

export const STATS: Stat[] = [
  { value: '10+', label: '独立扩展包' },
  { value: 'ESM', label: '仅输出 ESM' },
  { value: '0', label: 'CJS 包袱' },
  { value: 'React 18', label: 'Hooks 驱动' },
];

export const HIGHLIGHTS: Feature[] = [
  {
    icon: '🎨',
    title: '统一工具栏',
    desc: 'rc-overflow 处理溢出，按钮根据当前选区动态刷新状态。',
  },
  {
    icon: '🏗️',
    title: 'Monorepo 架构',
    desc: 'pnpm workspaces + Turbo + tsup，构建依赖图自动编排。',
  },
  {
    icon: '🔌',
    title: '依赖外置策略',
    desc: 'React / Tiptap 单例外置，包体积降至 25–80 KB。',
  },
  {
    icon: '🚀',
    title: '状态管理',
    desc: 'React Context + 自定义 Hooks，Props 一路下发。',
  },
];
