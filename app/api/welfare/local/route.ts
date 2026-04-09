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

  const params = new URLSearchParams({
    serviceKey,
    callTp:    'L',
    pageNo:    '1',
    numOfRows: '100',
    sidoCd,                             // ← 시도 코드 전달 (API 서버 필터링)
    ...(searchParams.get('lifeArray')   && { lifeArray:   searchParams.get('lifeArray')! }),
    ...(searchParams.get('srchKeyCode') && { srchKeyCode: searchParams.get('srchKeyCode')! }),
  });

  try {
    const res  = await fetch(`${BASE_URL}?${params}`, { cache: 'no-store' });
    const text = await res.text();

    // totalCount 확인
    const totalMatch = text.match(/<totalCount>(\d+)<\/totalCount>/);
    const totalCount = totalMatch ? parseInt(totalMatch[1]) : 0;

    let allItems = parseLocalXml(text);

    // 100건 이상이면 2~3페이지 추가 호출 (최대 300건)
    if (totalCount > 100) {
      const extraPages = Math.min(Math.ceil(totalCount / 100), 3);
      const pagePromises = Array.from({ length: extraPages - 1 }, (_, i) => {
        const p = new URLSearchParams(params);
        p.set('pageNo', String(i + 2));
        return fetch(`${BASE_URL}?${p}`, { cache: 'no-store' }).then(r => r.text());
      });

      const extraTexts = await Promise.all(pagePromises);
      extraTexts.forEach(t => allItems.push(...parseLocalXml(t)));
    }

    // ── 클라이언트 텍스트 기반 시도/시군구 필터링 ──────────
    const sidoShort = sidoName.slice(0, 2); // '인천', '서울' 등

    let filtered = allItems;

    if (sidoShort) {
      filtered = allItems.filter((item) => {
        const itemSido    = (item.ctpvNm ?? '').trim();
        const itemSigungu = (item.sggNm  ?? '').trim();

        // 시도 매칭
        if (itemSido && !itemSido.includes(sidoShort)) return false;

        // 시군구 매칭 ('전체' 또는 비어있으면 생략)
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