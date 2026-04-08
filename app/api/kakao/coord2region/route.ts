import { NextRequest, NextResponse } from 'next/server';
import { SIDO_LIST, SIGUNGU_MAP } from '@/constants/region';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ location: null }, { status: 400 });
  }

  // ← REST API 키 사용 (JavaScript 키 아님!)
  const key = process.env.KAKAO_REST_API_KEY!;

  try {
    const res  = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`,
      { headers: { Authorization: `KakaoAK ${key}` } }
    );
    const data = await res.json();

    const region = data.documents?.find((d: any) => d.region_type === 'B');
    if (!region) return NextResponse.json({ location: null });

    const sidoName    = region.region_1depth_name;
    const sigunguName = region.region_2depth_name;

    const sido = SIDO_LIST.find((s) => sidoName.includes(s.name.slice(0, 2)));
    if (!sido) return NextResponse.json({ location: null });

    const sigunguList = SIGUNGU_MAP[sido.code] ?? [];
    const sigungu     = sigunguList.find((s) => sigunguName.includes(s.name.split(' ')[0]));

    return NextResponse.json({
      location: {
        sidoCd:      sido.code,
        sigunguCd:   sigungu?.code ?? sido.code,
        sidoName:    sido.name,
        sigunguName: sigungu?.name ?? sigunguName,
        lat:         parseFloat(lat),
        lng:         parseFloat(lng),
      }
    });
  } catch (e) {
    console.error('[coord2region error]', e);
    return NextResponse.json({ location: null }, { status: 500 });
  }
}