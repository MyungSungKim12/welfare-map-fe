import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadYouthPolicyModule() {
  const filename = resolve('src/lib/benefits/youthPolicy.ts');
  const source = readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filename,
  });

  const fakeModules = new Map();
  fakeModules.set('@/lib/benefits/normalize', {
    normalizeTextBenefit: (input) => ({ ...input, sourceId: input.source.id }),
  });

  const cjsModule = { exports: {} };
  const scopedRequire = (specifier) => {
    if (fakeModules.has(specifier)) return fakeModules.get(specifier);
    return require(specifier);
  };
  const sandbox = { module: cjsModule, exports: cjsModule.exports, require: scopedRequire, console };
  vm.runInNewContext(outputText, sandbox, { filename });
  return cjsModule.exports;
}

const {
  extractPolicyRows,
  normalizeYouthRow,
  shouldSearchYouthPolicy,
} = loadYouthPolicyModule();

test('shouldSearchYouthPolicy triggers on youth lifeStage even without keywords', () => {
  assert.equal(shouldSearchYouthPolicy('', {
    rawQuery: '', keywords: [], interests: [], urgency: 'normal', source: 'ai', confidence: 0.5,
    lifeStage: 'youth',
  }), true);
});

test('shouldSearchYouthPolicy triggers on newlywed lifeStage', () => {
  assert.equal(shouldSearchYouthPolicy('', {
    rawQuery: '', keywords: [], interests: [], urgency: 'normal', source: 'ai', confidence: 0.5,
    lifeStage: 'newlywed',
  }), true);
});

test('shouldSearchYouthPolicy matches keyword-only signals', () => {
  assert.equal(shouldSearchYouthPolicy('청년 월세지원 찾아줘'), true);
  assert.equal(shouldSearchYouthPolicy('전세대출 알려줘'), true);
});

test('shouldSearchYouthPolicy skips when no signals match', () => {
  assert.equal(shouldSearchYouthPolicy(''), false);
  assert.equal(shouldSearchYouthPolicy('고령자 요양 지원'), false);
});

test('extractPolicyRows finds list under result.youthPolicyList', () => {
  const envelope = {
    resultCode: 0,
    result: {
      pagging: { totCount: 2 },
      youthPolicyList: [{ plcyNm: 'A' }, { plcyNm: 'B' }],
    },
  };
  const rows = extractPolicyRows(envelope);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].plcyNm, 'A');
});

test('extractPolicyRows falls back to root-level youthPolicyList', () => {
  const envelope = { youthPolicyList: [{ plcyNm: 'X' }] };
  const rows = extractPolicyRows(envelope);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].plcyNm, 'X');
});

test('extractPolicyRows accepts result being a plain array (older format)', () => {
  const envelope = { result: [{ plcyNm: 'legacy' }] };
  const rows = extractPolicyRows(envelope);
  assert.equal(rows.length, 1);
});

test('extractPolicyRows returns empty for missing/invalid envelope', () => {
  assert.equal(extractPolicyRows(null).length, 0);
  assert.equal(extractPolicyRows({ result: {} }).length, 0);
  assert.equal(extractPolicyRows('not object').length, 0);
});

test('normalizeYouthRow maps new-version JSON fields', () => {
  const row = normalizeYouthRow({
    plcyNo: 'R2026-A',
    plcyNm: '청년 월세 지원',
    plcyExplnCn: '만 19~34세 무주택 청년에게 월세 지원',
    plcySprtCn: '월 20만원, 최대 12개월',
    aplyBgngYmd: '20260101',
    aplyEndYmd: '20261231',
    sprvsnInsttCodeNm: '서울특별시',
    rgtrHghrkInsttCodeNm: '서울특별시',
    lclsfNm: '주거',
    mclsfNm: '임대주택',
    plcyKywdNm: '청년,월세,임대',
    sprtTrgtMinAge: '19',
    sprtTrgtMaxAge: '34',
    refUrlAddr1: 'https://gov.kr/x',
    aplyUrlAddr: 'https://gov.kr/apply',
  });

  assert.equal(row.plcyNm, '청년 월세 지원');
  assert.equal(row.rgtrHghrkInsttCodeNm, '서울특별시');
  assert.equal(row.lclsfNm, '주거');
  assert.equal(row.aplyUrlAddr, 'https://gov.kr/apply');
});

test('normalizeYouthRow falls back to legacy field names', () => {
  const row = normalizeYouthRow({
    polyBizSjnm: '청년 취업지원',
    polyItcnCn: '취업 프로그램',
    sporCn: '취업 인센티브 제공',
    rfcSiteUrla1: 'https://legacy.gov.kr',
  });
  assert.equal(row.plcyNm, '청년 취업지원');
  assert.equal(row.plcyExplnCn, '취업 프로그램');
  assert.equal(row.plcySprtCn, '취업 인센티브 제공');
  assert.equal(row.refUrlAddr1, 'https://legacy.gov.kr');
});

test('normalizeYouthRow returns empty strings for missing fields', () => {
  const row = normalizeYouthRow({});
  assert.equal(row.plcyNm, '');
  assert.equal(row.aplyUrlAddr, '');
});
