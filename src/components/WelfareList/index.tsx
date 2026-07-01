'use client';

import { useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import WelfareCard from '@/components/WelfareCard';
import { ListWrapper, ListHeader, EmptyState } from './WelfareList.style';
import { UseWelfareDataReturn } from '@/hooks/useWelfareData';
import type { WelfareItem } from '@/types/welfare';
import { trackPopularInteraction } from '@/lib/popular/tracking';

interface Props {
  data: UseWelfareDataReturn;
  savedIds: Set<string>;
  onToggleSave: (item: WelfareItem) => void;
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <span />
      <span />
      <span />
    </div>
  );
}

function Pagination({ page, totalPages, setPage }: {
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <div className="pagination">
      <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>이전</button>
      {pages.map((p) => (
        <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>
          {p}
        </button>
      ))}
      <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>다음</button>
    </div>
  );
}

export default function WelfareList({ data, savedIds, onToggleSave }: Props) {
  const { items, allItems, isLoading, error, page, totalPages, setPage, refetch } = data;
  const startIndex = allItems.length === 0 ? 0 : (page - 1) * 5 + 1;
  const endIndex = Math.min(page * 5, allItems.length);

  const viewedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (isLoading || error) return;
    for (const item of items) {
      if (item.cacheKey && !viewedRef.current.has(item.cacheKey)) {
        viewedRef.current.add(item.cacheKey);
        trackPopularInteraction(item.cacheKey, 'view');
      }
    }
  }, [items, isLoading, error]);

  return (
    <ListWrapper>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <ListHeader>
        <div>
          <p className="eyebrow">복지 후보</p>
          <p className="result_count">
            {isLoading
              ? '복지 정보를 불러오는 중입니다'
              : allItems.length > 0
                ? <>총 <span>{allItems.length}건</span> 중 {startIndex}-{endIndex}번째</>
                : '조건에 맞는 결과가 없습니다'}
          </p>
        </div>
        {!isLoading && (
          <button type="button" onClick={refetch}>
            <RefreshCw size={15} />
            새로고침
          </button>
        )}
      </ListHeader>

      {isLoading && (
        <div className="list-stack">
          {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
        </div>
      )}

      {!isLoading && error && (
        <EmptyState>
          <p className="empty_title">데이터를 불러오지 못했습니다</p>
          <p className="empty_text">{error}</p>
          <button onClick={refetch} type="button">다시 시도</button>
        </EmptyState>
      )}

      {!isLoading && !error && items.length === 0 && (
        <EmptyState>
          <p className="empty_title">표시할 지원 후보가 없습니다</p>
          <p className="empty_text">검색어, 위치, 맞춤 조건을 바꿔 다시 확인해보세요.</p>
        </EmptyState>
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="list-stack">
          {items.map((item) => (
            <WelfareCard
              key={item.id}
              welfare={item}
              isSaved={savedIds.has(item.id)}
              onSave={() => onToggleSave(item)}
            />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </ListWrapper>
  );
}
