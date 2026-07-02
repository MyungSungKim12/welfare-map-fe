import { normalizeTextBenefit } from '@/lib/benefits/normalize';
import type {
  BenefitIntent,
  BenefitSourceDescriptor,
  BenefitSourceResult,
} from '@/types/benefit';

const YOUTH_POLICY_ENDPOINT = 'https://www.youthcenter.go.kr/opi/youthPlcyList.do';

const YOUTH_KEYWORDS = ['청년', '전세대출', '취업', '창업', '교육훈련', '학자금', '일자리', '월세지원'];

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

interface YouthPolicyXmlRow {
  polyBizSjnm: string;
  polyItcnCn: string;
  sporCn: string;
  pcInInfo: string;
  ageInfo: string;
  rqutPrdCn: string;
  mngtMxrsCd: string;
  rfcSiteUrla1: string;
  aplyUrlAddr: string;
}

function decodeHtml(value: string): string {
  return value
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseYouthPolicyXml(xml: string): YouthPolicyXmlRow[] {
  const rows: YouthPolicyXmlRow[] = [];
  const blocks = xml.match(/<youthPolicy>([\s\S]*?)<\/youthPolicy>/g) ?? [];

  for (const block of blocks) {
    const get = (tag: string) => {
      const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      return match ? decodeHtml(match[1]) : '';
    };

    rows.push({
      polyBizSjnm: get('polyBizSjnm'),
      polyItcnCn: get('polyItcnCn'),
      sporCn: get('sporCn'),
      pcInInfo: get('pcInInfo'),
      ageInfo: get('ageInfo'),
      rqutPrdCn: get('rqutPrdCn'),
      mngtMxrsCd: get('mngtMxrsCd'),
      rfcSiteUrla1: get('rfcSiteUrla1'),
      aplyUrlAddr: get('aplyUrlAddr'),
    });
  }
  return rows;
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

  const query = params.get('q') ?? keyword;
  const built = new URLSearchParams({
    openApiVlak: apiKey,
    display: '30',
    pageIndex: '1',
  });
  if (query.trim()) built.set('query', query.trim());

  try {
    const response = await fetch(`${YOUTH_POLICY_ENDPOINT}?${built.toString()}`, { cache: 'no-store' });
    if (!response.ok) return { source, items: [], error: `${source.label} ${response.status}` };
    const xml = await response.text();
    const rows = parseYouthPolicyXml(xml);

    const items = rows
      .filter((row) => row.polyBizSjnm)
      .map((row, index) =>
        normalizeTextBenefit({
          id: `youth-policy:${index}:${row.polyBizSjnm}`,
          source,
          title: row.polyBizSjnm,
          summary: row.polyItcnCn || row.sporCn || '청년정책 · 원문 확인 필요',
          category: '청년정책',
          target: row.pcInInfo || row.ageInfo || '청년',
          region: row.mngtMxrsCd || '전국',
          period: row.rqutPrdCn || '확인 필요',
          applyUrl: row.aplyUrlAddr || row.rfcSiteUrla1 || 'https://www.youthcenter.go.kr',
          eligibilityText: row.pcInInfo || row.ageInfo || '청년 대상',
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
