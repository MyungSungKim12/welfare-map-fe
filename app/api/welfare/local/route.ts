import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'http://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfarelist';

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
}

function parseLocalXml(xml: string) {
  const items: any[] = [];
  const matches = xml.match(/<servList>([\s\S]*?)<\/servList>/g) ?? [];

  matches.forEach((block) => {
    const get = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      return m ? decodeHtml(m[1].trim()) : '';
    };

    const id = get('servId');
    if (!id) return;

    items.push({
      id,
      title:      get('servNm'),
      category:   get('intrsThemaNmArray') || get('srvPvsnNm') || '기타',
      target:     get('trgterIndvdlNmArray') || '전체',
      period:     get('sprtCycNm') || '확인 필요',
      ctpvNm:     get('ctpvNm'),
      sggNm:      get('sggNm'),
      region:     [get('ctpvNm'), get('sggNm')].filter(Boolean).join(' ') || '지자체',
      summary:    get('servDgst'),
      link:       get('servDtlLink'),
      applyEndDd: get('aplyEndDd'),
      lastModYmd: get('lastModYmd'),
      isAlways:   get('alwServYn') === 'Y',
    });
  });

  return items;
}

async function fetchOnePage(serviceKey: string, pageNo: number, extraParams: Record<string, string>) {
  const params = new URLSearchParams({
    serviceKey,
    callTp:    'L',
    pageNo:    String(pageNo),
    numOfRows: '100',
    ...extraParams,
  });

  const res  = await fetch(`${BASE_URL}?${params}`, { cache: 'no-store' });
  const text = await res.text();

  const totalMatch = text.match(/<totalCount>(\d+)<\/totalCount>/);
  const totalCount = totalMatch ? parseInt(totalMatch[1]) : 0;

  return { items: parseLocalXml(text), totalCount };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const serviceKey  = process.env.WELFARE_API_KEY!;
  const sidoCd      = searchParams.get('sidoCd')    ?? '28';
  const sigunguCd   = searchParams.get('sigunguCd') ?? '';
  const sidoName    = searchParams.get('sidoName')  ?? '';   // 클라이언트 필터용
  const sigunguName = searchParams.get('sigunguName') ?? ''; // 클라이언트 필터용

  const extraParams: Record<string, string> = {};
  if (searchParams.get('lifeArray'))   extraParams.lifeArray   = searchParams.get('lifeArray')!;
  if (searchParams.get('srchKeyCode')) extraParams.srchKeyCode = searchParams.get('srchKeyCode')!;

  try {
    // 1페이지 먼저 가져와서 totalCount 확인
    const first = await fetchOnePage(serviceKey, 1, extraParams);
    const totalCount = first.totalCount;
    const totalPages = Math.ceil(totalCount / 100);

    // 최대 10페이지(1000건)까지 병렬 호출
    const maxPages = Math.min(totalPages, 10);
    let allItems = [...first.items];

    if (maxPages > 1) {
      const pageNums = Array.from({ length: maxPages - 1 }, (_, i) => i + 2);
      const results  = await Promise.allSettled(
        pageNums.map((p) => fetchOnePage(serviceKey, p, extraParams))
      );
      results.forEach((r) => {
        if (r.status === 'fulfilled') allItems.push(...r.value.items);
      });
    }

    // ── 시도/시군구 필터링 (텍스트 기반) ──────────────────
    const sidoShort = sidoName.slice(0, 2); // 예: '인천', '서울'

    let filtered = allItems;

    if (sidoShort) {
      filtered = filtered.filter((item) => {
        const itemSido = (item.ctpvNm ?? '').trim();
        if (!itemSido.includes(sidoShort)) return false;

        // 시군구 필터 ('전체'면 생략)
        if (sigunguName && sigunguName !== '전체') {
          const itemSigungu = (item.sggNm ?? '').trim();
          const sg = sigunguName.replace(/시$|구$|군$/, '').trim();
          if (sg && itemSigungu && !itemSigungu.includes(sg)) return false;
        }

        return true;
      });
    }

    // 중복 제거
    const unique = filtered.filter(
      (item, idx, arr) => arr.findIndex((i) => i.id === item.id) === idx
    );

    return NextResponse.json({ success: true, items: unique, totalCount });
  } catch (e) {
    console.error('[local API error]', e);
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }
}