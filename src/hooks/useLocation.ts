'use client';

import { useState, useCallback, useEffect } from 'react';

export interface LocationInfo {
  sidoCd: string;
  sigunguCd: string;
  sidoName: string;
  sigunguName: string;
  lat?: number;
  lng?: number;
}

const DEFAULT_LOCATION: LocationInfo = {
  sidoCd: '28',
  sigunguCd: '28177',
  sidoName: '인천광역시',
  sigunguName: '미추홀구',
  lat: 37.4563,
  lng: 126.7052,
};

const MANUAL_KEY = 'welfare_location_manual';

export function useLocation() {
  const [location, setLocationState] = useState<LocationInfo>(DEFAULT_LOCATION);
  const [isLocating, setIsLocating] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const setLocation = useCallback((info: LocationInfo) => {
    setLocationState(info);
    try {
      localStorage.setItem(MANUAL_KEY, JSON.stringify(info));
    } catch {}
  }, []);

  const coordsToRegion = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/kakao/coord2region?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      return data.location ?? null;
    } catch {
      return null;
    }
  }, []);

  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert('이 브라우저에서는 위치 서비스를 사용할 수 없습니다.');
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
        try {
          localStorage.removeItem(MANUAL_KEY);
        } catch {}
      } else {
        alert('현재 위치의 행정구역을 찾지 못했습니다. 위치 선택에서 직접 설정해주세요.');
      }
    } catch {
      alert('위치 권한을 허용하면 현재 위치 기준으로 복지를 찾을 수 있습니다.');
    } finally {
      setIsLocating(false);
    }
  }, [coordsToRegion]);

  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    const init = async () => {
      if (!navigator.geolocation) {
        try {
          const saved = localStorage.getItem(MANUAL_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.sidoCd) setLocationState(parsed);
          }
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
          return;
        }
      } catch {}

      try {
        const saved = localStorage.getItem(MANUAL_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.sidoCd) setLocationState(parsed);
        }
      } catch {}

      setIsLocating(false);
    };

    init().finally(() => setIsLocating(false));
  }, [initialized, coordsToRegion]);

  return { location, isLocating, detectLocation, setLocation };
}
