// 文档清单中枢：扫描所有 md 文件、解析 frontmatter、提供路由表与侧边栏结构
import { parse as parseYaml } from 'yaml';

// 通过 Vite 的 import.meta.glob 把所有 md 文件以 raw 字符串形式「同步」加载
// eager: true 让构建期就把 md 内容内联进来，frontmatter 可以同步解析，
// 从而 sidebarGroups 在模块加载时就能拿到正确的 order 进行排序
const modules = import.meta.glob('../docs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// 同步加载 docs 下所有可执行示例文件（tsx/jsx/ts/js），用于 <code src="..."> 引用
// 路径以 docs 为根目录，例如 '../docs/demo/demo1.tsx' → 'demo/demo1.tsx'
const demoModules = import.meta.glob('../docs/**/*.{tsx,jsx,ts,js}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const demoSourceMap: Record<string, string> = Object.fromEntries(
  Object.entries(demoModules).map(([path, content]) => [
    path.replace(/^\.\.\/docs\//, ''),
    content,
  ]),
);

// 按相对路径（docs 为根）查找示例源码，找不到返回 null
export const getDemoSource = (src: string): string | null =>
  demoSourceMap[src] ?? null;

export interface DocMeta {
  slug: string; // 完整路径，如 /docs/guide/start
  title: string;
  category: string;
  order: number;
  description?: string;
  draft?: boolean;
  rawLoader: () => Promise<string>;
}

interface Frontmatter {
  title?: string;
  category?: string;
  order?: number;
  description?: string;
  draft?: boolean;
}

// 把相对路径转成路由 slug，例如：
// '../docs/guide/start.md' -> '/docs/guide/start'
const pathToSlug = (path: string): string => {
  return '/' + path.replace(/^\.\.\//, '').replace(/\.md$/, '');
};

// 从文件名兜底一个中文标题（仅在没有 frontmatter.title 时使用）
const fallbackTitle = (slug: string): string => {
  const last = slug.split('/').pop() || '';
  const dict: Record<string, string> = {
    intro: '文档首页',
    start: '快速开始',
    usage: '基本用法',
    extensions: '扩展包',
    export: '导出能力',
    editor: 'Editor 组件',
    types: '类型定义',
    faq: '常见问题',
  };
  return dict[last] || last.charAt(0).toUpperCase() + last.slice(1);
};

// 从文件名兜底一个分类（frontmatter 缺失时）
const fallbackCategory = (slug: string): string => {
  if (slug.startsWith('/docs/guide')) return '指南';
  if (slug.startsWith('/docs/api')) return 'API 参考';
  return '其他';
};

// 简单解析 frontmatter：支持 --- 围起来的 YAML 头部
const extractFrontmatter = (raw: string): { frontmatter: Frontmatter; body: string } => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw };
  try {
    return {
      frontmatter: parseYaml(match[1]) as Frontmatter,
      body: match[2],
    };
  } catch {
    return { frontmatter: {}, body: raw };
  }
};

// 所有 md 的元信息（构建期同步生成，frontmatter 已经解析完毕）
export const docsGraph: DocMeta[] = Object.entries(modules).map(([path, raw]) => {
  const slug = pathToSlug(path);
  const { frontmatter } = extractFrontmatter(raw);
  return {
    slug,
    title: frontmatter.title || fallbackTitle(slug),
    category: frontmatter.category || fallbackCategory(slug),
    order: typeof frontmatter.order === 'number' ? frontmatter.order : 0,
    description: frontmatter.description,
    draft: frontmatter.draft,
    rawLoader: async () => raw,
  };
});

// 异步获取元信息（frontmatter 已在构建期同步解析，这里直接返回）
export const loadDocMeta = async (slug: string): Promise<DocMeta | null> => {
  return docsGraph.find((d) => d.slug === slug) || null;
};

// 按 slug 索引
export const docsBySlug: Record<string, DocMeta> = Object.fromEntries(
  docsGraph.map((d) => [d.slug, d]),
);

// category 全局排序（手动指定顺序，未指定的按字母序排在末尾）
const CATEGORY_ORDER = ['指南', 'API 参考', '其他'];

// 分组并排序后的侧边栏数据
export interface SidebarGroup {
  category: string;
  items: DocMeta[];
}

export const sidebarGroups: SidebarGroup[] = (() => {
  const visible = docsGraph.filter((d) => !d.draft);
  const grouped: Record<string, DocMeta[]> = {};
  for (const doc of visible) {
    if (!grouped[doc.category]) grouped[doc.category] = [];
    grouped[doc.category].push(doc);
  }
  return Object.entries(grouped)
    .map(([category, items]) => ({
      category,
      items: items.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug)),
    }))
    .sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a.category);
      const bi = CATEGORY_ORDER.indexOf(b.category);
      if (ai === -1 && bi === -1) return a.category.localeCompare(b.category);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
})();

// 扁平化的可见文档顺序（用于「上一页 / 下一页」按钮）
export const flatDocsOrder: DocMeta[] = sidebarGroups.flatMap((g) => g.items);

export const getPrevNext = (
  slug: string,
): { prev: DocMeta | null; next: DocMeta | null } => {
  const idx = flatDocsOrder.findIndex((d) => d.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? flatDocsOrder[idx - 1] : null,
    next: idx < flatDocsOrder.length - 1 ? flatDocsOrder[idx + 1] : null,
  };
};

// 默认入口（/docs 跳转目标）
export const DEFAULT_DOC_SLUG: string =
  flatDocsOrder[0]?.slug || '/docs/intro';

// 提取 frontmatter 之后的纯正文（用于搜索索引）
export const stripFrontmatter = (raw: string): string => {
  const { body } = extractFrontmatter(raw);
  return body;
};
