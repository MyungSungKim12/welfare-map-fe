import { NextRequest, NextResponse } from 'next/server';

interface KakaoKeywordDocument {
  x: string;
  y: string;
}

interface KakaoKeywordResponse {
  documents?: KakaoKeywordDocument[];
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query');
  if (!query) return NextResponse.json({ lat: null, lng: null });

  const key = process.env.KAKAO_REST_API_KEY;
  if (!key) return NextResponse.json({ lat: null, lng: null }, { status: 500 });

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=1`,
      { headers: { Authorization: `KakaoAK ${key}` } },
    );
    const data = (await response.json()) as KakaoKeywordResponse;
    const document = data.documents?.[0];

    if (!document) return NextResponse.json({ lat: null, lng: null });

    return NextResponse.json({
      lat: parseFloat(document.y),
      lng: parseFloat(document.x),
    });
  } catch {
    return NextResponse.json({ lat: null, lng: null }, { status: 500 });
  }
}
