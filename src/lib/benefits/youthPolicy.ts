import { normalizeTextBenefit } from '@/lib/benefits/normalize';
import type {
  BenefitIntent,
  BenefitSourceDescriptor,
  BenefitSourceResult,
} from '@/types/benefit';

/**
 * 신버전 온통청년 청년정책 API (JSON 지원).
 * https://www.youthcenter.go.kr/go/ythip/getPlcy
 *
 * 파라미터 (일부):
 *  - apiKeyNm (필수): 인증키
 *  - pageType: 1 (기본, page-based)
 *  - rtnType: json | xml
 *  - pageNum, pageSize
 *  - plcyNm: 정책명 부분일치
 *  - plcyKywdNm: 정책 키워드 (콤마 구분)
 *  - lclsfNm: 정책 대분류명 (일자리 / 주거 / 교육 / 복지문화 / 참여권리)
 *  - rgtrHghrkInsttCodeNm: 상위기관명 (예: 서울특별시)
 */
const YOUTH_POLICY_ENDPOINT = 'https://www.youthcenter.go.kr/go/ythip/getPlcy';

const YOUTH_KEYWORDS = ['청년', '전세대출', '취업', '창업', '교육훈련', '학자금', '일자리', '월세지원'];

const INTEREST_TO_LCLSF: Record<string, string> = {
  주거: '주거',
  일자리: '일자리',
  교육: '교육',
  돌봄: '복지문화',
  가족: '복지문화',
  생활: '복지문화',
  의료: '복지문화',
};

/**
 * intent / keyword 기반으로 이 소스에 요청을 보낼지 결정.
 * 청년 관련 신호가 없으면 skip 해서 응답 latency 를 아낀다.
 */
export function shouldSearchYouthPolicy(keyword: string, intent?: BenefitIntent): boolean {
  const text = [
    keyword,
    ...(intent?.keywords ?? []),
    ...(intent?.interests ?? []),
    intent?.lifeStage ?? '',
  ].join(' ');

  if (intent?.lifeStage === 'youth' || intent?.lifeStage === 'newlywed') return true;
  if (!text.trim()) return false;
  return YOUTH_KEYWORDS.some((word) => text.includes(word));
}

export interface YouthPolicyRow {
  plcyNo: string;
  plcyNm: string;
  plcyExplnCn: string;
  plcySprtCn: string;
  aplyBgngYmd: string;
  aplyEndYmd: string;
  plcyAplyMthdCn: string;
  sprvsnInsttCodeNm: string;
  rgtrInsttCodeNm: string;
  rgtrHghrkInsttCodeNm: string;
  lclsfNm: string;
  mclsfNm: string;
  plcyKywdNm: string;
  sprtScaleCnt: string;
  sprtTrgtMinAge: string;
  sprtTrgtMaxAge: string;
  refUrlAddr1: string;
  refUrlAddr2: string;
  aplyUrlAddr: string;
}

function pick(row: Record<string, unknown>, candidates: string[]): string {
  for (const key of candidates) {
    const value = row[key];
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return '';
}

/**
 * JSON envelope 에서 정책 리스트를 추출.
 * result.youthPolicyList / result / youthPolicyList / data 등 다양한 위치에 대응.
 */
export function extractPolicyRows(envelope: unknown): Record<string, unknown>[] {
  if (!envelope || typeof envelope !== 'object') return [];
  const root = envelope as Record<string, unknown>;

  const candidates: unknown[] = [
    (root.result as { youthPolicyList?: unknown } | undefined)?.youthPolicyList,
    root.youthPolicyList,
    root.result,
    root.data,
    root.list,
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) return c.filter((x): x is Record<string, unknown> => !!x && typeof x === 'object');
  }
  return [];
}

/**
 * 단일 row 를 표준 YouthPolicyRow shape 로 정규화.
 * 필드명은 API 버전에 따라 다양하므로 후보 리스트로 방어적으로 추출.
 */
