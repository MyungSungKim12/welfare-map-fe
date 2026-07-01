import type { BenefitSourceDescriptor, NormalizedBenefit } from '@/types/benefit';
import type { WelfareItem } from '@/types/welfare';

function textIncludes(item: WelfareItem, keyword: string) {
  if (!keyword.trim()) return true;
  const normalized = keyword.trim().toLowerCase();
  return [item.title, item.summary, item.category, item.target, item.region]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalized));
}

function scoreBenefit(item: WelfareItem, keyword: string, sourceBoost: number) {
  const keywordScore = keyword && textIncludes(item, keyword) ? 12 : 0;
  const alwaysScore = item.isAlways ? 4 : 0;
  const summaryScore = item.summary?.length > 20 ? 3 : 0;
  return Math.min(98, 72 + sourceBoost + keywordScore + alwaysScore + summaryScore);
}

export function normalizeWelfareItem(
  item: WelfareItem,
  source: BenefitSourceDescriptor,
  keyword: string,
  fetchedAt: string,
): NormalizedBenefit {
  return {
    id: `${source.id}:${item.id}`,
    sourceId: source.id,
    sourceLabel: source.label,
    sourceCategory: source.category,
    title: item.title,
    summary: item.summary || '상세 설명은 원문에서 확인이 필요합니다.',
    category: item.category || '기타',
    target: item.target || '전체',
    region: item.region || '전국',
    period: item.period || '확인 필요',
    applyUrl: item.link,
    eligibilityText: item.target || item.summary || '대상 조건 확인 필요',
    evidence: {
      sourceId: source.id,
      sourceLabel: source.label,
      url: item.link,
      fetchedAt,
    },
    confidence: scoreBenefit(item, keyword, source.id === 'bokjiro-local' ? 6 : 3),
    raw: item,
  };
}

export function normalizedBenefitToWelfareItem(item: NormalizedBenefit): WelfareItem {
  if (item.raw) return item.raw;
  return {
    id: item.id,
    source: item.sourceId === 'bokjiro-local' ? 'local' : 'national',
    cacheKey: item.id,
    title: item.title,
    category: item.category,
    target: item.target,
    period: item.period,
    region: item.region,
    summary: item.summary,
    link: item.applyUrl,
  };
}

export function dedupeNormalizedBenefits(items: NormalizedBenefit[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.title.trim()}::${item.region.trim()}::${item.target.trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
