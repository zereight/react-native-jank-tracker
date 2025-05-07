#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const pkgPath = path.join(rootDir, 'package.json');
const podspecPath = path.join(rootDir, 'react-native-jank-tracker.podspec');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

let content = fs.readFileSync(podspecPath, 'utf8');
const newContent = content.replace(/s\.version\s*=\s*\".*\"/, `s.version = \"${version}\"`);

if (content !== newContent) {
  fs.writeFileSync(podspecPath, newContent, 'utf8');
  console.log(`✅ Updated podspec version to ${version}`);
} else {
  console.log(`✅ Podspec version already ${version}, no change.`);
}
