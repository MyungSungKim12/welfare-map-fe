'use client';

import { useState, useCallback } from 'react';
import { SIDO_LIST, SIGUNGU_MAP } from '@/constants/region';

export interface LocationInfo {
  sidoCd:      string;
  sigunguCd:   string;
  sidoName:    string;
  sigunguName: string;
  lat?:        number;  // 추가
  lng?:        number;  // 추가
}

const DEFAULT_LOCATION: LocationInfo = {
  sidoCd:      '28',
  sigunguCd:   '28177',
  sidoName:    '인천광역시',
  sigunguName: '미추홀구',
  lat:         37.4563,  // 추가
  lng:         126.7052, // 추가
};

async function coordsToRegionCode(lat: number, lng: number): Promise<LocationInfo | null> {
  const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`,
      { headers: { Authorization: `KakaoAK ${key}` } }
    );
    const data = await res.json();

    const region = data.documents?.find((d: any) => d.region_type === 'B');
    if (!region) return null;

    const sidoName    = region.region_1depth_name;
    const sigunguName = region.region_2depth_name;

    const sido = SIDO_LIST.find((s) => sidoName.includes(s.name.slice(0, 2)));
    if (!sido) return null;

    const sigunguList = SIGUNGU_MAP[sido.code] ?? [];
    const sigungu = sigunguList.find((s) => sigunguName.includes(s.name.split(' ')[0]));

    return {
      sidoCd:      sido.code,
      sigunguCd:   sigungu?.code ?? sido.code,
      sidoName:    sido.name,
      sigunguName: sigungu?.name ?? sigunguName,
      lat,   // 추가
      lng,   // 추가
    };
  } catch {
    return null;
  }
}

export function useLocation() {
  const [location,   setLocation]   = useState<LocationInfo>(DEFAULT_LOCATION);
  const [isLocating, setIsLocating] = useState(false);

  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      return;
    }

    setIsLocating(true);
    try {
      const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          reject,
          { timeout: 10000 }
        );
      });

      const info = await coordsToRegionCode(coords.latitude, coords.longitude);
      if (info) {
        setLocation(info);
      } else {
        alert('위치를 특정할 수 없습니다. 직접 선택해주세요.');
      }
    } catch {
      alert('위치 권한을 허용해주세요.');
    } finally {
      setIsLocating(false);
    }
  }, []);

  return { location, isLocating, detectLocation, setLocation };
}