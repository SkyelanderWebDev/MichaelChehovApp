import { execFileSync } from 'node:child_process';

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function listChangedFiles(baseSpec) {
  if (!baseSpec) return [];
  const range = baseSpec.includes('...') || baseSpec.includes('..') ? baseSpec : `${baseSpec}...HEAD`;
  const output = git(['diff', '--name-only', range]);
  return output ? output.split('\n').filter(Boolean) : [];
}

function eventBaseSpec() {
  const event = process.env.GITHUB_EVENT_NAME;
  const before = process.env.GITHUB_EVENT_BEFORE;
  const baseRef = process.env.GITHUB_BASE_REF;

  if (event === 'pull_request' && baseRef) {
    try {
      git(['fetch', '--no-tags', '--depth=1', 'origin', baseRef]);
    } catch (error) {
      console.warn(`Could not fetch origin/${baseRef}; using local ref if available. ${error.message}`);
    }
    return `origin/${baseRef}...HEAD`;
  }

  if (before && !/^0+$/.test(before)) {
    return `${before}..HEAD`;
  }

  return null;
}

const files = listChangedFiles(eventBaseSpec());

if (files.length === 0) {
  console.log('No GitHub base range available or no changed files; build-bump enforcement skipped.');
  process.exit(0);
}

const testerFacingPatterns = [
  /^apps\/chekhov-toolkit-ionic\/src\//,
  /^apps\/chekhov-toolkit-ionic\/docs\//,
  /^apps\/chekhov-toolkit-ionic\/public\//,
  /^apps\/chekhov-toolkit-ionic\/index\.html$/,
  /^apps\/chekhov-toolkit-ionic\/vite\.config\./,
  /^apps\/chekhov-toolkit-ionic\/package(-lock)?\.json$/,
  /^apps\/chekhov-toolkit-ionic\/supabase\//,
];

const buildMarkerPatterns = [
  /^apps\/chekhov-toolkit-ionic\/package\.json$/,
  /^apps\/chekhov-toolkit-ionic\/package-lock\.json$/,
  /^apps\/chekhov-toolkit-ionic\/src\/constants\/build\.ts$/,
  /^\.claude\/plans\/\d{4}-\d{2}-\d{2}-build-.*\.md$/,
];

const testerFacingChanged = files.some((file) => testerFacingPatterns.some((pattern) => pattern.test(file)));
const buildMarkerChanged = files.some((file) => buildMarkerPatterns.some((pattern) => pattern.test(file)));

if (testerFacingChanged && !buildMarkerChanged) {
  console.error('Tester-facing Ionic changes require a build identifier/release-note bump.');
  console.error('Update package.json, package-lock.json, src/constants/build.ts, and add a .claude/plans/YYYY-MM-DD-build-...md note.');
  console.error('Changed tester-facing files:');
  for (const file of files.filter((item) => testerFacingPatterns.some((pattern) => pattern.test(item)))) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log(testerFacingChanged ? 'Build-bump requirement satisfied.' : 'No tester-facing Ionic changes detected.');
