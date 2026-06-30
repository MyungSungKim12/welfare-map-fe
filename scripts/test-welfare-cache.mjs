import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadCacheModule() {
  const filename = resolve('src/lib/welfare/cache.ts');
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

const {
  fromWelfareCacheRow,
  isCacheableWelfareRequest,
  isWelfareCacheConfigured,
  toWelfareCacheRow,
} = loadCacheModule();

const item = {
  id: 'A100',
  title: '청년 월세 지원',
  category: '주거',
  target: '청년',
  period: '상시',
  region: '인천광역시 미추홀구',
  summary: '월세 지원',
  link: 'https://example.com',
  ctpvNm: '인천광역시',
  sggNm: '미추홀구',
  applyEndDd: '',
  lastModYmd: '20260625',
  isAlways: true,
};

test('isCacheableWelfareRequest only allows unfiltered default welfare lookups', () => {
  assert.equal(isCacheableWelfareRequest(new URLSearchParams()), true);
  assert.equal(isCacheableWelfareRequest(new URLSearchParams({ lifeArray: '003' })), false);
  assert.equal(isCacheableWelfareRequest(new URLSearchParams({ srchKeyCode: '004' })), false);
});

test('isWelfareCacheConfigured requires both Supabase server env values', () => {
  assert.equal(isWelfareCacheConfigured({}), false);
  assert.equal(isWelfareCacheConfigured({ SUPABASE_URL: 'https://example.supabase.co' }), false);
  assert.equal(isWelfareCacheConfigured({
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'service-role',
  }), true);
});

test('toWelfareCacheRow stores source-qualified keys without changing service id', () => {
  const row = toWelfareCacheRow(item, 'local');
  assert.equal(row.cache_key, 'local:A100');
  assert.equal(row.service_id, 'A100');
  assert.equal(row.source, 'local');
  assert.equal(row.title, '청년 월세 지원');
  assert.equal(row.ctpv_nm, '인천광역시');
  assert.equal(row.sgg_nm, '미추홀구');
});

test('fromWelfareCacheRow restores WelfareItem shape used by the UI', () => {
  const restored = fromWelfareCacheRow({
    ...toWelfareCacheRow(item, 'national'),
    fetched_at: '2026-06-30T00:00:00.000Z',
    updated_at: '2026-06-30T00:00:00.000Z',
  });

  assert.equal(restored.id, 'A100');
  assert.equal(restored.title, '청년 월세 지원');
  assert.equal(restored.region, '인천광역시 미추홀구');
  assert.equal(restored.isAlways, true);
});
