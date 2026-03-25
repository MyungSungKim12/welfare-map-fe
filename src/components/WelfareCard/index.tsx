'use client';

import { WelfareItem } from '@/types/welfare';
import {
  CardWrapper, CardTop, CardTitle, SaveButton,
  CardDesc, BadgeRow, Badge,
} from './WelfareCard.style';

interface Props {
  welfare: WelfareItem;
  isSaved: boolean;
  onSave: (id: string) => void;
}

export default function WelfareCard({ welfare, isSaved, onSave }: Props) {
  return (
    <CardWrapper>
      <CardTop>
        <CardTitle>{welfare.title}</CardTitle>
        <SaveButton $saved={isSaved} onClick={() => onSave(welfare.id)}>
          {isSaved ? '🔖' : '📋'}
        </SaveButton>
      </CardTop>
      <CardDesc>{welfare.summary}</CardDesc>
      <BadgeRow>
        <Badge $type="region">📍 {welfare.region}</Badge>
        <Badge $type="target">👥 {welfare.target}</Badge>
        <Badge $type="category">{welfare.category}</Badge>
      </BadgeRow>
    </CardWrapper>
  );
}