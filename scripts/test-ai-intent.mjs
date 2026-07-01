import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadIntentModule() {
  const filename = resolve('src/lib/ai/intent.ts');
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

const { fallbackIntent, parseGeminiIntent, buildIntentPrompt } = loadIntentModule();

test('fallbackIntent extracts lifeStage from Korean life-stage keywords', () => {
  const intent = fallbackIntent('강남구 사는 29살 청년인데 월세 지원 받고 싶어');
  assert.equal(intent.lifeStage, 'youth');
  assert.equal(intent.source, 'fallback');
  assert.ok(intent.interests.includes('주거'));
});

test('fallbackIntent detects region sido and sigungu', () => {
  const intent = fallbackIntent('인천 미추홀구에서 신혼부부 지원 알려줘');
  assert.equal(intent.region?.sido, '인천');
  assert.equal(intent.region?.sigungu, '미추홀구');
  assert.equal(intent.lifeStage, 'newlywed');
});

test('fallbackIntent detects multiple interests', () => {
  const intent = fallbackIntent('장애인 의료비 지원과 돌봄 서비스를 찾고 있어');
  assert.equal(intent.lifeStage, 'disability');
  assert.ok(intent.interests.includes('의료'));
  assert.ok(intent.interests.includes('돌봄'));
});

test('fallbackIntent flags urgent tone', () => {
  const urgent = fallbackIntent('마감 임박한 청년 월세 지원 급하게 필요해');
  assert.equal(urgent.urgency, 'urgent');
  const normal = fallbackIntent('청년 주거 지원 뭐가 있는지 알려줘');
  assert.equal(normal.urgency, 'normal');
});

test('parseGeminiIntent trusts AI keywords/interests and back-fills missing fields', () => {
  const intent = parseGeminiIntent('신혼부부 주거 지원', {
    keywords: ['신혼부부', '주거지원', '전세대출'],
    lifeStage: 'newlywed',
    interests: ['주거'],
    urgency: 'normal',
  });
  assert.equal(intent.source, 'ai');
  assert.equal(intent.lifeStage, 'newlywed');
  assert.equal(intent.keywords.length, 3);
  assert.ok(intent.interests.includes('주거'));
  assert.ok(intent.confidence >= 0.8);
});

test('parseGeminiIntent drops unknown lifeStage and unknown interests, then falls back', () => {
  const intent = parseGeminiIntent('청년 주거 지원', {
    lifeStage: 'unknown-value',
    interests: ['외계인지원', '주거'],
    keywords: [],
    urgency: 'urgent',
  });
  assert.equal(intent.source, 'ai');
  // unknown lifeStage 는 무시되고 fallback 이 채움
  assert.equal(intent.lifeStage, 'youth');
  // 유효한 interest 만 남음
  assert.ok(intent.interests.includes('주거'));
  assert.equal(intent.interests.includes('외계인지원'), false);
  assert.equal(intent.urgency, 'urgent');
});

test('parseGeminiIntent handles malformed payload gracefully', () => {
  const intent = parseGeminiIntent('청년 지원', null);
  assert.equal(intent.source, 'ai');
  assert.equal(intent.lifeStage, 'youth');
  assert.ok(intent.keywords.length > 0);
});

test('buildIntentPrompt includes query and optional profile hint', () => {
  const prompt = buildIntentPrompt('청년 주거 지원');
  assert.ok(prompt.includes('청년 주거 지원'));
  assert.equal(prompt.includes('사용자 프로필'), false);

  const withProfile = buildIntentPrompt('청년 주거 지원', { lifeStage: 'youth' });
  assert.ok(withProfile.includes('사용자 프로필'));
  assert.ok(withProfile.includes('"lifeStage":"youth"'));
});