export function normalizeYouthRow(row: Record<string, unknown>): YouthPolicyRow {
  return {
    plcyNo: pick(row, ['plcyNo', 'polyBizSjnm', 'bizId', 'PLCY_NO']),
    plcyNm: pick(row, ['plcyNm', 'polyBizSjnm', 'title']),
    plcyExplnCn: pick(row, ['plcyExplnCn', 'polyItcnCn', 'description']),
    plcySprtCn: pick(row, ['plcySprtCn', 'sporCn', 'sprtCn', 'supportContent']),
    aplyBgngYmd: pick(row, ['aplyBgngYmd', 'applyStartDate', 'rqutBgngYmd']),
    aplyEndYmd: pick(row, ['aplyEndYmd', 'applyEndDate', 'rqutEndYmd']),
    plcyAplyMthdCn: pick(row, ['plcyAplyMthdCn', 'aplyMthdCn', 'applyMethod']),
    sprvsnInsttCodeNm: pick(row, ['sprvsnInsttCodeNm', 'sprvsnInsttNm', 'operatingAgency']),
    rgtrInsttCodeNm: pick(row, ['rgtrInsttCodeNm', 'insttNm']),
    rgtrHghrkInsttCodeNm: pick(row, ['rgtrHghrkInsttCodeNm', 'sprvsnHghrkInsttCodeNm', 'upperInstitution']),
    lclsfNm: pick(row, ['lclsfNm', 'polyRlmCd', 'largeClassification']),
    mclsfNm: pick(row, ['mclsfNm', 'middleClassification']),
    plcyKywdNm: pick(row, ['plcyKywdNm', 'keyword', 'keywords']),
    sprtScaleCnt: pick(row, ['sprtScaleCnt', 'sporScvl', 'supportScale']),
    sprtTrgtMinAge: pick(row, ['sprtTrgtMinAge', 'ageInfoMin']),
    sprtTrgtMaxAge: pick(row, ['sprtTrgtMaxAge', 'ageInfoMax']),
    refUrlAddr1: pick(row, ['refUrlAddr1', 'rfcSiteUrla1', 'referenceUrl']),
    refUrlAddr2: pick(row, ['refUrlAddr2', 'rfcSiteUrla2']),
    aplyUrlAddr: pick(row, ['aplyUrlAddr', 'applyUrl']),
  };
}

function buildTargetText(row: YouthPolicyRow): string {
  const parts: string[] = [];
  if (row.sprtTrgtMinAge || row.sprtTrgtMaxAge) {
    parts.push(`${row.sprtTrgtMinAge || '?'}세~${row.sprtTrgtMaxAge || '?'}세`);
  }
  if (row.plcyKywdNm) parts.push(row.plcyKywdNm);
  return parts.join(' · ') || '청년';
}

function buildPeriod(row: YouthPolicyRow): string {
  if (!row.aplyBgngYmd && !row.aplyEndYmd) return '확인 필요';
  const fmt = (v: string) => (v && v.length === 8 ? `${v.slice(0, 4)}.${v.slice(4, 6)}.${v.slice(6, 8)}` : v);
  return `${fmt(row.aplyBgngYmd) || '수시'} ~ ${fmt(row.aplyEndYmd) || '수시'}`;
}

export async function searchYouthPolicySource(
  source: BenefitSourceDescriptor,
  params: URLSearchParams,
  keyword: string,
  fetchedAt: string,
  intent?: BenefitIntent,
): Promise<BenefitSourceResult> {
  const apiKey = process.env.YOUTH_POLICY_API_KEY;
  if (!apiKey) return { source, items: [] };
  if (!shouldSearchYouthPolicy(keyword, intent)) return { source, items: [] };

  const built = new URLSearchParams({
    apiKeyNm: apiKey,
    pageType: '1',
    rtnType: 'json',
    pageNum: '1',
    pageSize: '30',
  });

  // 검색 키워드 매핑
  const kw = params.get('q')?.trim() || keyword.trim();
  if (kw) built.set('plcyKywdNm', kw);

  // intent 관심분야 → 대분류명
  const primaryInterest = intent?.interests?.[0];
  if (primaryInterest && INTEREST_TO_LCLSF[primaryInterest]) {
    built.set('lclsfNm', INTEREST_TO_LCLSF[primaryInterest]);
  }

  // 지역 힌트 (상위기관명)
  if (intent?.region?.sido) {
    const sido = intent.region.sido.includes('시') || intent.region.sido.includes('도')
      ? intent.region.sido
      : `${intent.region.sido}특별시`;
    built.set('rgtrHghrkInsttCodeNm', sido);
  }

  try {
    const response = await fetch(`${YOUTH_POLICY_ENDPOINT}?${built.toString()}`, { cache: 'no-store' });
    if (!response.ok) return { source, items: [], error: `${source.label} ${response.status}` };

    const envelope = (await response.json()) as unknown;
    const rawRows = extractPolicyRows(envelope);
    const rows = rawRows.map(normalizeYouthRow).filter((row) => row.plcyNm.length > 0);

    const items = rows.map((row, index) =>
      normalizeTextBenefit({
        id: `youth-policy:${row.plcyNo || index}:${row.plcyNm}`,
        source,
        title: row.plcyNm,
        summary: row.plcyExplnCn || row.plcySprtCn || '청년정책 · 원문 확인 필요',
        category: [row.lclsfNm, row.mclsfNm].filter(Boolean).join(' / ') || '청년정책',
        target: buildTargetText(row),
        region: row.rgtrHghrkInsttCodeNm || row.sprvsnInsttCodeNm || '전국',
        period: buildPeriod(row),
        applyUrl: row.aplyUrlAddr || row.refUrlAddr1 || row.refUrlAddr2 || 'https://www.youthcenter.go.kr',
        eligibilityText: row.plcySprtCn || row.plcyExplnCn || row.plcyKywdNm || '청년 대상',
        keyword,
        fetchedAt,
        confidenceBoost: 8,
      }),
    );

    return { source, items };
  } catch {
    return { source, items: [], error: `${source.label} 검색 실패` };
  }
}
