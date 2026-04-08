import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query');
  if (!query) return NextResponse.json({ lat: null, lng: null });

  const key = process.env.KAKAO_REST_API_KEY!;

  try {
    const res  = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=1`,
      { headers: { Authorization: `KakaoAK ${key}` } }
    );
    const data = await res.json();
    const doc  = data.documents?.[0];

    if (!doc) return NextResponse.json({ lat: null, lng: null });

    return NextResponse.json({
      lat: parseFloat(doc.y),
      lng: parseFloat(doc.x),
    });
  } catch (e) {
    return NextResponse.json({ lat: null, lng: null }, { status: 500 });
  }
}