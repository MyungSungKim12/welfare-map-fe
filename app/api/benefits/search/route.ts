import { NextRequest, NextResponse } from 'next/server';
import {
  dedupeNormalizedBenefits,
  normalizeWelfareItem,
} from '@/lib/benefits/normalize';
import {
  BENEFIT_SOURCES,
  getActiveBenefitSources,
  getPlannedBenefitSources,
} from '@/lib/benefits/sources';
import type { BenefitSourceDescriptor, BenefitSourceResult, NormalizedBenefit } from '@/types/benefit';
import type { WelfareItem } from '@/types/welfare';

interface WelfareApiResponse {
  items?: WelfareItem[];
}

const AGE_TO_LIFE_CODE: Record<string, string> = {
  child: '001',
  youth: '003',
  middle: '004',
  senior: '006',
  all: '',
};

const SITUATION_TO_KEY_CODE: Record<string, string> = {
  newlywed: '010',
  pregnant: '002',
  job: '004',
  disability: '003',
  lowincome: '001',
  all: '',
};

async function readWelfareItems(url: string): Promise<WelfareItem[]> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return [];
  const data = (await response.json()) as WelfareApiResponse;
  return data.items ?? [];
}

function buildSourceUrl(req: NextRequest, source: BenefitSourceDescriptor) {
  const { searchParams, origin } = req.nextUrl;
  const lifeArray = AGE_TO_LIFE_CODE[searchParams.get('ageGroup') ?? 'all'] ?? '';
  const srchKeyCode = SITUATION_TO_KEY_CODE[searchParams.get('situation') ?? 'all'] ?? '';
  const numOfRows = searchParams.get('numOfRows') ?? '100';

  if (source.id === 'bokjiro-local') {
    const params = new URLSearchParams({
      numOfRows,
      sidoCd: searchParams.get('sidoCd') ?? '28',
      sidoName: searchParams.get('sidoName') ?? '인천광역시',
      sigunguName: searchParams.get('sigunguName') ?? '',
    });
    if (lifeArray) params.set('lifeArray', lifeArray);
    if (srchKeyCode) params.set('srchKeyCode', srchKeyCode);
    return `${origin}/api/welfare/local?${params.toString()}`;
  }

  if (source.id === 'bokjiro-national') {
    const params = new URLSearchParams({ numOfRows });
    if (lifeArray) params.set('lifeArray', lifeArray);
    if (srchKeyCode) params.set('srchKeyCode', srchKeyCode);
    return `${origin}/api/welfare/national?${params.toString()}`;
  }

  return null;
}

function textMatches(item: NormalizedBenefit, keyword: string) {
  if (!keyword.trim()) return true;
  const normalized = keyword.trim().toLowerCase();
  return [
    item.title,
    item.summary,
    item.category,
    item.target,
    item.region,
    item.eligibilityText,
  ]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalized));
}

async function searchSource(
  req: NextRequest,
  source: BenefitSourceDescriptor,
  keyword: string,
  fetchedAt: string,
): Promise<BenefitSourceResult> {
  const url = buildSourceUrl(req, source);
  if (!url) return { source, items: [] };

  try {
    const rawItems = await readWelfareItems(url);
    const items = rawItems
      .map((item) => normalizeWelfareItem(item, source, keyword, fetchedAt))
      .filter((item) => textMatches(item, keyword));
    return { source, items };
  } catch {
    return { source, items: [], error: `${source.label} 검색 실패` };
  }
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') ?? '';
  const apiKeyword = req.nextUrl.searchParams.get('apiKeyword') ?? '';
  const keyword = apiKeyword || query;
  const fetchedAt = new Date().toISOString();
  const activeSources = getActiveBenefitSources();
  const plannedSources = getPlannedBenefitSources();

  const sourceResults = await Promise.all(
    activeSources.map((source) => searchSource(req, source, keyword, fetchedAt)),
  );
  const items = dedupeNormalizedBenefits(sourceResults.flatMap((result) => result.items))
    .sort((a, b) => b.confidence - a.confidence);

  return NextResponse.json({
    items,
    sourceResults,
    activeSources,
    plannedSources,
    totalCount: items.length,
    query,
    apiKeyword,
    registry: BENEFIT_SOURCES,
  });
}
