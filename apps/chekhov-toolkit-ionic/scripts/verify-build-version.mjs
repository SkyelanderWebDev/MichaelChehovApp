import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, '..');
const packageJson = JSON.parse(fs.readFileSync(path.join(appRoot, 'package.json'), 'utf8'));
const lockJson = JSON.parse(fs.readFileSync(path.join(appRoot, 'package-lock.json'), 'utf8'));
const buildTs = fs.readFileSync(path.join(appRoot, 'src/constants/build.ts'), 'utf8');

const versionMatch = buildTs.match(/APP_VERSION\s*=\s*'([^']+)'/);
const identifierMatch = buildTs.match(/BUILD_IDENTIFIER\s*=\s*'([^']+)'/);
const errors = [];

if (!versionMatch) {
  errors.push('src/constants/build.ts is missing APP_VERSION.');
} else if (versionMatch[1] !== packageJson.version) {
  errors.push(`APP_VERSION (${versionMatch[1]}) does not match package.json version (${packageJson.version}).`);
}

if (lockJson.version !== packageJson.version) {
  errors.push(`package-lock.json top-level version (${lockJson.version}) does not match package.json (${packageJson.version}).`);
}

if (lockJson.packages?.['']?.version !== packageJson.version) {
  errors.push(`package-lock.json root package version (${lockJson.packages?.['']?.version}) does not match package.json (${packageJson.version}).`);
}

if (!identifierMatch) {
  errors.push('src/constants/build.ts is missing BUILD_IDENTIFIER.');
} else if (!identifierMatch[1].includes(packageJson.version)) {
  errors.push(`BUILD_IDENTIFIER (${identifierMatch[1]}) must include the package version (${packageJson.version}).`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Build version verified: ${packageJson.version} (${identifierMatch[1]})`);
