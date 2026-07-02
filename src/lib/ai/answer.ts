import 'server-only';
import {
  buildAnswerPrompt,
  cleanAnswerText,
  pickAnswerBenefits,
  type AnswerBenefit,
} from '@/lib/ai/answerParser';
import type { BenefitIntent, NormalizedBenefit } from '@/types/benefit';

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
}

async function callGeminiAnswer(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
  const url = `${GEMINI_ENDPOINT}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 800,
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
      console.error('[gemini answer] status', response.status);
      return null;
    }
    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
    return text.trim() || null;
  } catch (error) {
    console.error('[gemini answer] error', error);
    return null;
  }
}

export interface GenerateAnswerResult {
  answer: string;
  source: 'ai' | 'fallback';
  usedBenefits: AnswerBenefit[];
}

/**
 * Gemini 로 대화형 답변 생성. 실패 시 규칙 기반 fallback 문구.
 */
export async function generateAnswer(
  query: string,
  intent: BenefitIntent | undefined,
  benefits: NormalizedBenefit[],
): Promise<GenerateAnswerResult> {
  const usedBenefits = pickAnswerBenefits(benefits, 8);
  const prompt = buildAnswerPrompt(query, intent, usedBenefits);

  const raw = await callGeminiAnswer(prompt);
  if (raw) {
    return {
      answer: cleanAnswerText(raw),
      source: 'ai',
      usedBenefits,
    };
  }

  const fallback = usedBenefits.length === 0
    ? `"${query}" 에 딱 맞는 후보를 아직 찾지 못했습니다. 질문을 조금 더 구체적으로 바꾸시거나 지역·연령 조건을 추가해서 다시 검색해 보세요.`
    : `요청하신 조건과 관련해 ${usedBenefits.length}개의 후보를 찾았습니다. 아래 카드에서 대상·지역·신청 기간을 확인하고 신청 조건이 맞는 항목을 우선 검토해보세요.`;

  return { answer: fallback, source: 'fallback', usedBenefits };
}
