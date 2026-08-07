import {defineConfig, type Plugin} from 'vite';
import {createReadStream, statSync} from 'node:fs';
import {resolve, normalize} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(__dirname, '../..');

/**
 * 把 URL `/packages/*` 映射到 repo root 下相对 fs 路径。
 *
 * HTML 里 `<script src="../../packages/standalone/dist/...">` 在浏览器解析
 * 到 `/packages/standalone/dist/...`（因为 basic.html 在 `/basic.html`）。
 * Vite dev server 默认只 serve `root` 下文件,root 之外 404。
 * 这个 plugin 用 middleware 把 `/packages/*` 直接 stream 文件。
 */
function serveRepoFilesPlugin(): Plugin {
  return {
    name: 'serve-repo-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET') return next();
        const url = (req.url ?? '').split('?')[0];
        // 仅允许 /packages/*（防止越界读其他目录）
        if (!url.startsWith('/packages/')) return next();

        const rel = normalize(url.slice(1)); // 去 root 斜杠
        const filePath = resolve(repoRoot, rel);
        // 防越界:必须仍位于 repoRoot 下
        if (!filePath.startsWith(repoRoot + '/') && filePath !== repoRoot) {
          res.statusCode = 403;
          res.end('Forbidden');
          return;
        }
        try {
          const stat = statSync(filePath);
          if (!stat.isFile()) {
            res.statusCode = 404;
            res.end('Not Found');
            return;
          }
          const ext = filePath.split('.').pop() ?? '';
          const mime: Record<string, string> = {
            js: 'application/javascript',
            mjs: 'application/javascript',
            css: 'text/css',
            map: 'application/json',
          };
          res.setHeader('Content-Type', mime[ext] ?? 'application/octet-stream');
          res.setHeader('Content-Length', stat.size);
          createReadStream(filePath).pipe(res);
          return;
        } catch {
          res.statusCode = 404;
          res.end('Not Found');
          return;
        }
      });
    },
  };
}

export default defineConfig({
  root: '.',
  plugins: [serveRepoFilesPlugin()],
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
  build: {
    outDir: 'dist',
  },
});
