'use client';

import { Bookmark, CalendarClock, ExternalLink, MapPin, UsersRound } from 'lucide-react';
import { WelfareItem } from '@/types/welfare';
import { trackPopularInteraction } from '@/lib/popular/tracking';
import {
  CardWrapper,
  CardLeft,
  CategoryBadge,
  CardTitle,
  CardDesc,
  BadgeRow,
  Badge,
  CardRight,
  SaveBtn,
  DetailBtn,
  StatusBadge,
} from './WelfareCard.style';

interface Props {
  welfare: WelfareItem;
  isSaved: boolean;
  onSave: (id: string) => void;
}

function calcDday(applyEndDd?: string): number | null {
  if (!applyEndDd || applyEndDd.length < 8) return null;
  const end = new Date(`${applyEndDd.slice(0, 4)}-${applyEndDd.slice(4, 6)}-${applyEndDd.slice(6, 8)}`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function isNewService(lastModYmd?: string): boolean {
  if (!lastModYmd || lastModYmd.length < 8) return false;
  const mod = new Date(`${lastModYmd.slice(0, 4)}-${lastModYmd.slice(4, 6)}-${lastModYmd.slice(6, 8)}`);
  const today = new Date();
  const diff = Math.ceil((today.getTime() - mod.getTime()) / (1000 * 60 * 60 * 24));
  return diff <= 30;
}

function formatDate(value?: string) {
  if (!value || value.length < 8) return null;
  return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}`;
}

export default function WelfareCard({ welfare, isSaved, onSave }: Props) {
  const dday = welfare.isAlways ? null : calcDday(welfare.applyEndDd);
  const isNew = isNewService(welfare.lastModYmd);
  const isUrgent = dday !== null && dday >= 0 && dday <= 7;
  const isExpired = dday !== null && dday < 0;
  const displayDate = formatDate(welfare.applyEndDd);

  return (
    <CardWrapper $expired={isExpired}>
      <CardLeft>
        <div className="card_top">
          <CategoryBadge>{welfare.category.split(',')[0].trim() || '복지'}</CategoryBadge>
          {isUrgent && <StatusBadge $tone="urgent">D-{dday}</StatusBadge>}
          {isExpired && <StatusBadge $tone="expired">마감</StatusBadge>}
          {isNew && !isExpired && <StatusBadge $tone="new">신규</StatusBadge>}
        </div>

        <CardTitle>{welfare.title}</CardTitle>
        <CardDesc>{welfare.summary || '상세 설명은 제공 기관의 원문에서 확인할 수 있습니다.'}</CardDesc>

        <BadgeRow>
          <Badge $type="region"><MapPin size={14} />{welfare.region || '전국'}</Badge>
          <Badge $type="target"><UsersRound size={14} />{welfare.target || '대상 확인 필요'}</Badge>
          <Badge $type="period">
            <CalendarClock size={14} />
            {welfare.isAlways ? '상시 신청' : displayDate ? `${displayDate}까지` : welfare.period || '기간 확인 필요'}
          </Badge>
        </BadgeRow>
      </CardLeft>

      <CardRight>
        <SaveBtn
          onClick={() => {
            if (!isSaved) trackPopularInteraction(welfare.cacheKey, 'save');
            onSave(welfare.id);
          }}
          title={isSaved ? '저장 취소' : '관심 복지 저장'}
          type="button"
          $saved={isSaved}
        >
          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </SaveBtn>
        <DetailBtn
          as="a"
          href={welfare.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          title="상세 보기"
          onClick={() => trackPopularInteraction(welfare.cacheKey, 'click')}
        >
          <ExternalLink size={18} />
          상세
        </DetailBtn>
      </CardRight>
    </CardWrapper>
  );
}
