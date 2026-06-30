'use client';

import { useEffect, useState } from 'react';
import type { Facility } from '@/types/welfare';

interface FacilityResponse {
  items?: Facility[];
}

export interface UseNearbyFacilitiesReturn {
  facilities: Facility[];
  isLoading: boolean;
  error: string | null;
}

export function useNearbyFacilities(lat?: number, lng?: number, radius = 3000): UseNearbyFacilitiesReturn {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof lat !== 'number' || typeof lng !== 'number') return;

    const controller = new AbortController();
    let cancelled = false;

    const params = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      radius: String(radius),
    });

    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/kakao/facilities?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`facilities ${res.status}`);
        const data = (await res.json()) as FacilityResponse;
        if (cancelled) return;
        setFacilities(data.items ?? []);
      } catch (err) {
        if (cancelled || (err as Error).name === 'AbortError') return;
        setError('주변 복지기관을 불러오지 못했습니다.');
        setFacilities([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [lat, lng, radius]);

  return { facilities, isLoading, error };
}
