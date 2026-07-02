import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadParserModule() {
  const filename = resolve('src/lib/ai/websearchParser.ts');
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

const { buildWebSearchPrompt, extractJsonArray, parseWebSearchResponse } = loadParserModule();

test('buildWebSearchPrompt embeds query and hints when intent provides them', () => {
  const prompt = buildWebSearchPrompt('청년 주거 지원', {
    rawQuery: '청년 주거 지원',
    keywords: ['청년', '주거'],
    interests: ['주거'],
    urgency: 'normal',
    source: 'ai',
    confidence: 0.8,
    region: { sido: '서울', sigungu: '강남구' },
  });
  assert.ok(prompt.includes('청년 주거 지원'));
  assert.ok(prompt.includes('서울 강남구'));
  assert.ok(prompt.includes('주거'));
});

test('extractJsonArray unwraps fenced JSON blocks', () => {
  const wrapped = '설명 문장\n```json\n[{"title":"A","url":"https://a"}]\n```\n뒤에 뭐가 더 있음';
  const raw = extractJsonArray(wrapped);
  assert.ok(raw);
  assert.equal(JSON.parse(raw).length, 1);
});

test('extractJsonArray returns null for texts without array', () => {
  assert.equal(extractJsonArray('그냥 아무 텍스트'), null);
});

test('parseWebSearchResponse parses inline JSON array from response text', () => {
  const payload = {
    candidates: [{
      content: {
        parts: [{
          text: '[{"title":"청년월세","summary":"만19-34 월세","url":"https://gov.kr/x","region":"서울","category":"주거"}]',
        }],
      },
    }],
  };
  const items = parseWebSearchResponse(payload);
  assert.equal(items.length, 1);
  assert.equal(items[0].title, '청년월세');
  assert.equal(items[0].url, 'https://gov.kr/x');
  assert.equal(items[0].region, '서울');
  assert.equal(items[0].category, '주거');
});

test('parseWebSearchResponse drops entries missing title or url', () => {
  const payload = {
    candidates: [{
      content: {
        parts: [{
          text: '[{"title":"","url":"https://a"},{"title":"kept","url":"https://b"},{"title":"no-url"}]',
        }],
      },
    }],
  };
  const items = parseWebSearchResponse(payload);
  assert.equal(items.length, 1);
  assert.equal(items[0].title, 'kept');
});

test('parseWebSearchResponse falls back to groundingChunks when JSON is missing', () => {
  const payload = {
    candidates: [{
      content: { parts: [{ text: '자유 응답 텍스트' }] },
      groundingMetadata: {
        groundingChunks: [
          { web: { uri: 'https://gov.kr/a', title: '정책 A' } },
          { web: { uri: 'https://gov.kr/b', title: '정책 B' } },
          { web: { title: 'no url' } },
        ],
      },
    }],
  };
  const items = parseWebSearchResponse(payload);
  assert.equal(items.length, 2);
  assert.equal(items[0].url, 'https://gov.kr/a');
  assert.equal(items[0].region, '전국');
  assert.equal(items[0].category, '기타');
});

test('parseWebSearchResponse returns empty when payload has neither JSON nor chunks', () => {
  const items = parseWebSearchResponse({ candidates: [{ content: { parts: [{ text: '아무 것도 없음' }] } }] });
  assert.equal(items.length, 0);
});

test('parseWebSearchResponse caps items at 8', () => {
  const many = Array.from({ length: 12 }, (_, i) => ({
    title: `t${i}`, url: `https://x/${i}`, summary: '', region: '', category: '',
  }));
  const payload = {
    candidates: [{ content: { parts: [{ text: JSON.stringify(many) }] } }],
  };
  const items = parseWebSearchResponse(payload);
  assert.equal(items.length, 8);
});
