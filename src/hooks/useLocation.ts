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

// 수동 설정만 저장 (GPS 성공 시 저장 안 함)
const MANUAL_KEY = 'welfare_location_manual';

export function useLocation() {
  const [location,    setLocationState] = useState<LocationInfo>(DEFAULT_LOCATION);
  const [isLocating,  setIsLocating]    = useState(false);
  const [initialized, setInitialized]   = useState(false);

  // 수동 위치 설정 → localStorage 저장
  const setLocation = useCallback((info: LocationInfo) => {
    setLocationState(info);
    try { localStorage.setItem(MANUAL_KEY, JSON.stringify(info)); } catch {}
  }, []);

  const coordsToRegion = useCallback(async (lat: number, lng: number) => {
    try {
      const res  = await fetch(`/api/kakao/coord2region?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      return data.location ?? null;
    } catch { return null; }
  }, []);

  // Navbar 클릭 → GPS 재감지 (수동 설정 기록 삭제)
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
      if (info) {
        setLocationState(info);
        try { localStorage.removeItem(MANUAL_KEY); } catch {} // 수동 기록 삭제
      } else {
        alert('행정구역을 찾을 수 없습니다. 위치 모달에서 직접 선택해주세요.');
      }
    } catch {
      alert('위치 권한을 허용해주세요.');
    } finally {
      setIsLocating(false);
    }
  }, [coordsToRegion]);

  // 초기화:
  // GPS 성공 → GPS 위치 (localStorage 무시)
  // GPS 실패 → 수동 설정 localStorage 복원
  // 둘 다 없으면 → 기본값
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    const init = async () => {
      if (!navigator.geolocation) {
        try {
          const s = localStorage.getItem(MANUAL_KEY);
          if (s) { const p = JSON.parse(s); if (p?.sidoCd) setLocationState(p); }
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
          setLocationState(info); // GPS 성공 → GPS 위치, localStorage 저장 X
        } else {
          try {
            const s = localStorage.getItem(MANUAL_KEY);
            if (s) { const p = JSON.parse(s); if (p?.sidoCd) setLocationState(p); }
          } catch {}
        }
      } catch {
        try {
          const s = localStorage.getItem(MANUAL_KEY);
          if (s) { const p = JSON.parse(s); if (p?.sidoCd) setLocationState(p); }
        } catch {}
      } finally {
        setIsLocating(false);
      }
    };

    init();
  }, [initialized, coordsToRegion]);

  return { location, isLocating, detectLocation, setLocation };
}