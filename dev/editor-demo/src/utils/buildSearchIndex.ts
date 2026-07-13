// 构建期生成搜索索引（在 DocsSearch 组件 mount 时异步构建）
import MiniSearch from 'minisearch';
import { docsGraph, stripFrontmatter } from './docsGraph';

export interface SearchItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  body: string;
}

let indexInstance: MiniSearch<SearchItem> | null = null;
let buildPromise: Promise<MiniSearch<SearchItem>> | null = null;

// 把 md 正文粗清洗成纯文本（去 md 标记）
const toPlainText = (md: string): string => {
  return md
    .replace(/```[\s\S]*?```/g, ' ') // 代码块
    .replace(/`[^`]*`/g, ' ') // 行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接保留文本
    .replace(/[#>*_~\-]/g, ' ') // md 符号
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000); // 限制长度避免索引过大
};

// 异步构建索引（首次调用时触发，后续复用）
export const getSearchIndex = async (): Promise<MiniSearch<SearchItem>> => {
  if (indexInstance) return indexInstance;
  if (buildPromise) return buildPromise;

  buildPromise = (async () => {
    const index = new MiniSearch<SearchItem>({
      fields: ['title', 'body'],
      storeFields: ['slug', 'title', 'category'],
      searchOptions: {
        boost: { title: 3 },
        prefix: true,
        fuzzy: 0.2,
      },
    });

    // 并发加载所有 md
    const items = await Promise.all(
      docsGraph.map(async (doc) => {
        const raw = await doc.rawLoader();
        const body = toPlainText(stripFrontmatter(raw));
        return {
          id: doc.slug,
          slug: doc.slug,
          title: doc.title,
          category: doc.category,
          body,
        };
      }),
    );

    index.addAll(items);
    indexInstance = index;
    return index;
  })();

  return buildPromise;
};
