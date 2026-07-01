export interface PopularServiceItem {
  cacheKey: string;
  viewCount: number;
  clickCount: number;
  saveCount: number;
  score: number;
  updatedAt: string;
  title: string | null;
  summary: string | null;
  link: string | null;
  region: string | null;
  target: string | null;
  category: string | null;
}

interface RawPopularItem {
  cacheKey?: unknown;
  viewCount?: unknown;
  clickCount?: unknown;
  saveCount?: unknown;
  score?: unknown;
  updatedAt?: unknown;
  title?: unknown;
  summary?: unknown;
  link?: unknown;
  region?: unknown;
  target?: unknown;
  category?: unknown;
}

const DEFAULT_BE_BASE = 'http://localhost:8080';

function backendBaseUrl(env: Record<string, string | undefined> = process.env as Record<string, string | undefined>) {
  return env.NEXT_PUBLIC_BE_BASE_URL ?? DEFAULT_BE_BASE;
}

function toOptionalString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function toFiniteNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

export function normalizePopularItems(raw: unknown): PopularServiceItem[] {
  if (!Array.isArray(raw)) return [];

  const normalized: PopularServiceItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;
    const r = entry as RawPopularItem;
    if (typeof r.cacheKey !== 'string' || r.cacheKey.length === 0) continue;

    normalized.push({
      cacheKey: r.cacheKey,
      viewCount: toFiniteNumber(r.viewCount),
      clickCount: toFiniteNumber(r.clickCount),
      saveCount: toFiniteNumber(r.saveCount),
      score: toFiniteNumber(r.score),
      updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : '',
      title: toOptionalString(r.title),
      summary: toOptionalString(r.summary),
      link: toOptionalString(r.link),
      region: toOptionalString(r.region),
      target: toOptionalString(r.target),
      category: toOptionalString(r.category),
    });
  }
  return normalized;
}

export async function fetchPopularServices(
  limit = 10,
  fetcher: typeof fetch = fetch,
): Promise<PopularServiceItem[]> {
  const url = `${backendBaseUrl()}/api/v1/popular/top?limit=${limit}`;
  try {
    const response = await fetcher(url, { cache: 'no-store' });
    if (!response.ok) return [];
    const data = (await response.json()) as unknown;
    return normalizePopularItems(data);
  } catch {
    return [];
  }
}
