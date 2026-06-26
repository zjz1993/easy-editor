import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
//import { fileURLToPath, URL } from "node:url";
import fs from "fs";
import {resolve} from "path";
import fg from 'fast-glob';

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
  base:command === 'build' ? 'editor' : '/',
  plugins: [react()],
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
