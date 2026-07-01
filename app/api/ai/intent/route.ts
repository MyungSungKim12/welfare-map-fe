import { NextRequest, NextResponse } from 'next/server';
import { resolveIntent } from '@/lib/ai/resolver';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const query = typeof body?.query === 'string' ? body.query : '';
  const profile = body?.profile && typeof body.profile === 'object'
    ? (body.profile as Record<string, unknown>)
    : undefined;

  const intent = await resolveIntent(query, profile);
  return NextResponse.json({ intent });
}
