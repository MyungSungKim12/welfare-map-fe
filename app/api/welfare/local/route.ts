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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const serviceKey  = process.env.WELFARE_API_KEY!;
  const sidoCd      = searchParams.get('sidoCd')      ?? '28';
  const sidoName    = searchParams.get('sidoName')    ?? '';
  const sigunguName = searchParams.get('sigunguName') ?? '';

  // 공통 파라미터 (모든 페이지 호출에 사용)
  const baseParams: Record<string, string> = {
    serviceKey,
    callTp:    'L',
    numOfRows: '100',
    sidoCd,                          // ← sidoCd 항상 포함
  };

  if (searchParams.get('lifeArray'))   baseParams.lifeArray   = searchParams.get('lifeArray')!;
  if (searchParams.get('srchKeyCode')) baseParams.srchKeyCode = searchParams.get('srchKeyCode')!;

  try {
    // 1페이지 호출
    const p1 = new URLSearchParams({ ...baseParams, pageNo: '1' });
    const res1 = await fetch(`${BASE_URL}?${p1}`, { cache: 'no-store' });
    const text1 = await res1.text();
console.log('[local API raw response]', text1.slice(0, 500));
    // totalCount 파싱
    const totalMatch = text1.match(/<totalCount>(\d+)<\/totalCount>/);
    const totalCount = totalMatch ? parseInt(totalMatch[1]) : 0;
    const totalPages = Math.ceil(totalCount / 100);

    let allItems = parseLocalXml(text1);

    // 2~3페이지 추가 호출 (최대 300건)
    if (totalPages > 1) {
      const extraCount = Math.min(totalPages - 1, 2);
      const extraTexts = await Promise.all(
        Array.from({ length: extraCount }, (_, i) => {
          const p = new URLSearchParams({ ...baseParams, pageNo: String(i + 2) });
          return fetch(`${BASE_URL}?${p}`, { cache: 'no-store' }).then(r => r.text());
        })
      );
      extraTexts.forEach(t => allItems.push(...parseLocalXml(t)));
    }

    // ── 시도/시군구 텍스트 필터링 ──────────────────────────
    const sidoShort = sidoName.slice(0, 2); // '인천', '서울' 등

    let filtered = allItems;

    if (sidoShort) {
      filtered = allItems.filter((item) => {
        const itemSido    = (item.ctpvNm ?? '').trim();
        const itemSigungu = (item.sggNm  ?? '').trim();

        if (itemSido && !itemSido.includes(sidoShort)) return false;

        if (sigunguName && sigunguName !== '전체' && itemSigungu) {
          const sg = sigunguName.replace(/시$|구$|군$/, '').trim();
          if (sg && !itemSigungu.includes(sg)) return false;
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