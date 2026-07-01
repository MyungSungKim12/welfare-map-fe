'use client';

import { useState } from 'react';
import { ArrowRight, BrainCircuit, CalendarClock, CheckCircle2, ClipboardList, LocateFixed, Search, Sparkles } from 'lucide-react';
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
  promptSuggestions: string[];
  hasProfile: boolean;
  onSearch: (keyword: string) => void;
  onDetectLocation: () => void;
}

export default function Hero({
  location,
  insights,
  isLoading,
  promptSuggestions,
  hasProfile,
  onSearch,
  onDetectLocation,
}: Props) {
  const [query, setQuery] = useState('');
  const urgentTitle = insights.urgentItems[0]?.title;
  const newTitle = insights.newItems[0]?.title;

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <HeroWrapper>
      <HeroInner>
        <HeroCopy>
          <HeroEyebrow>
            <BrainCircuit size={17} />
            AI welfare concierge
          </HeroEyebrow>
          <HeroTitle>
            말하듯 입력하면,
            <br />
            받을 수 있는 혜택만 추려드려요.
          </HeroTitle>
          <HeroSubtitle>
            {location.sidoName} {location.sigunguName} 기준으로 사용자 조건, 위치, 공공 API 결과를 조합해
            복지 후보와 추천 근거를 함께 보여주는 AI 검색 워크스페이스입니다.
          </HeroSubtitle>

          <HeroActions>
            <HeroSearchBar>
              <Search size={20} />
              <input
                type="text"
                placeholder="예: 강남구 사는 29살 청년인데 나한테 맞는 혜택 찾아줘"
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

          <div className="prompt-suggestions" aria-label="AI 추천 프롬프트">
            <div className="prompt-head">
              <Sparkles size={16} />
              <span>{hasProfile ? '회원정보 기반 추천 질문' : '바로 써볼 수 있는 질문'}</span>
            </div>
            <div className="prompt-list">
              {promptSuggestions.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setQuery(prompt);
                    onSearch(prompt);
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

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
            <div>
              <span>API orchestration</span>
              <strong>{location.sigunguName} 추천 파이프라인</strong>
            </div>
          </div>
          <InsightCard $tone="urgent">
            <CalendarClock size={22} />
            <div>
              <span>마감 점검</span>
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
          <InsightCard $tone="default">
            <ClipboardList size={22} />
            <div>
              <span>신청 준비</span>
              <strong>관심 있는 정책은 저장해두고 다음 단계에서 조건을 확인하세요.</strong>
              <p>로그인 연동 후에는 저장 항목과 신청 체크리스트를 계정 기준으로 이어갈 예정입니다.</p>
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
