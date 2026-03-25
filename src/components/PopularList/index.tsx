'use client';

import { useState } from 'react';
import {
  PopularWrapper, PopularInner, SectionHeader,
  TabGroup, TabBtn, CardScroll, PopularCard,
  UrgentBadge, NewBadge,
} from './PopularList.style';

const TABS = ['많이 본 복지', '마감 임박', '신규 등록'];

const DUMMY = [
  { rank: 1, title: '어르신 무료 건강검진 지원', target: '만 65세 이상', badge: null },
  { rank: 2, title: '청년 취업 준비금 지원', target: '만 19~34세 청년', badge: 'urgent' },
  { rank: 3, title: '신혼부부 전세자금 이자 지원', target: '신혼부부', badge: null },
  { rank: 4, title: '임산부 영양제 무료 지원', target: '임산부', badge: 'new' },
  { rank: 5, title: '장애인 보조기기 지원사업', target: '장애인', badge: null },
];

export default function PopularList() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <PopularWrapper>
      <PopularInner>
        <SectionHeader>
          <h2>인기 복지 서비스</h2>
          <TabGroup>
            {TABS.map((t, i) => (
              <TabBtn key={t} $active={activeTab === i} onClick={() => setActiveTab(i)}>
                {t}
              </TabBtn>
            ))}
          </TabGroup>
        </SectionHeader>

        <CardScroll>
          {DUMMY.map((item) => (
            <PopularCard key={item.rank}>
              {item.badge === 'urgent' && <UrgentBadge>마감임박</UrgentBadge>}
              {item.badge === 'new' && <NewBadge>신규</NewBadge>}
              <p className="card_rank">TOP {item.rank}</p>
              <p className="card_title">{item.title}</p>
              <p className="card_target">{item.target}</p>
            </PopularCard>
          ))}
        </CardScroll>
      </PopularInner>
    </PopularWrapper>
  );
}