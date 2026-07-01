import type { WelfareItem } from '@/types/welfare';
import type { SupabaseClient } from '@supabase/supabase-js';

export type WelfareCacheSource = 'local' | 'national';

export interface WelfareCacheRow {
  cache_key: string;
  service_id: string;
  source: WelfareCacheSource;
  serv_id?: string;
  serv_nm?: string;
  serv_dgst?: string;
  sido_nm?: string | null;
  sigungu_nm?: string | null;
  region_type?: string;
  detail_link?: string;
  title: string;
  category: string;
  target: string;
  period: string;
  region: string;
  ctpv_nm: string | null;
  sgg_nm: string | null;
  summary: string;
  link: string;
  apply_end_dd: string | null;
  last_mod_ymd: string | null;
  is_always: boolean;
  raw_data: Record<string, unknown>;
  cached_at?: string;
  expires_at?: string;
  fetched_at?: string;
  updated_at?: string;
}

interface CacheReadOptions {
  source: WelfareCacheSource;
  sidoName?: string;
  sigunguName?: string;
}

const DEFAULT_CACHE_TTL_MINUTES = 360;

export function isCacheableWelfareRequest(searchParams: URLSearchParams) {
  return !searchParams.get('lifeArray') && !searchParams.get('srchKeyCode');
}

export function isWelfareCacheConfigured(env: NodeJS.ProcessEnv = process.env) {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

export function toWelfareCacheRow(item: WelfareItem, source: WelfareCacheSource): WelfareCacheRow {
  const cacheKey = `${source}:${item.id}`;
  return {
    cache_key: cacheKey,
    service_id: item.id,
    source,
    serv_id: item.id,
    serv_nm: item.title,
    serv_dgst: item.summary,
    sido_nm: item.ctpvNm ?? null,
    sigungu_nm: item.sggNm ?? null,
    region_type: source,
    detail_link: item.link,
    title: item.title,
    category: item.category,
    target: item.target,
    period: item.period,
    region: item.region,
    ctpv_nm: item.ctpvNm ?? null,
    sgg_nm: item.sggNm ?? null,
    summary: item.summary,
    link: item.link,
    apply_end_dd: item.applyEndDd || null,
    last_mod_ymd: item.lastModYmd || null,
    is_always: item.isAlways ?? false,
    raw_data: {
      ...item,
      source,
      cacheKey,
    } as unknown as Record<string, unknown>,
  };
}

export function fromWelfareCacheRow(row: WelfareCacheRow): WelfareItem {
  return {
    id: row.service_id,
    source: row.source,
    cacheKey: row.cache_key,
    title: row.title,
    category: row.category,
    target: row.target,
    period: row.period,
    region: row.region,
    ctpvNm: row.ctpv_nm ?? undefined,
    sggNm: row.sgg_nm ?? undefined,
    summary: row.summary,
    link: row.link,
    applyEndDd: row.apply_end_dd ?? undefined,
    lastModYmd: row.last_mod_ymd ?? undefined,
    isAlways: row.is_always,
  };
}

function getCacheTtlMs() {
  const minutes = Number(process.env.WELFARE_CACHE_TTL_MINUTES ?? DEFAULT_CACHE_TTL_MINUTES);
  return Number.isFinite(minutes) && minutes > 0 ? minutes * 60 * 1000 : DEFAULT_CACHE_TTL_MINUTES * 60 * 1000;
}

function matchesLocalRegion(row: WelfareCacheRow, sidoName?: string, sigunguName?: string) {
  const sidoShort = sidoName?.slice(0, 2);
  if (sidoShort && row.ctpv_nm && !row.ctpv_nm.includes(sidoShort)) return false;
  if (sigunguName && sigunguName !== '전체' && row.sgg_nm) {
    const normalized = sigunguName.replace(/시$|구$|군$/, '').trim();
    if (normalized && !row.sgg_nm.includes(normalized)) return false;
  }
  return true;
}

async function getClient() {
  const { getSupabaseAdminClient } = await import('@/lib/supabase/server');
  return getSupabaseAdminClient();
}

export async function readWelfareCache(options: CacheReadOptions): Promise<WelfareItem[] | null> {
  const client = await getClient();
  if (!client) return null;

  const staleBefore = new Date(Date.now() - getCacheTtlMs()).toISOString();
  const { data, error } = await (client as SupabaseClient)
    .from('welfare_services')
    .select('*')
    .eq('source', options.source)
    .gte('fetched_at', staleBefore)
    .limit(500);

  if (error || !data || data.length === 0) return null;

  const rows = data as WelfareCacheRow[];
  const filtered = options.source === 'local'
    ? rows.filter((row) => matchesLocalRegion(row, options.sidoName, options.sigunguName))
    : rows;

  return filtered.map(fromWelfareCacheRow);
}

export async function writeWelfareCache(items: WelfareItem[], source: WelfareCacheSource) {
  const client = await getClient();
  if (!client || items.length === 0) return;

  const now = new Date().toISOString();
  const rows = items.map((item) => ({
    ...toWelfareCacheRow(item, source),
    fetched_at: now,
  }));

  const chunkSize = 100;
  for (let index = 0; index < rows.length; index += chunkSize) {
    const chunk = rows.slice(index, index + chunkSize);
    const { error } = await (client as SupabaseClient)
      .from('welfare_services')
      .upsert(chunk, { onConflict: 'cache_key' });

    if (error) {
      console.error('[welfare cache upsert error]', error.message);
      return;
    }
  }
}
