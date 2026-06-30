'use client';

import { useState } from 'react';
import { ArrowRight, CalendarClock, CheckCircle2, LocateFixed, Search, Sparkles } from 'lucide-react';
import {
  HeroWrapper,
  HeroInner,
  HeroCopy,
  HeroEyebrow,
  HeroTitle,
  HeroSubtitle,
  HeroActions,
  HeroSearchBar,
  HeroCTA,
  HeroPanel,
  InsightCard,
  HeroStats,
} from './Hero.style';
import { LocationInfo } from '@/hooks/useLocation';
import { WelfareInsights } from '@/utils/welfareInsights';

interface Props {
  location: LocationInfo;
  insights: WelfareInsights;
  isLoading: boolean;
  onSearch: (keyword: string) => void;
  onDetectLocation: () => void;
}

export default function Hero({ location, insights, isLoading, onSearch, onDetectLocation }: Props) {
  const [query, setQuery] = useState('');
  const urgentTitle = insights.urgentItems[0]?.title;
  const newTitle = insights.newItems[0]?.title;

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <HeroWrapper>
      <HeroInner>
        <HeroCopy>
          <HeroEyebrow>
            <Sparkles size={17} />
            AI 지역생활 복지 레이더
          </HeroEyebrow>
          <HeroTitle>
            오늘 내 주변에서 받을 수 있는 지원을 먼저 보여드려요.
          </HeroTitle>
          <HeroSubtitle>
            {location.sidoName} {location.sigunguName} 기준으로 복지 정책, 마감 임박 지원, 주변 생활 정보를 한 화면에서 정리합니다.
          </HeroSubtitle>

          <HeroActions>
            <HeroSearchBar>
              <Search size={20} />
              <input
                type="text"
                placeholder="청년, 주거, 건강검진, 출산지원처럼 검색"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button type="button" onClick={handleSearch}>검색</button>
            </HeroSearchBar>
            <HeroCTA type="button" onClick={onDetectLocation}>
              <LocateFixed size={19} />
              현재 위치로 갱신
            </HeroCTA>
          </HeroActions>

          <HeroStats>
            <div>
              <strong>{isLoading ? '-' : `${insights.totalCount}건`}</strong>
              <span>현재 조건 복지 후보</span>
            </div>
            <div>
              <strong>{isLoading ? '-' : `${insights.urgentCount}건`}</strong>
              <span>30일 내 마감 후보</span>
            </div>
            <div>
              <strong>{isLoading ? '-' : `${insights.newCount}건`}</strong>
              <span>최근 갱신된 정책</span>
            </div>
          </HeroStats>
        </HeroCopy>

        <HeroPanel aria-label="오늘의 추천 요약">
          <div className="panel_header">
            <span>오늘의 레이더</span>
            <strong>{location.sigunguName}</strong>
          </div>
          <InsightCard $tone="urgent">
            <CalendarClock size={22} />
            <div>
              <span>마감 임박</span>
              <strong>{urgentTitle ?? '신청 기한이 가까운 지원을 먼저 확인하세요.'}</strong>
              <p>
                {isLoading
                  ? '현재 조건에 맞는 마감 정보를 불러오는 중입니다.'
                  : `${insights.urgentCount}건의 마감 후보를 D-day 기준으로 정렬했습니다.`}
              </p>
            </div>
          </InsightCard>
          <InsightCard $tone="new">
            <CheckCircle2 size={22} />
            <div>
              <span>새로 등록</span>
              <strong>{newTitle ?? '최근 갱신된 정책을 놓치지 않게 모아봅니다.'}</strong>
              <p>
                {isLoading
                  ? '신규 정책 정보를 조회하고 있습니다.'
                  : `${insights.newCount}건의 최근 갱신 정책을 확인했습니다.`}
              </p>
            </div>
          </InsightCard>
          <a href="#welfare-section" className="panel_link">
            복지 리스트 보기 <ArrowRight size={17} />
          </a>
        </HeroPanel>
      </HeroInner>
    </HeroWrapper>
  );
}
