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

  // fake @/lib/benefits/normalize resolution
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

const { parseYouthPolicyXml, shouldSearchYouthPolicy } = loadYouthPolicyModule();

test('shouldSearchYouthPolicy triggers on youth lifeStage even without keywords', () => {
  assert.equal(shouldSearchYouthPolicy('', {
    rawQuery: '',
    keywords: [],
    interests: [],
    urgency: 'normal',
    source: 'ai',
    confidence: 0.5,
    lifeStage: 'youth',
  }), true);
});

test('shouldSearchYouthPolicy triggers on newlywed lifeStage', () => {
  assert.equal(shouldSearchYouthPolicy('', {
    rawQuery: '',
    keywords: [],
    interests: [],
    urgency: 'normal',
    source: 'ai',
    confidence: 0.5,
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

test('parseYouthPolicyXml extracts required fields from XML', () => {
  const xml = `
    <youthPolicyList>
      <youthPolicy>
        <polyBizSjnm><![CDATA[청년 월세 지원]]></polyBizSjnm>
        <polyItcnCn>만 19-34세 청년에게 월세 20만원 지원</polyItcnCn>
        <sporCn>월 20만원, 최대 12개월</sporCn>
        <pcInInfo>만 19-34세, 무주택자</pcInInfo>
        <ageInfo>19-34세</ageInfo>
        <rqutPrdCn>2026-07-01 ~ 2026-08-31</rqutPrdCn>
        <mngtMxrsCd>서울</mngtMxrsCd>
        <rfcSiteUrla1>https://gov.kr/x</rfcSiteUrla1>
        <aplyUrlAddr>https://gov.kr/apply</aplyUrlAddr>
      </youthPolicy>
      <youthPolicy>
        <polyBizSjnm>청년 취업지원</polyBizSjnm>
      </youthPolicy>
    </youthPolicyList>
  `;
  const rows = parseYouthPolicyXml(xml);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].polyBizSjnm, '청년 월세 지원');
  assert.equal(rows[0].pcInInfo, '만 19-34세, 무주택자');
  assert.equal(rows[0].mngtMxrsCd, '서울');
  assert.equal(rows[0].aplyUrlAddr, 'https://gov.kr/apply');
  assert.equal(rows[1].polyBizSjnm, '청년 취업지원');
  assert.equal(rows[1].polyItcnCn, '');
});

test('parseYouthPolicyXml decodes HTML entities', () => {
  const xml = `
    <youthPolicyList>
      <youthPolicy>
        <polyBizSjnm>주거 &amp; 생활 지원</polyBizSjnm>
        <polyItcnCn>&lt;청년&gt; 지원 &nbsp;프로그램</polyItcnCn>
      </youthPolicy>
    </youthPolicyList>
  `;
  const rows = parseYouthPolicyXml(xml);
  assert.equal(rows[0].polyBizSjnm, '주거 & 생활 지원');
  assert.equal(rows[0].polyItcnCn, '<청년> 지원 프로그램');
});

test('parseYouthPolicyXml returns empty array for XML with no policy blocks', () => {
  assert.equal(parseYouthPolicyXml('<youthPolicyList></youthPolicyList>').length, 0);
  assert.equal(parseYouthPolicyXml('not xml at all').length, 0);
});
