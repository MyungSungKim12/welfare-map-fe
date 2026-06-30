'use client';

import { Activity, BellRing, DatabaseZap, MapPinned } from 'lucide-react';
import { StatWrapper, StatInner, SectionHeader, StatGrid, StatCard, CategoryGrid, CategoryBar } from './Statistics.style';
import { WelfareInsights } from '@/utils/welfareInsights';

interface Props {
  insights: WelfareInsights;
  isLoading: boolean;
}

export default function Statistics({ insights, isLoading }: Props) {
  const stats = [
    { icon: DatabaseZap, number: isLoading ? '-' : `${insights.totalCount}건`, label: '현재 노출 가능한 복지' },
    { icon: BellRing, number: isLoading ? '-' : `${insights.newCount}건`, label: '최근 갱신 후보' },
    { icon: Activity, number: isLoading ? '-' : `${insights.urgentCount}건`, label: '30일 내 마감 후보' },
    { icon: MapPinned, number: isLoading ? '-' : `${insights.regionalCount}건`, label: '지역 맞춤 후보' },
  ];
  const categories = insights.categoryStats.length > 0
    ? insights.categoryStats
    : [{ label: '데이터 조회 중', count: 0, ratio: 0 }];

  return (
    <StatWrapper>
      <StatInner>
        <SectionHeader>
          <span>데이터 현황</span>
          <h2>현재 조건에 맞는 복지 데이터를 실시간으로 요약합니다</h2>
          <p>외부 API 조회 결과를 기준으로 마감, 신규, 지역 후보와 분야별 분포를 계산합니다.</p>
        </SectionHeader>

        <StatGrid>
          {stats.map(({ icon: Icon, ...stat }) => (
            <StatCard key={stat.label}>
              <div className="stat_icon"><Icon size={24} /></div>
              <div className="stat_number">{stat.number}</div>
              <div className="stat_label">{stat.label}</div>
            </StatCard>
          ))}
        </StatGrid>

        <CategoryGrid>
          {categories.map((category) => (
            <CategoryBar key={category.label}>
              <p className="cat_label">{category.label}</p>
              <div className="cat_bar_wrap">
                <div className="cat_bar_fill" style={{ width: `${category.ratio}%` }} />
              </div>
              <p className="cat_count">{category.count}건</p>
            </CategoryBar>
          ))}
        </CategoryGrid>
      </StatInner>
    </StatWrapper>
  );
}
