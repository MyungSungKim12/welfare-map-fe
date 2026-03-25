'use client';

import { WelfareItem } from '@/types/welfare';
import {
  CardWrapper, CardLeft, CategoryBadge, CardTitle,
  CardDesc, BadgeRow, Badge, CardRight, SaveBtn, DetailBtn,
} from './WelfareCard.style';

interface Props {
  welfare: WelfareItem;
  isSaved: boolean;
  onSave: (id: string) => void;
}

export default function WelfareCard({ welfare, isSaved, onSave }: Props) {
  return (
    <CardWrapper>
      <CardLeft>
        <CategoryBadge>{welfare.category}</CategoryBadge>
        <CardTitle>{welfare.title}</CardTitle>
        <CardDesc>{welfare.summary}</CardDesc>
        <BadgeRow>
          <Badge $type="region">📍 {welfare.region}</Badge>
          <Badge $type="target">👥 {welfare.target}</Badge>
          <Badge $type="period">📅 {welfare.period}</Badge>
        </BadgeRow>
      </CardLeft>
      <CardRight>
        <SaveBtn onClick={() => onSave(welfare.id)}>
          {isSaved ? '🔖' : '📋'}
        </SaveBtn>
        <DetailBtn>→</DetailBtn>
      </CardRight>
    </CardWrapper>
  );
}