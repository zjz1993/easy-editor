import {defineConfig, type Plugin} from 'vite'
import react from '@vitejs/plugin-react-swc'
import {fileURLToPath} from "node:url";
import fs from "fs";
import {resolve, normalize} from "path";
import {createReadStream, statSync} from "node:fs";
import fg from 'fast-glob';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(__dirname, '../..');

/**
 * 服务 repo 内静态文件，给 docs 里 iframe 嵌入 standalone-demo 用。
 * - /packages/* → repoRoot/packages/* (UMD bundle 构建产物)
 * - /standalone-demo/* → dev/standalone-demo/* (5 个示例 HTML)
 *
 * 同源加载，iframe 可以直接访问。
 */
function serveRepoFilesPlugin(): Plugin {
  return {
    name: 'serve-repo-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET') return next();
        const url = (req.url ?? '').split('?')[0];

        let rel = '';
        if (url.startsWith('/packages/')) {
          rel = normalize(url.slice(1));
        } else if (url.startsWith('/standalone-demo/')) {
          rel = normalize('dev/' + url.slice(1));
        } else {
          return next();
        }

        const filePath = resolve(repoRoot, rel);
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
            html: 'text/html; charset=utf-8',
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

const getPkgName = (path: string) => {
  const json = fs.readFileSync(`${path}/package.json`, {
    encoding: 'utf-8',
  });
  const { name } = JSON.parse(json);
  return { name, path };
};

const alias = [
  // for less import
  { find: /^~/, replacement: '' },
  ...fg
    .sync(['../../packages/*', '../../presets/*'], { onlyDirectories: true })
    .map((path) => getPkgName(path))
    .map(({ name, path }) => {
      return {
        find: new RegExp(`${name}$`),
        replacement: resolve(`${path}/src/index.ts`),
      };
    }),
];

// https://vite.dev/config/
export default defineConfig(({command}) => ({
  base:command === 'build' ? '/editor' : '/',
  plugins: [react(), serveRepoFilesPlugin()],
  build:{
    outDir:"editor"
  },
  resolve: {
    alias: alias,
  },
  server:{
    proxy:{
      "/api":{
        target:"http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
}))
