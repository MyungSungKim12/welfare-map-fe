'use client';

import { useCallback, useEffect, useState } from 'react';
import { FilterType, WelfareItem } from '@/types/welfare';
import { LocationInfo } from '@/hooks/useLocation';

const PAGE_SIZE = 5;

const AGE_TO_LIFE_CODE: Record<string, string> = {
  child: '001',
  youth: '003',
  middle: '004',
  senior: '006',
  all: '',
};

const SITUATION_TO_KEY_CODE: Record<string, string> = {
  newlywed: '010',
  pregnant: '002',
  job: '004',
  disability: '003',
  lowincome: '001',
  all: '',
};

interface WelfareApiResponse {
  items?: WelfareItem[];
}

export interface UseWelfareDataReturn {
  items: WelfareItem[];
  allItems: WelfareItem[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  refetch: () => void;
}

async function readItems(response: Response): Promise<WelfareItem[]> {
  if (!response.ok) return [];
  const data = (await response.json()) as WelfareApiResponse;
  return data.items ?? [];
}

function dedupeItems(items: WelfareItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function useWelfareData(
  filter?: FilterType,
  location?: LocationInfo,
  keyword?: string,
): UseWelfareDataReturn {
  const [allItems, setAllItems] = useState<WelfareItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const ageGroup = filter?.ageGroup;
  const situation = filter?.situation;
  const sidoCd = location?.sidoCd;
  const sidoName = location?.sidoName;
  const sigunguName = location?.sigunguName;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPage(1);

    try {
      const lifeArray = ageGroup ? AGE_TO_LIFE_CODE[ageGroup] ?? '' : '';
      const srchKeyCode = situation ? SITUATION_TO_KEY_CODE[situation] ?? '' : '';
      const normalizedSigunguName = sigunguName === '전체' ? '' : sigunguName ?? '';

      const localParams = new URLSearchParams({
        numOfRows: '100',
        sidoCd: sidoCd ?? '28',
        sidoName: sidoName ?? '인천광역시',
        sigunguName: normalizedSigunguName,
      });

      if (lifeArray) localParams.set('lifeArray', lifeArray);
      if (srchKeyCode) localParams.set('srchKeyCode', srchKeyCode);

      const nationalParams = new URLSearchParams({ numOfRows: '100' });
      if (lifeArray) nationalParams.set('lifeArray', lifeArray);
      if (srchKeyCode) nationalParams.set('srchKeyCode', srchKeyCode);

      const [localResult, nationalResult] = await Promise.allSettled([
        fetch(`/api/welfare/local?${localParams.toString()}`),
        fetch(`/api/welfare/national?${nationalParams.toString()}`),
      ]);

      const localItems = localResult.status === 'fulfilled' ? await readItems(localResult.value) : [];
      const nationalItems = nationalResult.status === 'fulfilled' ? await readItems(nationalResult.value) : [];
      let merged = dedupeItems([...localItems, ...nationalItems]);

      if (keyword?.trim()) {
        const normalizedKeyword = keyword.trim().toLowerCase();
        merged = merged.filter((item) =>
          [item.title, item.summary, item.category, item.target, item.region]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedKeyword))
        );
      }

      setAllItems(merged);
    } catch {
      setError('복지 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      setAllItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    ageGroup,
    keyword,
    sidoCd,
    sidoName,
    sigunguName,
    situation,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
  const items = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return { items, allItems, isLoading, error, page, totalPages, setPage, refetch: fetchData };
}
