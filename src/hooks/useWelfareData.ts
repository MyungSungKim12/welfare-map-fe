'use client';

import { useState, useEffect, useCallback } from 'react';
import { WelfareItem, FilterType } from '@/types/welfare';
import { LocationInfo } from '@/hooks/useLocation';

const PAGE_SIZE = 5;

const AGE_TO_LIFE_CODE: Record<string, string> = {
  child:  '001', youth:  '003',
  middle: '004', senior: '006', all: '',
};

const SITUATION_TO_KEY_CODE: Record<string, string> = {
  newlywed: '010', pregnant:   '002',
  job:      '004', disability: '003',
  lowincome:'001', all:        '',
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
      const sidoShort   = location?.sidoName?.slice(0, 2) ?? '인천';
      const sigunguName = location?.sigunguName ?? '';

      const localParams = new URLSearchParams({
        numOfRows: '100',
        sidoCd,
        sidoName:    location?.sidoName    ?? '',
        sigunguName: sigunguName !== '전체' ? sigunguName : '',
        ...(lifeArray   && { lifeArray }),
        ...(srchKeyCode && { srchKeyCode }),
      });
      
      const nationalParams = new URLSearchParams({
        numOfRows: '100',
        ...(lifeArray   && { lifeArray }),
        ...(srchKeyCode && { srchKeyCode }),
      });

      const [localRes, nationalRes] = await Promise.allSettled([
        fetch(`/api/welfare/local?${localParams}`),
        fetch(`/api/welfare/national?${nationalParams}`),
      ]);

      const localItems: any[] =
        localRes.status === 'fulfilled'
          ? (await localRes.value.json()).items ?? [] : [];

      const nationalItems: WelfareItem[] =
        nationalRes.status === 'fulfilled'
          ? (await (nationalRes as PromiseFulfilledResult<Response>).value.json()).items ?? [] : [];
      
      let merged = [...localItems, ...nationalItems].filter(
        (item, idx, arr) =>
          arr.findIndex((i: any) => i.id === item.id) === idx && item.id
      ) as WelfareItem[];

      // 검색어 클라이언트 필터링
      if (keyword?.trim()) {
        const kw = keyword.trim().toLowerCase();
        merged = merged.filter(
          (item) =>
            item.title.toLowerCase().includes(kw) ||
            item.summary?.toLowerCase().includes(kw) ||
            item.category?.toLowerCase().includes(kw)
        );
      }

      setAllItems(merged);
    } catch {
      setError('복지 데이터를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [filter?.ageGroup, filter?.situation, location?.sidoCd, location?.sigunguCd, location?.sigunguName, keyword]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
  const items      = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return { items, allItems, isLoading, error, page, totalPages, setPage, refetch: fetchData };
}