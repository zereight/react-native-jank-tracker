// Node script to prepare dist folder for deployment
const fs = require('fs');
const path = require('path');

const rootPkgPath = path.resolve(__dirname, '../package.json');
const distDir = path.resolve(__dirname, '../dist');
const distSrcDir = path.resolve(distDir, 'src');

// Read root package.json
const pkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));

// Prepare distribution package.json
const distPkg = {
  name: pkg.name,
  version: pkg.version,
  main: 'index.js',
  types: 'index.d.ts',
  files: ['index.js', 'index.d.ts'],
  dependencies: pkg.dependencies,
};

// Write dist/package.json
fs.writeFileSync(
  path.resolve(distDir, 'package.json'),
  JSON.stringify(distPkg, null, 2) + '\n'
);

// Copy built entry files
fs.copyFileSync(
  path.resolve(distSrcDir, 'index.js'),
  path.resolve(distDir, 'index.js')
);
fs.copyFileSync(
  path.resolve(distSrcDir, 'index.d.ts'),
  path.resolve(distDir, 'index.d.ts')
); 