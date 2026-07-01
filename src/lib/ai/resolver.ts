import 'server-only';
import { buildIntentPrompt, fallbackIntent, parseGeminiIntent } from '@/lib/ai/intent';
import type { BenefitIntent } from '@/types/benefit';

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    keywords: { type: 'array', items: { type: 'string' } },
    lifeStage: { type: 'string' },
    interests: { type: 'array', items: { type: 'string' } },
    region: {
      type: 'object',
      properties: {
        sido: { type: 'string' },
        sigungu: { type: 'string' },
      },
    },
    urgency: { type: 'string' },
  },
};

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
}

async function callGemini(query: string, profile?: Record<string, unknown>): Promise<unknown | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
  const url = `${GEMINI_ENDPOINT}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    contents: [{ parts: [{ text: buildIntentPrompt(query, profile) }] }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
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
      console.error('[gemini intent] status', response.status);
      return null;
    }

    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    return JSON.parse(text) as unknown;
  } catch (error) {
    console.error('[gemini intent] error', error);
    return null;
  }
}

/** Gemini 로 intent 파싱 시도 → 실패 시 규칙 기반 fallback. 항상 BenefitIntent 반환. */
export async function resolveIntent(query: string, profile?: Record<string, unknown>): Promise<BenefitIntent> {
  const trimmed = (query ?? '').trim();
  if (trimmed.length === 0) return fallbackIntent('');
  const geminiPayload = await callGemini(trimmed, profile);
  return geminiPayload ? parseGeminiIntent(trimmed, geminiPayload) : fallbackIntent(trimmed);
}
