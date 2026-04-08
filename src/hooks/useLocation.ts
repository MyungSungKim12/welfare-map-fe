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

// 기본값 (GPS 실패 시 fallback)
const DEFAULT_LOCATION: LocationInfo = {
  sidoCd:      '28',
  sigunguCd:   '28177',
  sidoName:    '인천광역시',
  sigunguName: '미추홀구',
  lat:         37.4563,
  lng:         126.7052,
};

const STORAGE_KEY = 'welfare_location';

export function useLocation() {
  const [location,   setLocationState] = useState<LocationInfo>(DEFAULT_LOCATION);
  const [isLocating, setIsLocating]    = useState(false);
  const [initialized, setInitialized]  = useState(false);

  const setLocation = useCallback((info: LocationInfo) => {
    setLocationState(info);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(info)); } catch {}
  }, []);

  // 좌표 → 행정구역 변환 (서버 API 경유)
  const coordsToRegion = useCallback(async (lat: number, lng: number): Promise<LocationInfo | null> => {
    try {
      const res  = await fetch(`/api/kakao/coord2region?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      return data.location ?? null;
    } catch {
      return null;
    }
  }, []);

  // GPS 위치 감지
  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      return;
    }
    setIsLocating(true);
    try {
      const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      const info = await coordsToRegion(coords.latitude, coords.longitude);
      if (info) setLocation(info);
      else alert('위치를 특정할 수 없습니다. 직접 선택해주세요.');
    } catch {
      alert('위치 권한을 허용해주세요.');
    } finally {
      setIsLocating(false);
    }
  }, [coordsToRegion, setLocation]);

  // 앱 최초 로드 시: localStorage → GPS 자동 감지 순으로 시도
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    const initLocation = async () => {
      // 1. localStorage에 저장된 위치가 있으면 복원
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.sidoCd) {
            setLocationState(parsed);
            return; // 저장된 위치 있으면 GPS 감지 안 함
          }
        }
      } catch {}

      // 2. 저장된 위치 없으면 GPS 자동 감지 시도
      if (!navigator.geolocation) return;
      setIsLocating(true);
      try {
        const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
        });
        const info = await coordsToRegion(coords.latitude, coords.longitude);
        if (info) setLocationState(info);
      } catch {
        // GPS 실패 시 기본값(인천 미추홀구) 유지
      } finally {
        setIsLocating(false);
      }
    };

    initLocation();
  }, [initialized, coordsToRegion]);

  return { location, isLocating, detectLocation, setLocation };
}