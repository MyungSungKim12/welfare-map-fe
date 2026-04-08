import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) return NextResponse.json({ location: null }, { status: 400 });

  const key = process.env.KAKAO_REST_API_KEY!;

  try {
    const res  = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`,
      { headers: { Authorization: `KakaoAK ${key}` } }
    );
    const data = await res.json();

    const region =
      data.documents?.find((d: any) => d.region_type === 'H') ??
      data.documents?.find((d: any) => d.region_type === 'B');

    if (!region) return NextResponse.json({ location: null });

    const sidoName    = region.region_1depth_name;
    const sigunguName = region.region_2depth_name;

    const SIDO_CODE_MAP: Record<string, string> = {
      '서울': '11', '부산': '26', '대구': '27', '인천': '28',
      '광주': '29', '대전': '30', '울산': '31', '세종': '36',
      '경기': '41', '강원': '42', '충북': '43', '충청북': '43',
      '충남': '44', '충청남': '44', '전북': '45', '전라북': '45',
      '전남': '46', '전라남': '46', '경북': '47', '경상북': '47',
      '경남': '48', '경상남': '48', '제주': '50',
    };

    const SIDO_NAME_MAP: Record<string, string> = {
      '11': '서울특별시', '26': '부산광역시', '27': '대구광역시',
      '28': '인천광역시', '29': '광주광역시', '30': '대전광역시',
      '31': '울산광역시', '36': '세종특별자치시', '41': '경기도',
      '42': '강원특별자치도', '43': '충청북도', '44': '충청남도',
      '45': '전라북도', '46': '전라남도', '47': '경상북도',
      '48': '경상남도', '50': '제주특별자치도',
    };

    const sidoKey = Object.keys(SIDO_CODE_MAP).find((k) => sidoName.startsWith(k));
    const sidoCd  = sidoKey ? SIDO_CODE_MAP[sidoKey] : '28';

    return NextResponse.json({
      location: {
        sidoCd,
        sigunguCd:   sidoCd,
        sidoName:    SIDO_NAME_MAP[sidoCd] ?? sidoName,
        sigunguName: sigunguName,
        lat:         parseFloat(lat),
        lng:         parseFloat(lng),
      }
    });
  } catch (e) {
    console.error('[coord2region]', e);
    return NextResponse.json({ location: null }, { status: 500 });
  }
}