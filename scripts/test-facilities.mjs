import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadFacilitiesModule() {
  const filename = resolve('src/utils/facilities.ts');
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

const {
  FACILITY_QUERIES,
  documentToFacility,
  dedupeFacilities,
  inferFacilityCategory,
  mergeFacilityResults,
} = loadFacilitiesModule();

const sampleDoc = {
  id: '1234',
  place_name: '미추홀구 종합사회복지관',
  category_name: '공공,사회기관 > 사회복지시설 > 복지관',
  phone: '032-123-4567',
  address_name: '인천 미추홀구 주안동',
  road_address_name: '인천 미추홀구 주안로 100',
  x: '126.7052',
  y: '37.4563',
  place_url: 'https://place.map.kakao.com/1234',
  distance: '850',
};

test('FACILITY_QUERIES exposes at least the core welfare facility keywords', () => {
  const labels = FACILITY_QUERIES.map((entry) => entry.label);
  assert.ok(labels.includes('복지관'));
  assert.ok(labels.includes('주민센터'));
  assert.ok(labels.includes('보건소'));
});

test('inferFacilityCategory uses the deepest segment of the Kakao category path', () => {
  assert.equal(inferFacilityCategory('공공,사회기관 > 사회복지시설 > 복지관', '복지관'), '복지관');
  assert.equal(inferFacilityCategory('', '주민센터'), '주민센터');
  assert.equal(inferFacilityCategory('', ''), '복지시설');
});

test('documentToFacility maps Kakao keyword fields to Facility shape', () => {
  const facility = documentToFacility(sampleDoc, '복지관');
  assert.equal(facility.id, '1234');
  assert.equal(facility.name, '미추홀구 종합사회복지관');
  assert.equal(facility.category, '복지관');
  assert.equal(facility.rawCategory, sampleDoc.category_name);
  assert.equal(facility.lat, 37.4563);
  assert.equal(facility.lng, 126.7052);
  assert.equal(facility.address, '인천 미추홀구 주안로 100');
  assert.equal(facility.phone, '032-123-4567');
  assert.equal(facility.distance, 850);
});

test('documentToFacility drops invalid coordinates or missing identity', () => {
  assert.equal(documentToFacility({ ...sampleDoc, x: 'NaN' }, '복지관'), null);
  assert.equal(documentToFacility({ ...sampleDoc, id: '' }, '복지관'), null);
  assert.equal(documentToFacility({ ...sampleDoc, place_name: '' }, '복지관'), null);
});

test('dedupeFacilities removes duplicate ids preserving first occurrence', () => {
  const first = documentToFacility(sampleDoc, '복지관');
  const dup = documentToFacility({ ...sampleDoc, place_name: '다른 이름' }, '복지관');
  const result = dedupeFacilities([first, dup]);
  assert.equal(result.length, 1);
  assert.equal(result[0].name, '미추홀구 종합사회복지관');
});

test('mergeFacilityResults dedupes across groups and sorts by distance', () => {
  const near = { ...sampleDoc, id: 'a', distance: '120' };
  const far = { ...sampleDoc, id: 'b', distance: '900' };
  const middle = { ...sampleDoc, id: 'c', distance: '450' };

  const merged = mergeFacilityResults([
    { docs: [far, near], label: '복지관' },
    { docs: [middle, { ...near, place_name: '중복' }], label: '주민센터' },
  ]);

  const ids = merged.map((m) => m.id);
  assert.equal(ids.length, 3);
  assert.equal(ids[0], 'a');
  assert.equal(ids[1], 'c');
  assert.equal(ids[2], 'b');
});
