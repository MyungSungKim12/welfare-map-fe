import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadTrackingModule() {
  const filename = resolve('src/lib/popular/tracking.ts');
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

const { trackPopularInteraction } = loadTrackingModule();

function makeFakeFetch() {
  const calls = [];
  const fake = async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 204 };
  };
  fake.calls = calls;
  return fake;
}

test('trackPopularInteraction skips when cacheKey missing', async () => {
  const fake = makeFakeFetch();
  await trackPopularInteraction(undefined, 'view', fake);
  await trackPopularInteraction(null, 'click', fake);
  await trackPopularInteraction('', 'save', fake);
  assert.equal(fake.calls.length, 0);
});

test('trackPopularInteraction URL-encodes cacheKey and posts to the correct path', async () => {
  const fake = makeFakeFetch();
  await trackPopularInteraction('local:A100', 'view', fake);
  assert.equal(fake.calls.length, 1);
  assert.equal(fake.calls[0].url, 'http://localhost:8080/api/v1/popular/local%3AA100/view');
  assert.equal(fake.calls[0].init.method, 'POST');
});

test('trackPopularInteraction supports all interaction types', async () => {
  const fake = makeFakeFetch();
  await trackPopularInteraction('national:X', 'view', fake);
  await trackPopularInteraction('national:X', 'click', fake);
  await trackPopularInteraction('national:X', 'save', fake);
  const types = fake.calls.map((c) => c.url.split('/').pop());
  assert.equal(types.length, 3);
  assert.equal(types[0], 'view');
  assert.equal(types[1], 'click');
  assert.equal(types[2], 'save');
});

test('trackPopularInteraction swallows network errors', async () => {
  const failing = async () => { throw new Error('network down'); };
  await assert.doesNotReject(() => trackPopularInteraction('local:B', 'view', failing));
});
