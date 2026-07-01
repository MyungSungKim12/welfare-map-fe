export type InteractionType = 'view' | 'click' | 'save';

const DEFAULT_BE_BASE = 'http://localhost:8080';

function backendBaseUrl(env: Record<string, string | undefined> = process.env as Record<string, string | undefined>) {
  return env.NEXT_PUBLIC_BE_BASE_URL ?? DEFAULT_BE_BASE;
}

/**
 * BE popular 집계 카운터를 증분한다. Fire-and-forget:
 * - cacheKey 가 없거나 빈 값이면 조용히 skip.
 * - fetch 실패 시 UX 에 영향 없이 무시.
 */
export async function trackPopularInteraction(
  cacheKey: string | undefined | null,
  type: InteractionType,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  if (!cacheKey || cacheKey.length === 0) return;
  const encoded = encodeURIComponent(cacheKey);
  const url = `${backendBaseUrl()}/api/v1/popular/${encoded}/${type}`;
  try {
    await fetcher(url, { method: 'POST', cache: 'no-store' });
  } catch {
    // tracking 실패는 사용자 흐름을 막지 않음
  }
}
