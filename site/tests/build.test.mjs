// Build smoke tests for sallyalptekin.com — the regression guard.
// `pretest` builds first, so `npm test` is self-contained. Add tests when you add features.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, extname } from 'node:path';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));
function read(rel) {
  const p = join(DIST, rel);
  if (!existsSync(p)) throw new Error(`dist/${rel} not found — run \`npm run build\` first.`);
  return readFileSync(p, 'utf8');
}
const has = (rel) => existsSync(join(DIST, rel));

describe('pages are generated', () => {
  for (const f of [
    'index.html',
    'about/index.html',
    'projects/index.html',
    'artwork/index.html',
    '404.html',
    'sitemap-index.xml',
    'robots.txt',
    'favicon.svg',
  ]) {
    test(f, () => assert.ok(has(f), `missing dist/${f}`));
  }
});

describe('home', () => {
  test('name renders', () => assert.match(read('index.html'), /Sally Tang Alptekin/));
  test('canonical = apex https', () =>
    assert.match(read('index.html'), /rel="canonical" href="https:\/\/sallyalptekin\.com\/"/));
  test('Person JSON-LD', () => assert.match(read('index.html'), /"@type":"Person"/));
  test('og:image', () => assert.match(read('index.html'), /property="og:image"/));
  test('theme toggle', () => assert.match(read('index.html'), /theme-toggle/));
  test('featured work hidden when no projects', () =>
    assert.doesNotMatch(read('index.html'), /Featured work/));
  test('no "Product Manager" label', () => assert.ok(!read('index.html').includes('Product Manager')));
});

describe('about (bio + skills only)', () => {
  for (const s of ['Marietta, GA', 'Skills', 'Roadmapping']) {
    test(`contains "${s}"`, () => assert.ok(read('about/index.html').includes(s)));
  }
  test('bio present', () => assert.match(read('about/index.html'), /product manager/i));
  for (const gone of ['Experience', 'Interests', 'Certifications', 'Volunteering', 'Education']) {
    test(`section removed: ${gone}`, () => assert.ok(!read('about/index.html').includes(`${gone}</h2>`)));
  }
});

describe('projects', () => {
  test('page title renders', () => assert.match(read('projects/index.html'), /<h1>Projects<\/h1>/));
  test('project cards are empty when list is cleared', () =>
    assert.match(read('projects/index.html'), /<div class="cards cards--2">\s*<\/div>/));
});

describe('artwork', () => {
  test('page renders', () => assert.match(read('artwork/index.html'), /Artwork/));
});

describe('blog', () => {
  test('blog index built', () => assert.ok(has('blog/index.html')));
  test('nav has blog link', () => assert.match(read('index.html'), /href="\/blog"/));
  test('post renders', () => assert.match(read('blog/welcome/index.html'), /Hello, world/));
  test('post has BlogPosting JSON-LD', () =>
    assert.match(read('blog/welcome/index.html'), /"@type":"BlogPosting"/));
  test('rss feed built', () => assert.ok(has('rss.xml')));
  test('tag archive built', () => assert.ok(has('blog/tags/life/index.html')));
});

describe('no broken internal links', () => {
  function walk(dir) {
    const out = [];
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) out.push(...walk(full));
      else if (name.endsWith('.html')) out.push(full);
    }
    return out;
  }
  function resolve(href) {
    let path = href.split('#')[0].split('?')[0];
    if (!path.startsWith('/')) return null;
    if (path.endsWith('/')) path = path.slice(0, -1);
    if (path === '') return 'index.html';
    return extname(path) ? path.slice(1) : `${path.slice(1)}/index.html`;
  }
  const htmlFiles = walk(DIST);
  test('found built HTML files', () => assert.ok(htmlFiles.length > 0));
  const broken = new Set();
  for (const file of htmlFiles) {
    for (const m of readFileSync(file, 'utf8').matchAll(/href="([^"]+)"/g)) {
      const target = resolve(m[1]);
      if (target && !has(target)) broken.add(`${m[1]} -> dist/${target}`);
    }
  }
  test('all internal links resolve', () =>
    assert.equal(broken.size, 0, `broken links:\n  ${[...broken].join('\n  ')}`));
});
