'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, Clock3, Flame, Sparkles } from 'lucide-react';
import {
  PopularWrapper,
  PopularInner,
  SectionHeader,
  TabGroup,
  TabBtn,
  CardScroll,
  PopularCard,
  StatusBadge,
} from './PopularList.style';
import { RankedWelfareItem, WelfareInsights } from '@/utils/welfareInsights';

interface Props {
  insights: WelfareInsights;
  isLoading: boolean;
}

const TABS = ['맞춤 후보', '마감 임박', '새로 등록'];

function getTabItems(activeTab: number, insights: WelfareInsights) {
  if (activeTab === 1) return insights.urgentItems;
  if (activeTab === 2) return insights.newItems;
  return insights.recommendedItems;
}

function getTargetText(item: RankedWelfareItem) {
  return [item.region || '전국', item.target || '대상 확인 필요'].filter(Boolean).join(' · ');
}

export default function PopularList({ insights, isLoading }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const items = useMemo(() => getTabItems(activeTab, insights).slice(0, 5), [activeTab, insights]);

  return (
    <PopularWrapper>
      <PopularInner>
        <SectionHeader>
          <div>
            <span>추천 레이더</span>
            <h2>지금 먼저 볼 지원 후보</h2>
          </div>
          <TabGroup aria-label="추천 유형">
            {TABS.map((tab, index) => (
              <TabBtn key={tab} $active={activeTab === index} onClick={() => setActiveTab(index)} type="button">
                {index === 0 && <Sparkles size={15} />}
                {index === 1 && <Clock3 size={15} />}
                {index === 2 && <Flame size={15} />}
                {tab}
              </TabBtn>
            ))}
          </TabGroup>
        </SectionHeader>

        <CardScroll>
          {isLoading && [1, 2, 3, 4, 5].map((rank) => (
            <PopularCard key={rank}>
              <StatusBadge $tone="default">조회 중</StatusBadge>
              <p className="card_rank">TOP {rank}</p>
              <p className="card_title">복지 후보를 불러오고 있습니다</p>
              <p className="card_target">잠시만 기다려주세요</p>
            </PopularCard>
          ))}

          {!isLoading && items.length === 0 && (
            <PopularCard>
              <StatusBadge $tone="default">결과 없음</StatusBadge>
              <p className="card_rank">조건 변경</p>
              <p className="card_title">표시할 지원 후보가 없습니다</p>
              <p className="card_target">위치나 맞춤 조건을 바꿔 다시 확인해보세요.</p>
            </PopularCard>
          )}

          {!isLoading && items.map((item, index) => (
            <PopularCard
              key={item.id}
              as={item.link ? 'a' : 'article'}
              href={item.link || undefined}
              target={item.link ? '_blank' : undefined}
              rel={item.link ? 'noopener noreferrer' : undefined}
            >
              <StatusBadge $tone={item.insightTone}>{item.insightBadge}</StatusBadge>
              <p className="card_rank">TOP {index + 1}</p>
              <p className="card_title">{item.title}</p>
              <p className="card_target">{getTargetText(item)}</p>
              <span className="card_link">자세히 보기 <ArrowUpRight size={15} /></span>
            </PopularCard>
          ))}
        </CardScroll>
      </PopularInner>
    </PopularWrapper>
  );
}
