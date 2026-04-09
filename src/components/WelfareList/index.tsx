'use client';

import WelfareCard from '@/components/WelfareCard';
import { ListWrapper, ListHeader, EmptyState } from './WelfareList.style';
import { useWelfareData } from '@/hooks/useWelfareData';
import { FilterType } from '@/types/welfare';
import { LocationInfo } from '@/hooks/useLocation';

interface Props {
  filter?:   FilterType;
  location?: LocationInfo;
  keyword?:  string;
}

function SkeletonCard() {
  return (
    <div style={{
      background: '#ffffff', border: '1px solid #EDE8E0',
      borderRadius: '14px', padding: '2.2rem 2.4rem',
      display: 'flex', flexDirection: 'column', gap: '1rem',
    }}>
      {[80, 60, 40].map((w) => (
        <div key={w} style={{
          height: '16px', width: `${w}%`,
          background: 'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)',
          backgroundSize: '200% 100%', borderRadius: '6px',
          animation: 'shimmer 1.5s infinite',
        }} />
      ))}
    </div>
  );
}

function Pagination({ page, totalPages, setPage }: {
  page: number; totalPages: number; setPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  // 최대 5개 페이지 버튼 표시
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end   = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const btnStyle = (active: boolean, disabled = false) => ({
    padding: '0.7rem 1.2rem',
    border: `1.5px solid ${active ? '#1B3A4B' : '#D5CEC4'}`,
    borderRadius: '8px',
    background: active ? '#1B3A4B' : '#fff',
    color: active ? '#fff' : disabled ? '#C0B8B0' : '#6B6058',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '1.4rem',
    fontWeight: active ? 700 : 400,
    opacity: disabled ? 0.5 : 1,
    minWidth: '36px',
  } as React.CSSProperties);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', marginTop: '2.4rem' }}>
      <button style={btnStyle(false, page === 1)} onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
        ‹
      </button>
      {start > 1 && (
        <>
          <button style={btnStyle(false)} onClick={() => setPage(1)}>1</button>
          {start > 2 && <span style={{ color: '#8A7F72', fontSize: '1.4rem' }}>···</span>}
        </>
      )}
      {pages.map((p) => (
        <button key={p} style={btnStyle(p === page)} onClick={() => setPage(p)}>{p}</button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ color: '#8A7F72', fontSize: '1.4rem' }}>···</span>}
          <button style={btnStyle(false)} onClick={() => setPage(totalPages)}>{totalPages}</button>
        </>
      )}
      <button style={btnStyle(false, page === totalPages)} onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
        ›
      </button>
    </div>
  );
}

export default function WelfareList({ filter, location, keyword }: Props) {
  const { items, allItems, isLoading, error, page, totalPages, setPage, refetch } = useWelfareData(filter, location, keyword);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <ListWrapper>
        <ListHeader>
          <p className="result_count">
            {isLoading
              ? '복지 서비스를 불러오는 중...'
              : allItems.length > 0
                ? <>총 <span>{allItems.length}건</span> 중 {(page - 1) * 5 + 1}~{Math.min(page * 5, allItems.length)}번째</>
                : '검색 결과가 없습니다'
            }
          </p>
          {!isLoading && allItems.length > 0 && (
            <p style={{ fontSize: '1.2rem', color: '#8A7F72', marginTop: '0.4rem' }}>
              📌 선택 지역 복지 + 전국 공통 복지 포함
            </p>
          )}
        </ListHeader>

        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
          </div>
        )}

        {!isLoading && error && (
          <EmptyState>
            <span className="empty_icon">⚠️</span>
            <p className="empty_text">
              {error}<br />
              <button onClick={refetch} style={{
                marginTop: '1.2rem', padding: '0.8rem 2rem',
                background: '#2E9E7A', color: '#fff', border: 'none',
                borderRadius: '8px', fontSize: '1.4rem', cursor: 'pointer',
              }}>
                다시 시도
              </button>
            </p>
          </EmptyState>
        )}

        {!isLoading && !error && items.length === 0 && (
          <EmptyState>
            <span className="empty_icon">🔍</span>
            <p className="empty_text">
              해당하는 복지 서비스가 없습니다.<br />
              필터나 위치를 변경해보세요.
            </p>
          </EmptyState>
        )}

        {!isLoading && !error && items.map((item) => (
          <WelfareCard key={item.id} welfare={item} isSaved={false} onSave={() => {}} />
        ))}

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </ListWrapper>
    </>
  );
}