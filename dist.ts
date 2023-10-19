import fs from 'node:fs';

fs.writeFileSync('./dist/cjs/package.json', '{ "type": "commonjs" }');
fs.writeFileSync('./dist/mjs/package.json', '{ "type": "module" }');
fs.copyFileSync('.npmignore', './dist/.npmignore');
fs.copyFileSync('./bin/metagen.js', './dist/metagen.js');

const packageJson = {
  ...JSON.parse(fs.readFileSync('package.json', 'utf-8')),
  main: 'cjs/index.js',
  module: 'mjs/index.js',
  bin: {
    metagen: 'metagen.js'
  },
  exports: {
    '.': {
        import: './mjs/index.js',
        require: './cjs/index.js'
    }
  },
};

fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2), 'utf-8');