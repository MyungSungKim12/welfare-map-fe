'use client';

import { useCallback, useEffect, useState } from 'react';
import type { BenefitSearchResponse } from '@/types/benefit';

const EMPTY_RESPONSE: BenefitSearchResponse = {
  items: [],
  sourceResults: [],
  activeSources: [],
  plannedSources: [],
  totalCount: 0,
  query: '',
  apiKeyword: '',
};

interface UseBenefitSearchOptions {
  query: string;
  apiKeyword?: string;
  sidoCd?: string;
  sidoName?: string;
  sigunguName?: string;
  enabled?: boolean;
}

export function useBenefitSearch({
  query,
  apiKeyword = '',
  sidoCd,
  sidoName,
  sigunguName,
  enabled = true,
}: UseBenefitSearchOptions) {
  const [data, setData] = useState<BenefitSearchResponse>(EMPTY_RESPONSE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBenefits = useCallback(async () => {
    if (!enabled) {
      setData(EMPTY_RESPONSE);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({
      q: query,
      apiKeyword,
      numOfRows: '100',
    });
    if (sidoCd) params.set('sidoCd', sidoCd);
    if (sidoName) params.set('sidoName', sidoName);
    if (sigunguName) params.set('sigunguName', sigunguName);

    try {
      const response = await fetch(`/api/benefits/search?${params.toString()}`);
      if (!response.ok) throw new Error('benefit search failed');
      setData((await response.json()) as BenefitSearchResponse);
    } catch {
      setError('혜택 검색 결과를 불러오지 못했습니다.');
      setData(EMPTY_RESPONSE);
    } finally {
      setIsLoading(false);
    }
  }, [apiKeyword, enabled, query, sidoCd, sidoName, sigunguName]);

  useEffect(() => {
    fetchBenefits();
  }, [fetchBenefits]);

  return {
    ...data,
    isLoading,
    error,
    refetch: fetchBenefits,
  };
}
