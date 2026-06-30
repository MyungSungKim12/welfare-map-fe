import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadInsightsModule() {
  const filename = resolve('src/utils/welfareInsights.ts');
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
  };

  vm.runInNewContext(outputText, sandbox, { filename });
  return cjsModule.exports;
}

const {
  buildWelfareInsights,
  getDday,
  isRecentService,
  normalizeCategory,
} = loadInsightsModule();

const baseDate = new Date(2026, 5, 30);

test('getDday returns calendar day distance from YYYYMMDD deadline', () => {
  assert.equal(getDday('20260705', baseDate), 5);
  assert.equal(getDday('20260630', baseDate), 0);
  assert.equal(getDday('20260620', baseDate), -10);
  assert.equal(getDday('', baseDate), null);
});

test('isRecentService detects services updated within the configured window', () => {
  assert.equal(isRecentService('20260620', baseDate, 30), true);
  assert.equal(isRecentService('20260520', baseDate, 30), false);
  assert.equal(isRecentService(undefined, baseDate, 30), false);
});

test('normalizeCategory maps policy text into dashboard buckets', () => {
  assert.equal(normalizeCategory('건강검진, 의료'), '의료/건강');
  assert.equal(normalizeCategory('전세자금 주거 지원'), '주거/생활');
  assert.equal(normalizeCategory('청년 취업'), '취업/일자리');
  assert.equal(normalizeCategory('분류 없음'), '기타');
});

test('buildWelfareInsights derives urgent, new, recommended, and category data', () => {
  const items = [
    {
      id: 'urgent',
      title: '어르신 건강검진 지원',
      category: '건강검진',
      target: '65세 이상',
      period: '20260705',
      region: '인천광역시 미추홀구',
      summary: '지역 건강검진 지원',
      link: '',
      applyEndDd: '20260705',
      lastModYmd: '20260501',
    },
    {
      id: 'new',
      title: '청년 월세 지원',
      category: '주거',
      target: '청년',
      period: '상시',
      region: '전국',
      summary: '주거비 지원',
      link: '',
      isAlways: true,
      lastModYmd: '20260625',
    },
    {
      id: 'job',
      title: '취업 준비 지원',
      category: '취업',
      target: '구직자',
      period: '상시',
      region: '인천광역시',
      summary: '일자리 상담',
      link: '',
      isAlways: true,
      lastModYmd: '20260401',
    },
  ];

  const insights = buildWelfareInsights(items, baseDate);

  assert.equal(insights.totalCount, 3);
  assert.equal(insights.urgentCount, 1);
  assert.equal(insights.newCount, 1);
  assert.equal(insights.regionalCount, 2);
  assert.deepEqual(insights.urgentItems.map((item) => item.id), ['urgent']);
  assert.deepEqual(insights.newItems.map((item) => item.id), ['new']);
  assert.equal(insights.recommendedItems[0].id, 'urgent');
  assert.equal(insights.categoryStats[0].label, '의료/건강');
  assert.equal(insights.categoryStats[0].count, 1);
});
