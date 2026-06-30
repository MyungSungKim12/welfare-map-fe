'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { WelfareItem } from '@/types/welfare';

const STORAGE_KEY = 'welfare_bookmarks_v1';
const MAX_BOOKMARKS = 200;

export interface UseBookmarksReturn {
  bookmarks: WelfareItem[];
  savedIds: Set<string>;
  isSaved: (id: string) => boolean;
  toggle: (item: WelfareItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
}

function readStorage(): WelfareItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WelfareItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.id === 'string' && item.id.length > 0);
  } catch {
    return [];
  }
}

function writeStorage(items: WelfareItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded 등 — 조용히 무시
  }
}

export function useBookmarks(): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<WelfareItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      setBookmarks(readStorage());
      setHydrated(true);
    };
    hydrate();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(bookmarks);
  }, [bookmarks, hydrated]);

  const savedIds = useMemo(() => new Set(bookmarks.map((item) => item.id)), [bookmarks]);

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const toggle = useCallback((item: WelfareItem) => {
    setBookmarks((prev) => {
      if (prev.some((existing) => existing.id === item.id)) {
        return prev.filter((existing) => existing.id !== item.id);
      }
      const next = [item, ...prev];
      return next.length > MAX_BOOKMARKS ? next.slice(0, MAX_BOOKMARKS) : next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setBookmarks([]), []);

  return {
    bookmarks,
    savedIds,
    isSaved,
    toggle,
    remove,
    clear,
    count: bookmarks.length,
  };
}
