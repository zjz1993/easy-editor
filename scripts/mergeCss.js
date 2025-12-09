const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname,'../packages/editor-style/dist/index.css');
const destDir = path.resolve('dist');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const dest = path.join(destDir, 'index.css');

fs.copyFileSync(src, dest);

console.log(`Copied ${src} --> ${dest}`);
