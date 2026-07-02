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
import { searchSeoulOpenDataSource } from '@/lib/benefits/seoulOpenData';
import { resolveIntent } from '@/lib/ai/resolver';
import type { BenefitIntent, BenefitSourceDescriptor, BenefitSourceResult, NormalizedBenefit } from '@/types/benefit';
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

const AGE_STAGES = new Set(['child', 'youth', 'middle', 'senior']);
const SITUATION_STAGES = new Set(['newlywed', 'pregnant', 'job', 'disability', 'lowincome']);

/** intent.lifeStage 를 URL param 자리 (ageGroup / situation) 로 나눠 매핑. */
function applyIntentToParams(params: URLSearchParams, intent: BenefitIntent) {
  if (intent.lifeStage) {
    if (AGE_STAGES.has(intent.lifeStage) && !params.get('ageGroup')) {
      params.set('ageGroup', intent.lifeStage);
    }
    if (SITUATION_STAGES.has(intent.lifeStage) && !params.get('situation')) {
      params.set('situation', intent.lifeStage);
    }
  }
  if (!params.get('apiKeyword') && intent.keywords.length > 0) {
    params.set('apiKeyword', intent.keywords[0]);
  }
  if (intent.region?.sido && !params.get('sidoName')) {
    params.set('sidoName', intent.region.sido);
  }
  if (intent.region?.sigungu && !params.get('sigunguName')) {
    params.set('sigunguName', intent.region.sigungu);
  }
}

async function readWelfareItems(url: string): Promise<WelfareItem[]> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return [];
  const data = (await response.json()) as WelfareApiResponse;
  return data.items ?? [];
}

function buildSourceUrl(origin: string, source: BenefitSourceDescriptor, params: URLSearchParams) {
  const lifeArray = AGE_TO_LIFE_CODE[params.get('ageGroup') ?? 'all'] ?? '';
  const srchKeyCode = SITUATION_TO_KEY_CODE[params.get('situation') ?? 'all'] ?? '';
  const numOfRows = params.get('numOfRows') ?? '100';

  if (source.id === 'bokjiro-local') {
    const built = new URLSearchParams({
      numOfRows,
      sidoCd: params.get('sidoCd') ?? '28',
      sidoName: params.get('sidoName') ?? '인천광역시',
      sigunguName: params.get('sigunguName') ?? '',
    });
    if (lifeArray) built.set('lifeArray', lifeArray);
    if (srchKeyCode) built.set('srchKeyCode', srchKeyCode);
    return `${origin}/api/welfare/local?${built.toString()}`;
  }

  if (source.id === 'bokjiro-national') {
    const built = new URLSearchParams({ numOfRows });
    if (lifeArray) built.set('lifeArray', lifeArray);
    if (srchKeyCode) built.set('srchKeyCode', srchKeyCode);
    return `${origin}/api/welfare/national?${built.toString()}`;
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
  origin: string,
  source: BenefitSourceDescriptor,
  params: URLSearchParams,
  keyword: string,
  fetchedAt: string,
  intent?: BenefitIntent,
): Promise<BenefitSourceResult> {
  if (source.id === 'seoul-open-data') {
    return searchSeoulOpenDataSource(source, params, keyword, fetchedAt, intent);
  }

  const url = buildSourceUrl(origin, source, params);
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
  const { origin } = req.nextUrl;
  const params = new URLSearchParams(req.nextUrl.searchParams);

  const query = params.get('q') ?? '';

  // query 가 있으면 항상 intent 를 파싱해서 UI 가 파싱 결과를 표시할 수 있게 응답에 포함.
  // 파라미터 보정은 URL 에 이미 값이 있으면 override 하지 않음 (applyIntentToParams 내부의 !params.get 체크).
  let intent: BenefitIntent | undefined;
  if (query.trim().length > 0) {
    intent = await resolveIntent(query);
    applyIntentToParams(params, intent);
  }

  const keyword = params.get('apiKeyword') ?? query;
  const fetchedAt = new Date().toISOString();
  const activeSources = getActiveBenefitSources();
  const plannedSources = getPlannedBenefitSources();

  const sourceResults = await Promise.all(
    activeSources.map((source) => searchSource(origin, source, params, keyword, fetchedAt, intent)),
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
    apiKeyword: params.get('apiKeyword') ?? '',
    intent,
    registry: BENEFIT_SOURCES,
  });
}
