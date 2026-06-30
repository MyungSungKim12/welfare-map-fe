// Welfare 캐시 E2E 검증 스크립트
//
// 사용법:
//   1) 별도 터미널에서 dev 서버 실행: npm run dev
//   2) 본 스크립트 실행: node scripts/verify-welfare-cache.mjs
//
// 동작:
//   - /api/welfare/national 을 두 번 호출
//   - SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 미설정: 두 번 모두 cache:"bypass"
//   - env 설정 후 (테이블이 비어있다면): 첫 호출 cache:"miss", 두 번째 cache:"hit"

const BASE = process.env.WELFARE_VERIFY_BASE_URL ?? 'http://localhost:3000';
const ENDPOINT = '/api/welfare/national?numOfRows=5';

async function hit(label) {
  const url = `${BASE}${ENDPOINT}`;
  const res = await fetch(url, { cache: 'no-store' });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  const cache = json?.cache ?? '(no cache field)';
  const itemCount = json?.items?.length ?? 0;
  console.log(`[${label}] ${res.status} cache=${cache} items=${itemCount}`);
  return { status: res.status, cache, itemCount };
}

function summarize(first, second) {
  if (first.cache === 'bypass' && second.cache === 'bypass') {
    console.log('\n[결과] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 미설정으로 캐시 우회 동작.');
    console.log('       .env.local 또는 배포 환경에 두 값을 넣고 dev 서버 재시작 후 다시 실행.');
    return;
  }
  if (first.cache === 'miss' && second.cache === 'hit') {
    console.log('\n[결과] 정상: 첫 호출에서 외부 API → 캐시 기록, 두 번째 호출에서 캐시 히트 확인.');
    return;
  }
  if (first.cache === 'hit' && second.cache === 'hit') {
    console.log('\n[결과] 캐시가 이미 채워진 상태. 신선도 검증을 원하면 WELFARE_CACHE_TTL_MINUTES=0 으로 일시 설정 후 재실행.');
    return;
  }
  console.log('\n[결과] 예상치 못한 조합. 응답 cache 값을 다시 확인하세요.');
}

(async () => {
  console.log(`Target: ${BASE}${ENDPOINT}\n`);
  const first = await hit('1st');
  const second = await hit('2nd');
  summarize(first, second);
})().catch((err) => {
  console.error('[verify-welfare-cache 실패]', err.message);
  process.exit(1);
});
