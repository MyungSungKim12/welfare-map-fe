import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfarelist';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = new URLSearchParams({
    serviceKey: process.env.WELFARE_API_KEY!,
    callTp:     'L',
    pageNo:     searchParams.get('pageNo')  ?? '1',
    numOfRows:  searchParams.get('numOfRows') ?? '10',
    srchKeyCode: searchParams.get('srchKeyCode') ?? '',
    lifeArray:  searchParams.get('lifeArray') ?? '',
  });

  try {
    const res  = await fetch(`${BASE_URL}?${params}`, { cache: 'no-store' });
    const text = await res.text();

    // XML → JSON 파싱
    const items = parseWelfareXml(text);
    return NextResponse.json({ success: true, items });
  } catch (e) {
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }
}

function parseWelfareXml(xml: string) {
  const items: any[] = [];
  const itemMatches  = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];

  itemMatches.forEach((item) => {
    const get = (tag: string) => {
      const m = item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`));
      return m ? (m[1] ?? m[2] ?? '').trim() : '';
    };

    items.push({
      id:       get('servId'),
      title:    get('servNm'),
      category: get('lifeNmArray') || get('intrsThemaNmArray') || '기타',
      target:   get('tgtrDprtNmArray') || '전체',
      period:   get('alwServYn') === 'Y' ? '연중 상시' : get('aplyEndDd') || '확인 필요',
      region:   '전국',
      summary:  get('servSumry') || get('servDgst') || '',
      link:     `https://www.bokjiro.go.kr/ssis-tbu/twatsa/welfare/twatbWlfareInfo.do?wlfareInfoId=${get('servId')}`,
    });
  });

  return items;
}