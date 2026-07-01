import { NextRequest, NextResponse } from 'next/server';
import { WelfareItem } from '@/types/welfare';
import { isCacheableWelfareRequest, isWelfareCacheConfigured, readWelfareCache, writeWelfareCache } from '@/lib/welfare/cache';

const BASE_URL = 'http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfarelist';

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function parseNationalXml(xml: string): WelfareItem[] {
  const items: WelfareItem[] = [];
  const matches = xml.match(/<servList>([\s\S]*?)<\/servList>/g) ?? [];

  matches.forEach((block) => {
    const get = (tag: string) => {
      const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      return match ? decodeHtml(match[1].trim()) : '';
    };

    const id = get('servId');
    if (!id) return;

    const isAlways = get('alwServYn') === 'Y';

    items.push({
      id,
      source: 'national',
      cacheKey: `national:${id}`,
      title: get('servNm'),
      category: get('lifeNmArray') || get('intrsThemaNmArray') || '기타',
      target: get('trgterIndvdlNmArray') || '전체',
      period: isAlways ? '상시 신청' : get('aplyEndDd') || '확인 필요',
      region: '전국',
      ctpvNm: '',
      sggNm: '',
      summary: get('servDgst'),
      link: get('servDtlLink'),
      applyEndDd: get('aplyEndDd'),
      lastModYmd: get('lastModYmd'),
      isAlways,
    });
  });

  return items;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const useCache = isCacheableWelfareRequest(searchParams) && isWelfareCacheConfigured();

  if (useCache) {
    const cachedItems = await readWelfareCache({ source: 'national' });
    if (cachedItems) {
      return NextResponse.json({ success: true, items: cachedItems, cache: 'hit' });
    }
  }

  const serviceKey = process.env.WELFARE_API_KEY;

  if (!serviceKey) {
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }

  const params = new URLSearchParams({
    serviceKey,
    callTp: 'L',
    pageNo: '1',
    numOfRows: searchParams.get('numOfRows') ?? '100',
    lifeArray: searchParams.get('lifeArray') ?? '',
    srchKeyCode: searchParams.get('srchKeyCode') ?? '',
  });

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`, { cache: 'no-store' });
    const text = await response.text();
    const items = parseNationalXml(text);
    if (useCache) await writeWelfareCache(items, 'national');

    return NextResponse.json({ success: true, items, cache: useCache ? 'miss' : 'bypass' });
  } catch (error) {
    console.error('[national API error]', error);
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }
}
