import type { BenefitIntent } from '@/types/benefit';

/**
 * Gemini google_search grounding 응답에서 뽑아낸 개별 결과 항목.
 * 순수 파싱 결과 — 테스트 대상.
 */
export interface WebSearchItem {
  title: string;
  summary: string;
  url: string;
  region: string;
  category: string;
}

interface GeminiWebResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    groundingMetadata?: {
      groundingChunks?: Array<{
        web?: { uri?: string; title?: string };
      }>;
    };
  }>;
}

export function buildWebSearchPrompt(query: string, intent?: BenefitIntent): string {
  const regionHint = intent?.region
    ? `${intent.region.sido ?? ''} ${intent.region.sigungu ?? ''}`.trim()
    : '';
  const interestHint = intent?.interests && intent.interests.length > 0
    ? intent.interests.join(', ')
    : '';

  return `다음 한국 사용자의 자연어 질문에 대해, 웹에서 최신 공공복지·정부혜택·지자체 지원 정보를 찾아라.

응답은 반드시 아래 JSON 배열 하나만 출력하라. 설명 문장, 코드블록, 마크다운 접두사 없이 순수 JSON.

[
  {
    "title": "정책/사업 이름",
    "summary": "80자 이내 요약 (누구를 위해 무엇을 지원하는지)",
    "url": "공식 원본 URL (정부/지자체/공공기관 우선)",
    "region": "지역 (전국 또는 시/도 또는 시/도 + 구/군)",
    "category": "분야 라벨 (예: 주거, 일자리, 의료, 교육, 돌봄, 생활, 가족)"
  }
]

규칙:
- 최대 8개.
- 공식 정부(.go.kr) / 지자체 / 공공기관 도메인을 우선.
- 이미 종료된 사업은 제외. 상시 신청/현재 접수 중인 것 우선.
- 실제 링크가 접근 가능한 항목만 포함.
- 요약은 사용자 조건과 연결되게 작성.

질문: "${query}"
${regionHint ? `사용자 지역 힌트: ${regionHint}` : ''}
${interestHint ? `관심 분야: ${interestHint}` : ''}`;
}

export function extractJsonArray(text: string): string | null {
  // ```json ... ``` 코드블록 안에 있어도 대응
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenceMatch ? fenceMatch[1] : text;
  const start = candidate.indexOf('[');
  const end = candidate.lastIndexOf(']');
  if (start === -1 || end === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}

/**
 * Gemini 응답 (text + grounding chunks) 을 WebSearchItem[] 로 변환.
 * 1) 응답 텍스트의 JSON 우선 파싱
 * 2) 실패 시 groundingChunks 만으로 최소 항목 구성
 */
export function parseWebSearchResponse(payload: unknown): WebSearchItem[] {
  const data = (payload ?? {}) as GeminiWebResponse;
  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
  const chunks = candidate?.groundingMetadata?.groundingChunks ?? [];

  const jsonStr = extractJsonArray(text);
  if (jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr) as unknown[];
      if (Array.isArray(parsed)) {
        const mapped = parsed
          .map((item) => {
            const r = (item ?? {}) as Record<string, unknown>;
            const title = typeof r.title === 'string' ? r.title.trim() : '';
            const url = typeof r.url === 'string' ? r.url.trim() : '';
            if (!title || !url) return null;
            return {
              title,
              url,
              summary: typeof r.summary === 'string' ? r.summary.trim() : '',
              region: typeof r.region === 'string' && r.region.trim() ? r.region.trim() : '전국',
              category: typeof r.category === 'string' && r.category.trim() ? r.category.trim() : '기타',
            } satisfies WebSearchItem;
          })
          .filter((x): x is WebSearchItem => x !== null)
          .slice(0, 8);
        if (mapped.length > 0) return mapped;
      }
    } catch {
      // JSON 파싱 실패 → chunks fallback
    }
  }

  return chunks
    .map((chunk) => {
      const web = chunk.web;
      if (!web?.uri || !web?.title) return null;
      return {
        title: web.title,
        url: web.uri,
        summary: '웹 검색 근거 · 원문 확인이 필요합니다.',
        region: '전국',
        category: '기타',
      } satisfies WebSearchItem;
    })
    .filter((x): x is WebSearchItem => x !== null)
    .slice(0, 8);
}
