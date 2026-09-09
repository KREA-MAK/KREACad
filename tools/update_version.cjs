#!/usr/bin/env node
// Cross-platform version bump (replaces the Windows-only update_version.ps1).
// Increments the build number and patch version, updates version.json and the
// version field in package.json, and regenerates source/website/version.js.
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const versionFile = path.join(root, 'version.json');
const packageJsonFile = path.join(root, 'package.json');
const versionJsFile = path.join(root, 'source', 'website', 'version.js');

// yyyy-MM-ddTHH:mm:ss.fffZ (millisecond precision, matching the old script)
const timestamp = new Date().toISOString().replace(/(\.\d{3})\d*Z$/, '$1Z');

let data;
if (fs.existsSync(versionFile)) {
  data = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
} else {
  data = { version: '1.0.0', build: 0, timestamp };
}

data.build = parseInt(data.build, 10) + 1;
data.timestamp = timestamp;

const parts = String(data.version).split('.');
if (parts.length === 3) {
  parts[2] = String(parseInt(parts[2], 10) + 1);
  data.version = parts.join('.');
}

// Update only the version string in package.json so the file's formatting is preserved.
if (fs.existsSync(packageJsonFile)) {
  const pkg = fs.readFileSync(packageJsonFile, 'utf8');
  fs.writeFileSync(
    packageJsonFile,
    pkg.replace(/("version"\s*:\s*")[^"]*(")/, `$1${data.version}$2`)
  );
}

fs.writeFileSync(versionFile, JSON.stringify(data, null, 4) + '\n');

fs.writeFileSync(
  versionJsFile,
  `// Auto-generated version file - Do not edit manually
export const KreaCAD_VERSION = {
    version: '${data.version}',
    build: ${data.build},
    timestamp: '${data.timestamp}',
    fullVersion: 'v${data.version}.build.${data.build}'
};
`
);

console.log(`KreaCAD version updated: v${data.version}.build.${data.build}`);
