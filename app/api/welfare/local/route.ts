import { NextRequest, NextResponse } from 'next/server';
import { WelfareItem } from '@/types/welfare';
import { isCacheableWelfareRequest, isWelfareCacheConfigured, readWelfareCache, writeWelfareCache } from '@/lib/welfare/cache';

const BASE_URL = 'http://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfarelist';

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function parseLocalXml(xml: string): WelfareItem[] {
  const items: WelfareItem[] = [];
  const matches = xml.match(/<servList>([\s\S]*?)<\/servList>/g) ?? [];

  matches.forEach((block) => {
    const get = (tag: string) => {
      const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      return match ? decodeHtml(match[1].trim()) : '';
    };

    const id = get('servId');
    if (!id) return;

    const ctpvNm = get('ctpvNm');
    const sggNm = get('sggNm');

    items.push({
      id,
      title: get('servNm'),
      category: get('intrsThemaNmArray') || get('srvPvsnNm') || '기타',
      target: get('trgterIndvdlNmArray') || '전체',
      period: get('sprtCycNm') || '확인 필요',
      ctpvNm,
      sggNm,
      region: [ctpvNm, sggNm].filter(Boolean).join(' ') || '지자체',
      summary: get('servDgst'),
      link: get('servDtlLink'),
      applyEndDd: get('aplyEndDd'),
      lastModYmd: get('lastModYmd'),
      isAlways: get('alwServYn') === 'Y',
    });
  });

  return items;
}

function uniqueById(items: WelfareItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const sidoCd = searchParams.get('sidoCd') ?? '28';
  const sidoName = searchParams.get('sidoName') ?? '';
  const sigunguName = searchParams.get('sigunguName') ?? '';
  const useCache = isCacheableWelfareRequest(searchParams) && isWelfareCacheConfigured();

  if (useCache) {
    const cachedItems = await readWelfareCache({ source: 'local', sidoName, sigunguName });
    if (cachedItems) {
      return NextResponse.json({ success: true, items: cachedItems, totalCount: cachedItems.length, cache: 'hit' });
    }
  }

  const serviceKey = process.env.WELFARE_API_KEY;

  if (!serviceKey) {
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }

  const baseParams: Record<string, string> = {
    serviceKey,
    callTp: 'L',
    numOfRows: '100',
    sidoCd,
  };

  const lifeArray = searchParams.get('lifeArray');
  const srchKeyCode = searchParams.get('srchKeyCode');
  if (lifeArray) baseParams.lifeArray = lifeArray;
  if (srchKeyCode) baseParams.srchKeyCode = srchKeyCode;

  try {
    const firstParams = new URLSearchParams({ ...baseParams, pageNo: '1' });
    const firstResponse = await fetch(`${BASE_URL}?${firstParams.toString()}`, { cache: 'no-store' });
    const firstText = await firstResponse.text();

    const totalMatch = firstText.match(/<totalCount>(\d+)<\/totalCount>/);
    const totalCount = totalMatch ? parseInt(totalMatch[1], 10) : 0;
    const totalPages = Math.ceil(totalCount / 100);
    const allItems = parseLocalXml(firstText);

    if (totalPages > 1) {
      const extraCount = Math.min(totalPages - 1, 2);
      const extraTexts = await Promise.all(
        Array.from({ length: extraCount }, (_, index) => {
          const params = new URLSearchParams({ ...baseParams, pageNo: String(index + 2) });
          return fetch(`${BASE_URL}?${params.toString()}`, { cache: 'no-store' }).then((response) => response.text());
        }),
      );
      extraTexts.forEach((text) => allItems.push(...parseLocalXml(text)));
    }

    const sidoShortName = sidoName.slice(0, 2);
    let filtered = allItems;

    if (sidoShortName) {
      filtered = allItems.filter((item) => {
        const itemSido = (item.ctpvNm ?? '').trim();
        const itemSigungu = (item.sggNm ?? '').trim();

        if (itemSido && !itemSido.includes(sidoShortName)) return false;

        if (sigunguName && itemSigungu) {
          const normalizedSigungu = sigunguName.replace(/시$|구$|군$/, '').trim();
          if (normalizedSigungu && !itemSigungu.includes(normalizedSigungu)) return false;
        }

        return true;
      });
    }

    const unique = uniqueById(filtered);
    if (useCache) await writeWelfareCache(unique, 'local');

    return NextResponse.json({ success: true, items: unique, totalCount, cache: useCache ? 'miss' : 'bypass' });
  } catch (error) {
    console.error('[local API error]', error);
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }
}
