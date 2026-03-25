'use client';

import { StatWrapper, StatInner, SectionHeader, StatGrid, StatCard, CategoryGrid, CategoryBar } from './Statistics.style';

const STATS = [
  { icon: '📋', number: '342건', label: '전체 복지 서비스' },
  { icon: '🆕', number: '28건', label: '이번 달 신규' },
  { icon: '⏰', number: '15건', label: '마감 임박 (30일)' },
  { icon: '👥', number: '6가지', label: '생애주기 분류' },
];

const CATEGORIES = [
  { label: '의료/건강', count: 89, ratio: 90 },
  { label: '주거/생활', count: 74, ratio: 75 },
  { label: '교육/보육', count: 62, ratio: 62 },
  { label: '취업/일자리', count: 58, ratio: 58 },
  { label: '보건/돌봄', count: 59, ratio: 60 },
];

export default function Statistics() {
  return (
    <StatWrapper>
      <StatInner>
        <SectionHeader>
          <h2>인천 미추홀구 복지 현황</h2>
          <p>현재 지역에서 이용 가능한 복지 서비스 통계예요</p>
        </SectionHeader>

        <StatGrid>
          {STATS.map((s) => (
            <StatCard key={s.label}>
              <div className="stat_icon">{s.icon}</div>
              <div className="stat_number">{s.number}</div>
              <div className="stat_label">{s.label}</div>
            </StatCard>
          ))}
        </StatGrid>

        <CategoryGrid>
          {CATEGORIES.map((c) => (
            <CategoryBar key={c.label}>
              <p className="cat_label">{c.label}</p>
              <div className="cat_bar_wrap">
                <div className="cat_bar_fill" style={{ width: `${c.ratio}%` }} />
              </div>
              <p className="cat_count">{c.count}건</p>
            </CategoryBar>
          ))}
        </CategoryGrid>
      </StatInner>
    </StatWrapper>
  );
}