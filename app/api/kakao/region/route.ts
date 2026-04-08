import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const x = searchParams.get('x');
  const y = searchParams.get('y');

  if (!x || !y) {
    return NextResponse.json({ error: '좌표가 필요합니다.' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${x}&y=${y}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
        cache: 'no-store',
      }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: '카카오 API 오류' }, { status: 500 });
  }
}