import type { BenefitIntent, NormalizedBenefit } from '@/types/benefit';

/**
 * AI 답변 생성에 사용할 compact benefit shape.
 * Gemini 프롬프트 토큰을 아끼기 위해 필드 최소화.
 */
export interface AnswerBenefit {
  index: number;
  title: string;
  category: string;
  target: string;
  region: string;
  summary: string;
  sourceLabel: string;
  applyUrl: string;
}

export function truncate(value: string, max: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

/** NormalizedBenefit[] → AnswerBenefit[] (프롬프트 삽입용). */
export function pickAnswerBenefits(items: NormalizedBenefit[], limit = 8): AnswerBenefit[] {
  return items.slice(0, limit).map((item, index) => ({
    index: index + 1,
    title: truncate(item.title, 80),
    category: truncate(item.category, 30),
    target: truncate(item.target, 60),
    region: truncate(item.region, 40),
    summary: truncate(item.summary, 160),
    sourceLabel: truncate(item.sourceLabel, 40),
    applyUrl: item.applyUrl || '',
  }));
}

function intentSummary(intent: BenefitIntent | undefined): string {
  if (!intent) return '(사용자 조건 별도 지정 없음)';
  const parts: string[] = [];
  if (intent.lifeStage) parts.push(`생애주기=${intent.lifeStage}`);
  if (intent.interests.length > 0) parts.push(`관심분야=${intent.interests.join(',')}`);
  if (intent.region?.sido) parts.push(`지역=${[intent.region.sido, intent.region.sigungu].filter(Boolean).join(' ')}`);
  if (intent.urgency === 'urgent') parts.push('긴급=예');
  if (intent.keywords.length > 0) parts.push(`키워드=${intent.keywords.slice(0, 5).join(',')}`);
  return parts.length > 0 ? parts.join(' · ') : '(조건 미탐지)';
}

export function buildAnswerPrompt(
  query: string,
  intent: BenefitIntent | undefined,
  benefits: AnswerBenefit[],
): string {
  const q = query.trim() || '(질문 없음)';
  const conditionLine = intentSummary(intent);
  const list = benefits.length === 0
    ? '(관련 후보를 찾지 못했습니다)'
    : benefits
        .map((b) => `[${b.index}] ${b.title}
    분류: ${b.category} · 대상: ${b.target} · 지역: ${b.region}
    출처: ${b.sourceLabel}
    요약: ${b.summary}`)
        .join('\n\n');

  return `당신은 한국 공공복지·정부혜택을 안내하는 친절한 컨시어지입니다.
사용자 자연어 질문과 시스템이 찾아낸 관련 후보를 바탕으로, 한국어 존댓말로 대화형 답변을 작성하세요.

작성 규칙:
- 4~7문장, 존댓말, 자연스러운 대화체
- 사용자의 조건에 맞는 대표 후보 2~3개를 골라 [번호] 형식으로 인용하며 왜 매칭되는지 설명
- 마감 임박·긴급 신호가 있으면 우선 안내
- 지역/연령/자격 제한이 있으면 확인 필요성 언급
- 관련 후보가 없거나 정보가 부족하면 정직하게 말하고 공식 사이트/AI 웹 검색을 권유
- 광고성 문구·과장 표현·"확실합니다"류 단정 금지
- 마지막 문장은 사용자가 다음에 취할 행동을 짧게 제안 ("아래 카드에서 상세를 확인해보세요" 등)

사용자 질문: "${q}"
AI 가 파악한 사용자 조건: ${conditionLine}

시스템이 찾아낸 관련 후보:
${list}

이제 위 규칙에 맞춰 답변만 출력하세요. 서두 인사말, 마크다운, 코드블록, 번호 목록 없이 자연스러운 문단으로.`;
}

/** Gemini 응답 텍스트 정제 — 코드블록/과잉 공백 제거, 최대 길이 클램프. */
export function cleanAnswerText(raw: string, maxLength = 1200): string {
  const fenceStripped = raw
    .replace(/```(?:markdown|text)?/gi, '')
    .replace(/```/g, '')
    .trim();
  const collapsed = fenceStripped.replace(/\n{3,}/g, '\n\n').trim();
  if (collapsed.length <= maxLength) return collapsed;
  return `${collapsed.slice(0, maxLength - 1)}…`;
}
