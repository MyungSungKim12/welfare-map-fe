import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfarelist';

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = new URLSearchParams({
    serviceKey:  process.env.WELFARE_API_KEY!,
    callTp:      'L',
    pageNo:      '1',
    numOfRows:   '100',
    lifeArray:   searchParams.get('lifeArray')   ?? '',
    srchKeyCode: searchParams.get('srchKeyCode') ?? '',
  });

  try {
    const res  = await fetch(`${BASE_URL}?${params}`, { cache: 'no-store' });
    const text = await res.text();
    const items = parseNationalXml(text);
    return NextResponse.json({ success: true, items });
  } catch (e) {
    console.error('[national API error]', e);
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }
}

function parseNationalXml(xml: string) {
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
      category:   get('lifeNmArray') || get('intrsThemaNmArray') || '기타',
      target:     get('trgterIndvdlNmArray') || '전체',
      period:     get('alwServYn') === 'Y' ? '연중 상시' : get('aplyEndDd') || '확인 필요',
      region:     '전국',
      ctpvNm:     '',
      sggNm:      '',
      summary:    get('servDgst'),
      link:       get('servDtlLink'),
      applyEndDd: get('aplyEndDd'),
      lastModYmd: get('lastModYmd'),
      isAlways:   get('alwServYn') === 'Y',
    });
  });

  return items;
}