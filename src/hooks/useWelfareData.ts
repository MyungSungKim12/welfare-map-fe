'use client';

import { useState, useEffect } from 'react';
import { WelfareItem } from '@/types/welfare';

interface UseWelfareDataReturn {
  items:     WelfareItem[];
  isLoading: boolean;
  error:     string | null;
  refetch:   () => void;
}

export function useWelfareData(): UseWelfareDataReturn {
  const [items,     setItems]     = useState<WelfareItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 중앙부처 + 지자체 병렬 호출
      const [nationalRes, localRes] = await Promise.allSettled([
        fetch('/api/welfare/national?numOfRows=20'),
        fetch('/api/welfare/local?numOfRows=20&sidoCd=28&sigunguCd=28177'),
      ]);

      const nationalItems: WelfareItem[] =
        nationalRes.status === 'fulfilled'
          ? (await nationalRes.value.json()).items ?? []
          : [];

      const localItems: WelfareItem[] =
        localRes.status === 'fulfilled'
          ? (await localRes.value.json()).items ?? []
          : [];

      // 중복 제거 후 합치기
      const allItems = [...localItems, ...nationalItems];
      const unique   = allItems.filter(
        (item, idx, arr) => arr.findIndex((i) => i.id === item.id) === idx
      );

      setItems(unique);
    } catch (e) {
      setError('복지 데이터를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return { items, isLoading, error, refetch: fetchData };
}