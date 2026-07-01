import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadClientModule() {
  const filename = resolve('src/lib/popular/client.ts');
  const source = readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  const cjsModule = { exports: {} };
  const sandbox = {
    module: cjsModule,
    exports: cjsModule.exports,
    require,
    console,
    process: { env: {} },
  };
  vm.runInNewContext(outputText, sandbox, { filename });
  return cjsModule.exports;
}

const { normalizePopularItems, fetchPopularServices } = loadClientModule();

test('normalizePopularItems returns empty array for non-array input', () => {
  assert.equal(normalizePopularItems(null).length, 0);
  assert.equal(normalizePopularItems(undefined).length, 0);
  assert.equal(normalizePopularItems({ items: [] }).length, 0);
  assert.equal(normalizePopularItems('nope').length, 0);
});

test('normalizePopularItems skips entries without a cacheKey', () => {
  const raw = [
    { cacheKey: '', title: 'skip empty' },
    { title: 'skip missing key' },
    null,
    { cacheKey: 'local:A1', title: 'kept' },
  ];
  const items = normalizePopularItems(raw);
  assert.equal(items.length, 1);
  assert.equal(items[0].cacheKey, 'local:A1');
});

test('normalizePopularItems coerces counters and preserves nullable welfare fields', () => {
  const raw = [
    {
      cacheKey: 'national:B2',
      viewCount: '15',
      clickCount: 4,
      saveCount: null,
      score: '19.5',
      updatedAt: '2026-07-01T00:00:00Z',
      title: '',
      summary: '요약',
      link: 'https://example.com',
      region: null,
      target: '청년',
      category: '주거',
    },
  ];
  const [item] = normalizePopularItems(raw);
  assert.equal(item.cacheKey, 'national:B2');
  assert.equal(item.viewCount, 15);
  assert.equal(item.clickCount, 4);
  assert.equal(item.saveCount, 0);
  assert.equal(item.score, 19.5);
  assert.equal(item.updatedAt, '2026-07-01T00:00:00Z');
  assert.equal(item.title, null);
  assert.equal(item.summary, '요약');
  assert.equal(item.link, 'https://example.com');
  assert.equal(item.region, null);
  assert.equal(item.target, '청년');
  assert.equal(item.category, '주거');
});

test('fetchPopularServices returns empty array on non-ok response', async () => {
  const fakeFetch = async () => ({ ok: false, status: 500, json: async () => [] });
  const items = await fetchPopularServices(5, fakeFetch);
  assert.equal(items.length, 0);
});

test('fetchPopularServices swallows network errors and returns empty array', async () => {
  const fakeFetch = async () => { throw new Error('network down'); };
  const items = await fetchPopularServices(5, fakeFetch);
  assert.equal(items.length, 0);
});

test('fetchPopularServices normalizes successful response', async () => {
  const fakeFetch = async () => ({
    ok: true,
    status: 200,
    json: async () => [
      { cacheKey: 'local:X', viewCount: 3, title: 'T', category: 'C' },
    ],
  });
  const items = await fetchPopularServices(5, fakeFetch);
  assert.equal(items.length, 1);
  assert.equal(items[0].cacheKey, 'local:X');
  assert.equal(items[0].viewCount, 3);
  assert.equal(items[0].title, 'T');
});
