import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'http://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfarelist';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const sidoCd    = searchParams.get('sidoCd')    ?? '28';
  const sigunguCd = searchParams.get('sigunguCd') ?? '';

  const params = new URLSearchParams({
    serviceKey: process.env.WELFARE_API_KEY!,
    callTp:     'L',
    pageNo:     searchParams.get('pageNo')      ?? '1',
    numOfRows:  searchParams.get('numOfRows')   ?? '50',
    sidoCd,
    // sigunguCd가 sidoCd와 같으면 시도 전체 조회 (군/구 없음)
    ...(sigunguCd && sigunguCd !== sidoCd && { sigunguCd }),
    ...(searchParams.get('lifeArray')   && { lifeArray:   searchParams.get('lifeArray')! }),
    ...(searchParams.get('srchKeyCode') && { srchKeyCode: searchParams.get('srchKeyCode')! }),
  });

  try {
    const res  = await fetch(`${BASE_URL}?${params}`, { cache: 'no-store' });
    const text = await res.text();
    const items = parseLocalXml(text);
    return NextResponse.json({ success: true, items });
  } catch (e) {
    console.error('[local API error]', e);
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }
}

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