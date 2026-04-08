'use client';

import { useState, useCallback, useEffect } from 'react';

export interface LocationInfo {
  sidoCd:      string;
  sigunguCd:   string;
  sidoName:    string;
  sigunguName: string;
  lat?:        number;
  lng?:        number;
}

const DEFAULT_LOCATION: LocationInfo = {
  sidoCd: '28', sigunguCd: '28177',
  sidoName: '인천광역시', sigunguName: '미추홀구',
  lat: 37.4563, lng: 126.7052,
};

const STORAGE_KEY = 'welfare_location';

export function useLocation() {
  const [location,    setLocationState] = useState<LocationInfo>(DEFAULT_LOCATION);
  const [isLocating,  setIsLocating]    = useState(false);
  const [initialized, setInitialized]   = useState(false);

  const setLocation = useCallback((info: LocationInfo) => {
    setLocationState(info);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(info)); } catch {}
  }, []);

  const coordsToRegion = useCallback(async (lat: number, lng: number) => {
    try {
      const res  = await fetch(`/api/kakao/coord2region?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      return data.location ?? null;
    } catch { return null; }
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
          (err) => reject(err),
          { timeout: 10000 }
        );
      });
      const info = await coordsToRegion(coords.latitude, coords.longitude);
      if (info) setLocation(info);
      else alert('행정구역을 찾을 수 없습니다. 위치 모달에서 직접 선택해주세요.');
    } catch {
      alert('위치 권한을 허용해주세요.');
    } finally {
      setIsLocating(false);
    }
  }, [coordsToRegion, setLocation]);

  // 초기화: 항상 GPS 우선 → 실패 시 localStorage 복원
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    const init = async () => {
      if (!navigator.geolocation) {
        // GPS 없으면 localStorage
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) { const p = JSON.parse(saved); if (p?.sidoCd) setLocationState(p); }
        } catch {}
        return;
      }

      setIsLocating(true);
      try {
        const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (err) => reject(err),
            { timeout: 8000 }
          );
        });
        const info = await coordsToRegion(coords.latitude, coords.longitude);
        if (info) {
          setLocationState(info);
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(info)); } catch {}
        } else {
          // 변환 실패 → localStorage 복원
          try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) { const p = JSON.parse(saved); if (p?.sidoCd) setLocationState(p); }
          } catch {}
        }
      } catch {
        // GPS 거부/실패 → localStorage 복원
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) { const p = JSON.parse(saved); if (p?.sidoCd) setLocationState(p); }
        } catch {}
      } finally {
        setIsLocating(false);
      }
    };

    init();
  }, [initialized, coordsToRegion]);

  return { location, isLocating, detectLocation, setLocation };
}