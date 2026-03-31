import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'http://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfarelist';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = new URLSearchParams({
    serviceKey: process.env.WELFARE_API_KEY!,
    callTp:     'L',
    pageNo:     searchParams.get('pageNo')    ?? '1',
    numOfRows:  searchParams.get('numOfRows') ?? '10',
    sidoCd:     searchParams.get('sidoCd')    ?? '28',
    sigunguCd:  searchParams.get('sigunguCd') ?? '28177',
  });

  try {
    const res   = await fetch(`${BASE_URL}?${params}`, { cache: 'no-store' });
    const text  = await res.text();
    const items = parseLocalXml(text);
    return NextResponse.json({ success: true, items });
  } catch (e) {
    console.error('[local API error]', e);
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }
}

function parseLocalXml(xml: string) {
  const items: any[] = [];
  // <servList> 태그 기준으로 파싱
  const matches = xml.match(/<servList>([\s\S]*?)<\/servList>/g) ?? [];

  matches.forEach((block) => {
    const get = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].trim() : '';
    };

    const id = get('servId');
    if (!id) return;

    items.push({
      id,
      title:    get('servNm'),
      category: get('intrsThemaNmArray') || get('srvPvsnNm') || '기타',
      target:   get('trgterIndvdlNmArray') || '전체',
      period:   get('sprtCycNm') || '확인 필요',
      region:   [get('ctpvNm'), get('sggNm')].filter(Boolean).join(' ') || '지자체',
      summary:  get('servDgst'),
      link:     get('servDtlLink'),
    });
  });

  return items;
}