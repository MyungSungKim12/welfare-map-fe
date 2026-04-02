'use client';

import WelfareCard from '@/components/WelfareCard';
import { ListWrapper, ListHeader, EmptyState } from './WelfareList.style';
import { useWelfareData } from '@/hooks/useWelfareData';
import { FilterType } from '@/types/welfare';
import { LocationInfo } from '@/hooks/useLocation';

interface Props {
  filter?: FilterType;
  location?: LocationInfo;
}

function SkeletonCard() {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #EDE8E0',
      borderRadius: '14px',
      padding: '2.2rem 2.4rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      {[80, 60, 40].map((w) => (
        <div key={w} style={{
          height: '16px',
          width: `${w}%`,
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          borderRadius: '6px',
          animation: 'shimmer 1.5s infinite',
        }} />
      ))}
    </div>
  );
}

export default function WelfareList({ filter, location }: Props) {
  const { items, isLoading, error, refetch } = useWelfareData(filter, location);

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
              : <>총 <span>{items.length}건</span>의 복지 서비스</>
            }
          </p>
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
              <button
                onClick={refetch}
                style={{
                  marginTop: '1.2rem',
                  padding: '0.8rem 2rem',
                  background: '#2E9E7A',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                }}
              >
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
              필터를 변경해보세요.
            </p>
          </EmptyState>
        )}

        {!isLoading && !error && items.map((item) => (
          <WelfareCard
            key={item.id}
            welfare={item}
            isSaved={false}
            onSave={() => {}}
          />
        ))}
      </ListWrapper>
    </>
  );
}