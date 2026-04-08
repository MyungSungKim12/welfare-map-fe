'use client';

import { useState, useEffect, useCallback } from 'react';
import { WelfareItem, FilterType } from '@/types/welfare';
import { LocationInfo } from '@/hooks/useLocation';

const PAGE_SIZE = 5;

const AGE_TO_LIFE_CODE: Record<string, string> = {
  child:  '001',
  youth:  '003',
  middle: '004',
  senior: '006',
  all:    '',
};

const SITUATION_TO_KEY_CODE: Record<string, string> = {
  newlywed:   '010',
  pregnant:   '002',
  job:        '004',
  disability: '003',
  lowincome:  '001',
  all:        '',
};

interface UseWelfareDataReturn {
  items:      WelfareItem[];
  allItems:   WelfareItem[];
  isLoading:  boolean;
  error:      string | null;
  page:       number;
  totalPages: number;
  setPage:    (p: number) => void;
  refetch:    () => void;
}

export function useWelfareData(
  filter?:   FilterType,
  location?: LocationInfo,
  keyword?:  string,
): UseWelfareDataReturn {
  const [allItems,  setAllItems]  = useState<WelfareItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [page,      setPage]      = useState(1);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPage(1);

    try {
      const lifeArray   = filter ? AGE_TO_LIFE_CODE[filter.ageGroup]      ?? '' : '';
      const srchKeyCode = filter ? SITUATION_TO_KEY_CODE[filter.situation] ?? '' : '';
      const sidoCd      = location?.sidoCd    ?? '28';
      const sigunguCd   = location?.sigunguCd ?? '28177';

      const localParams = new URLSearchParams({
        numOfRows: '50',
        sidoCd,
        sigunguCd,
        ...(lifeArray   && { lifeArray }),
        ...(srchKeyCode && { srchKeyCode }),
        ...(keyword     && { keyword }),
      });

      const requests: Promise<Response>[] = [
        fetch(`/api/welfare/local?${localParams}`),
      ];

      // 필터 또는 검색어 있을 때 중앙부처도 조회
      if (lifeArray || srchKeyCode || keyword) {
        const nationalParams = new URLSearchParams({
          numOfRows: '30',
          ...(lifeArray   && { lifeArray }),
          ...(srchKeyCode && { srchKeyCode }),
          ...(keyword     && { keyword }),
        });
        requests.push(fetch(`/api/welfare/national?${nationalParams}`));
      }

      const results = await Promise.allSettled(requests);

      const localItems: WelfareItem[] =
        results[0].status === 'fulfilled'
          ? (await results[0].value.json()).items ?? []
          : [];

      const nationalItems: WelfareItem[] =
        results[1]?.status === 'fulfilled'
          ? (await (results[1] as PromiseFulfilledResult<Response>).value.json()).items ?? []
          : [];

      let merged = [...localItems, ...nationalItems].filter(
        (item, idx, arr) => arr.findIndex((i) => i.id === item.id) === idx && item.id
      );

      // 검색어 클라이언트 사이드 필터링 (API가 지원 안 하는 경우 대비)
      if (keyword?.trim()) {
        const kw = keyword.trim().toLowerCase();
        merged = merged.filter(
          (item) =>
            item.title.toLowerCase().includes(kw) ||
            item.summary.toLowerCase().includes(kw) ||
            item.category.toLowerCase().includes(kw)
        );
      }

      setAllItems(merged);
    } catch {
      setError('복지 데이터를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [filter?.ageGroup, filter?.situation, location?.sidoCd, location?.sigunguCd, keyword]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
  const items      = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return { items, allItems, isLoading, error, page, totalPages, setPage, refetch: fetchData };
}