import { NextRequest, NextResponse } from 'next/server';
import {
  FACILITY_QUERIES,
  mergeFacilityResults,
  type KakaoPlaceDocument,
} from '@/utils/facilities';

const MAX_RADIUS = 20000;
const DEFAULT_RADIUS = 3000;
const PAGE_SIZE = 15;

interface KakaoKeywordResponse {
  documents?: KakaoPlaceDocument[];
}

async function fetchPlaces(
  apiKey: string,
  query: string,
  x: string,
  y: string,
  radius: number,
): Promise<KakaoPlaceDocument[]> {
  const params = new URLSearchParams({
    query,
    x,
    y,
    radius: String(radius),
    size: String(PAGE_SIZE),
    sort: 'distance',
  });

  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?${params.toString()}`,
    { headers: { Authorization: `KakaoAK ${apiKey}` }, cache: 'no-store' },
  );

  if (!response.ok) return [];
  const data = (await response.json()) as KakaoKeywordResponse;
  return data.documents ?? [];
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ success: false, items: [], error: 'lat/lng required' }, { status: 400 });
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, items: [], error: 'KAKAO_REST_API_KEY not set' }, { status: 500 });
  }

  const rawRadius = Number(searchParams.get('radius') ?? DEFAULT_RADIUS);
  const radius = Math.min(MAX_RADIUS, Math.max(500, Number.isFinite(rawRadius) ? rawRadius : DEFAULT_RADIUS));

  try {
    const results = await Promise.allSettled(
      FACILITY_QUERIES.map((entry) => fetchPlaces(apiKey, entry.query, lng, lat, radius)),
    );

    const groups = results.map((result, index) => ({
      docs: result.status === 'fulfilled' ? result.value : [],
      label: FACILITY_QUERIES[index].label,
    }));

    const items = mergeFacilityResults(groups);
    return NextResponse.json({ success: true, items, radius });
  } catch (error) {
    console.error('[facilities API error]', error);
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }
}
