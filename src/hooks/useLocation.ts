'use client';

import { useState, useCallback, useEffect } from 'react';
import { SIDO_LIST, SIGUNGU_MAP } from '@/constants/region';

export interface LocationInfo {
  sidoCd:      string;
  sigunguCd:   string;
  sidoName:    string;
  sigunguName: string;
  lat?:        number;
  lng?:        number;
}

const DEFAULT_LOCATION: LocationInfo = {
  sidoCd:      '28',
  sigunguCd:   '28177',
  sidoName:    '인천광역시',
  sigunguName: '미추홀구',
  lat:         37.4563,
  lng:         126.7052,
};

const STORAGE_KEY = 'welfare_location';

async function coordsToRegionCode(lat: number, lng: number): Promise<LocationInfo | null> {
  const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `/api/kakao/coord2region?lat=${lat}&lng=${lng}`
    );
    const data = await res.json();
    return data.location ?? null;
  } catch {
    return null;
  }
}

export function useLocation() {
  const [location,   setLocationState] = useState<LocationInfo>(DEFAULT_LOCATION);
  const [isLocating, setIsLocating]    = useState(false);

  // localStorage 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sidoCd) setLocationState(parsed);
      }
    } catch {}
  }, []);

  const setLocation = useCallback((info: LocationInfo) => {
    setLocationState(info);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    } catch {}
  }, []);

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
  }, [setLocation]);

  return { location, isLocating, detectLocation, setLocation };
}