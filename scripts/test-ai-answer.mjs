import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadParserModule() {
  const filename = resolve('src/lib/ai/answerParser.ts');
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
  const sandbox = { module: cjsModule, exports: cjsModule.exports, require, console };
  vm.runInNewContext(outputText, sandbox, { filename });
  return cjsModule.exports;
}

const { buildAnswerPrompt, cleanAnswerText, pickAnswerBenefits, truncate } = loadParserModule();

function makeBenefit(overrides = {}) {
  return {
    id: 'x',
    sourceId: 'bokjiro-local',
    sourceLabel: '복지로 지자체',
    sourceCategory: 'welfare',
    title: '청년 월세 지원',
    summary: '만 19-34세 청년에게 월세 20만원 지원',
    category: '주거',
    target: '만 19-34세',
    region: '서울 강남구',
    period: '상시',
    applyUrl: 'https://example.com/apply',
    eligibilityText: '무주택 청년',
    evidence: { sourceId: 'bokjiro-local', sourceLabel: '복지로 지자체', url: '', fetchedAt: '' },
    confidence: 82,
    ...overrides,
  };
}

test('truncate keeps short strings and ellipsizes long strings', () => {
  assert.equal(truncate('짧음', 10), '짧음');
  assert.equal(truncate('a'.repeat(20), 10), `${'a'.repeat(9)}…`);
});

test('pickAnswerBenefits limits to N and trims long text', () => {
  const many = Array.from({ length: 12 }, (_, i) => makeBenefit({ title: `T${i} ${'매우긴제목'.repeat(20)}` }));
  const picked = pickAnswerBenefits(many, 5);
  assert.equal(picked.length, 5);
  assert.equal(picked[0].index, 1);
  assert.ok(picked[0].title.length <= 80);
});

test('buildAnswerPrompt embeds query, intent condition line, and numbered benefits', () => {
  const intent = {
    rawQuery: '청년 월세',
    keywords: ['청년', '월세'],
    interests: ['주거'],
    urgency: 'urgent',
    source: 'ai',
    confidence: 0.9,
    lifeStage: 'youth',
    region: { sido: '서울', sigungu: '강남구' },
  };
  const benefits = pickAnswerBenefits([makeBenefit()]);
  const prompt = buildAnswerPrompt('강남구 청년 월세 지원 급함', intent, benefits);

  assert.ok(prompt.includes('강남구 청년 월세 지원 급함'));
  assert.ok(prompt.includes('생애주기=youth'));
  assert.ok(prompt.includes('관심분야=주거'));
  assert.ok(prompt.includes('서울 강남구'));
  assert.ok(prompt.includes('긴급=예'));
  assert.ok(prompt.includes('[1] 청년 월세 지원'));
  assert.ok(prompt.includes('복지로 지자체'));
});

test('buildAnswerPrompt handles zero benefits gracefully', () => {
  const prompt = buildAnswerPrompt('아무 질문', undefined, []);
  assert.ok(prompt.includes('아무 질문'));
  assert.ok(prompt.includes('관련 후보를 찾지 못했습니다'));
  assert.ok(prompt.includes('(사용자 조건 별도 지정 없음)'));
});

test('cleanAnswerText strips code fences and collapses blank lines', () => {
  const raw = '```markdown\n답변 첫문장.\n\n\n\n답변 두문장.\n```';
  const cleaned = cleanAnswerText(raw);
  assert.equal(cleaned.includes('```'), false);
  assert.ok(cleaned.includes('답변 첫문장'));
  assert.ok(cleaned.includes('답변 두문장'));
  assert.equal(cleaned.includes('\n\n\n'), false);
});

test('cleanAnswerText clamps overly long text', () => {
  const long = 'ㄱ'.repeat(2000);
  const cleaned = cleanAnswerText(long, 500);
  assert.equal(cleaned.length, 500);
  assert.ok(cleaned.endsWith('…'));
});

test('cleanAnswerText keeps short text intact', () => {
  const cleaned = cleanAnswerText('짧은 답변입니다.');
  assert.equal(cleaned, '짧은 답변입니다.');
});
