'use client';

import { WelfareItem } from '@/types/welfare';
import {
  CardWrapper, CardLeft, CategoryBadge, CardTitle,
  CardDesc, BadgeRow, Badge, CardRight, SaveBtn, DetailBtn,
} from './WelfareCard.style';

interface Props {
  welfare: WelfareItem;
  isSaved: boolean;
  onSave:  (id: string) => void;
}

// 마감 D-day 계산
function calcDday(applyEndDd?: string): number | null {
  if (!applyEndDd || applyEndDd.length < 8) return null;
  const end = new Date(
    `${applyEndDd.slice(0, 4)}-${applyEndDd.slice(4, 6)}-${applyEndDd.slice(6, 8)}`
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

// 신규 여부 판별 (30일 이내)
function isNewService(lastModYmd?: string): boolean {
  if (!lastModYmd || lastModYmd.length < 8) return false;
  const mod = new Date(
    `${lastModYmd.slice(0, 4)}-${lastModYmd.slice(4, 6)}-${lastModYmd.slice(6, 8)}`
  );
  const today = new Date();
  const diff = Math.ceil((today.getTime() - mod.getTime()) / (1000 * 60 * 60 * 24));
  return diff <= 30;
}

export default function WelfareCard({ welfare, isSaved, onSave }: Props) {
  const dday   = welfare.isAlways ? null : calcDday(welfare.applyEndDd);
  const isNew  = isNewService(welfare.lastModYmd);
  const isUrgent = dday !== null && dday >= 0 && dday <= 7;
  const isExpired = dday !== null && dday < 0;

  return (
    <CardWrapper style={{ opacity: isExpired ? 0.6 : 1 }}>
      <CardLeft>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <CategoryBadge>{welfare.category.split(',')[0].trim()}</CategoryBadge>

          {/* 마감임박 배지 */}
          {isUrgent && (
            <span style={{
              background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5',
              borderRadius: '6px', padding: '0.2rem 0.8rem',
              fontSize: '1.1rem', fontWeight: 700,
            }}>
              🔥 D-{dday}
            </span>
          )}

          {/* 마감 완료 배지 */}
          {isExpired && (
            <span style={{
              background: '#F3F4F6', color: '#9CA3AF', border: '1px solid #E5E7EB',
              borderRadius: '6px', padding: '0.2rem 0.8rem',
              fontSize: '1.1rem', fontWeight: 700,
            }}>
              마감완료
            </span>
          )}

          {/* 신규 배지 */}
          {isNew && !isExpired && (
            <span style={{
              background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0',
              borderRadius: '6px', padding: '0.2rem 0.8rem',
              fontSize: '1.1rem', fontWeight: 700,
            }}>
              ✨ NEW
            </span>
          )}
        </div>

        <CardTitle>{welfare.title}</CardTitle>
        <CardDesc>{welfare.summary}</CardDesc>

        <BadgeRow>
          <Badge $type="region">📍 {welfare.region}</Badge>
          <Badge $type="target">👥 {welfare.target}</Badge>
          <Badge $type="period">
            📅 {welfare.isAlways ? '연중 상시' : (welfare.applyEndDd
              ? `~${welfare.applyEndDd.slice(0,4)}.${welfare.applyEndDd.slice(4,6)}.${welfare.applyEndDd.slice(6,8)}`
              : welfare.period)}
          </Badge>
        </BadgeRow>
      </CardLeft>

      <CardRight>
        <SaveBtn
          onClick={() => onSave(welfare.id)}
          title={isSaved ? '북마크 취소' : '북마크 저장'}
          style={{ color: isSaved ? '#2E9E7A' : '#C0B8B0' }}
        >
          {isSaved ? '🔖' : '📋'}
        </SaveBtn>
        <DetailBtn
          as="a"
          href={welfare.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          title="상세 보기"
        >
          →
        </DetailBtn>
      </CardRight>
    </CardWrapper>
  );
}