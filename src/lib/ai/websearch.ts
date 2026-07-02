import 'server-only';
import { buildWebSearchPrompt, parseWebSearchResponse } from '@/lib/ai/websearchParser';
import { normalizeTextBenefit } from '@/lib/benefits/normalize';
import type {
  BenefitIntent,
  BenefitSourceDescriptor,
  BenefitSourceResult,
  NormalizedBenefit,
} from '@/types/benefit';

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

async function callGeminiWithSearch(query: string, intent?: BenefitIntent): Promise<unknown | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
  const url = `${GEMINI_ENDPOINT}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    contents: [{ parts: [{ text: buildWebSearchPrompt(query, intent) }] }],
    tools: [{ google_search: {} }],
    generationConfig: {
      temperature: 0.2,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error('[gemini websearch] status', response.status);
      return null;
    }
    return (await response.json()) as unknown;
  } catch (error) {
    console.error('[gemini websearch] error', error);
    return null;
  }
}

export async function searchAiWebSource(
  source: BenefitSourceDescriptor,
  params: URLSearchParams,
  keyword: string,
  fetchedAt: string,
  intent?: BenefitIntent,
): Promise<BenefitSourceResult> {
  const query = params.get('q') ?? keyword;
  if (!query.trim()) return { source, items: [] };
  if (!process.env.GEMINI_API_KEY) return { source, items: [] };

  const payload = await callGeminiWithSearch(query, intent);
  if (!payload) return { source, items: [], error: `${source.label} 검색 실패` };

  const parsed = parseWebSearchResponse(payload);
  const items: NormalizedBenefit[] = parsed.map((item, index) =>
    normalizeTextBenefit({
      id: `${source.id}:${index}:${item.url}`,
      source,
      title: item.title,
      summary: item.summary || `${item.category} · 웹 검색 결과 · ${item.region}`,
      category: item.category,
      target: '검색 결과 상세 참조',
      region: item.region,
      period: '원문 확인',
      applyUrl: item.url,
      eligibilityText: item.summary || '원문 확인 필요',
      keyword,
      fetchedAt,
      confidenceBoost: 4,
    }),
  );

  return { source, items };
}
