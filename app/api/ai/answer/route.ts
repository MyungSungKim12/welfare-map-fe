import { NextRequest, NextResponse } from 'next/server';
import { generateAnswer } from '@/lib/ai/answer';
import type { BenefitIntent, NormalizedBenefit } from '@/types/benefit';

interface RequestBody {
  query?: unknown;
  intent?: unknown;
  benefits?: unknown;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as RequestBody;
  const query = typeof body.query === 'string' ? body.query : '';
  const intent = body.intent && typeof body.intent === 'object'
    ? (body.intent as BenefitIntent)
    : undefined;
  const benefits = Array.isArray(body.benefits) ? (body.benefits as NormalizedBenefit[]) : [];

  const result = await generateAnswer(query, intent, benefits);
  return NextResponse.json(result);
}
