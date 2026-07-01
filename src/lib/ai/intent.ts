import type { BenefitIntent } from '@/types/benefit';

const LIFE_STAGE_KEYWORDS: Record<NonNullable<BenefitIntent['lifeStage']>, string[]> = {
  child: ['아동', '어린이', '유아', '영유아'],
  youth: ['청년', '20대', '30대', '취준', '취업준비'],
  middle: ['중년', '40대', '50대'],
  senior: ['노인', '고령', '어르신', '60대', '70대', '80대'],
  newlywed: ['신혼', '결혼', '예비부부'],
  pregnant: ['임신', '출산', '산모', '임산부'],
  disability: ['장애', '장애인'],
  lowincome: ['저소득', '기초생활', '수급', '차상위'],
};

const INTEREST_KEYWORDS: Record<string, string[]> = {
  주거: ['주거', '월세', '전세', '임대', '보증금', '주택'],
  일자리: ['일자리', '취업', '구직', '창업', '고용', '직업훈련'],
  의료: ['의료', '건강', '병원', '진료', '치료', '검진', '약값'],
  교육: ['교육', '학원', '학자금', '장학', '학교', '학습'],
  돌봄: ['돌봄', '어린이집', '보육', '요양', '간병'],
  생활: ['생활', '생계', '난방', '에너지', '식비'],
  가족: ['가족', '자녀', '양육', '부모'],
};

const URGENT_KEYWORDS = ['마감', '임박', '급', '빨리', '오늘', '이번주', '이달'];

const SIDO_KEYWORDS = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
];

function extractLifeStage(text: string): BenefitIntent['lifeStage'] | undefined {
  for (const [stage, keywords] of Object.entries(LIFE_STAGE_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) {
      return stage as BenefitIntent['lifeStage'];
    }
  }
  return undefined;
}

function extractInterests(text: string): string[] {
  const found: string[] = [];
  for (const [label, keywords] of Object.entries(INTEREST_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) {
      found.push(label);
    }
  }
  return found;
}

function extractRegion(text: string): BenefitIntent['region'] {
  const sido = SIDO_KEYWORDS.find((s) => text.includes(s));
  if (!sido) return undefined;
  const sigunguMatch = text.match(/([가-힣]+(?:구|군|시))/);
  return { sido, sigungu: sigunguMatch?.[1] };
}

function extractKeywords(text: string): string[] {
  const tokens = text
    .replace(/[^가-힣a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 2);
  const unique = Array.from(new Set(tokens));
  return unique.slice(0, 8);
}

/** GEMINI_API_KEY 없거나 호출 실패 시 규칙 기반 fallback. */
export function fallbackIntent(query: string): BenefitIntent {
  const text = query.trim();
  return {
    rawQuery: text,
    keywords: extractKeywords(text),
    lifeStage: extractLifeStage(text),
    interests: extractInterests(text),
    region: extractRegion(text),
    urgency: URGENT_KEYWORDS.some((k) => text.includes(k)) ? 'urgent' : 'normal',
    source: 'fallback',
    confidence: text.length >= 4 ? 0.5 : 0.2,
  };
}

interface GeminiIntentPayload {
  keywords?: unknown;
  lifeStage?: unknown;
  interests?: unknown;
  region?: unknown;
  urgency?: unknown;
}

const VALID_LIFE_STAGES = new Set<NonNullable<BenefitIntent['lifeStage']>>([
  'child', 'youth', 'middle', 'senior', 'newlywed', 'pregnant', 'disability', 'lowincome',
]);

const KNOWN_INTERESTS = new Set(Object.keys(INTEREST_KEYWORDS));

function safeStringArray(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    .map((v) => v.trim())
    .slice(0, limit);
}

/** Gemini 응답 JSON 을 안전하게 파싱해서 BenefitIntent 로 변환. */
export function parseGeminiIntent(query: string, payload: unknown): BenefitIntent {
  const p = (payload ?? {}) as GeminiIntentPayload;

  const keywords = safeStringArray(p.keywords, 8);
  const interests = safeStringArray(p.interests, 6).filter((i) => KNOWN_INTERESTS.has(i));

  const stageStr = typeof p.lifeStage === 'string' ? p.lifeStage : undefined;
  const lifeStage = stageStr && VALID_LIFE_STAGES.has(stageStr as NonNullable<BenefitIntent['lifeStage']>)
    ? (stageStr as BenefitIntent['lifeStage'])
    : undefined;

  const urgency = p.urgency === 'urgent' ? 'urgent' : 'normal';

  let region: BenefitIntent['region'];
  if (p.region && typeof p.region === 'object') {
    const r = p.region as { sido?: unknown; sigungu?: unknown };
    const sido = typeof r.sido === 'string' && r.sido.length > 0 ? r.sido : undefined;
    const sigungu = typeof r.sigungu === 'string' && r.sigungu.length > 0 ? r.sigungu : undefined;
    if (sido || sigungu) region = { sido, sigungu };
  }

  // Gemini 가 놓친 부분은 fallback 로 보충.
  const backup = fallbackIntent(query);
  return {
    rawQuery: query,
    keywords: keywords.length > 0 ? keywords : backup.keywords,
    lifeStage: lifeStage ?? backup.lifeStage,
    interests: interests.length > 0 ? interests : backup.interests,
    region: region ?? backup.region,
    urgency,
    source: 'ai',
    confidence: keywords.length > 0 || interests.length > 0 || lifeStage ? 0.85 : 0.5,
  };
}

/** Gemini 프롬프트에 넣을 시스템 지시. 스키마는 route 에서 responseSchema 로 별도 강제. */
export function buildIntentPrompt(query: string, profile?: Record<string, unknown>): string {
  const profileHint = profile && Object.keys(profile).length > 0
    ? `\n\n사용자 프로필 (참고용): ${JSON.stringify(profile)}`
    : '';

  return `사용자가 한국 공공복지/혜택을 찾기 위해 입력한 자연어 검색 문장을 분석해 다음 JSON 스키마로 답하라.

- keywords: 검색에 유용한 명사/키워드 배열 (최대 8개, 한국어)
- lifeStage: child | youth | middle | senior | newlywed | pregnant | disability | lowincome 중 하나 (해당 없으면 생략)
- interests: 주거 | 일자리 | 의료 | 교육 | 돌봄 | 생활 | 가족 중 다중 선택
- region: { sido, sigungu } (언급 없으면 생략)
- urgency: urgent | normal (마감 임박이나 급함 표현이 있으면 urgent)

문장: "${query}"${profileHint}

키워드는 실제 API 검색어로 그대로 넘어가니 조사/어미 제거된 원형만 넣어라.`;
}
