'use client';

import { useState } from 'react';
import {
  HeroWrapper, HeroInner, HeroTitle, HeroSubtitle,
  HeroSearchBar, HeroCTA, HeroStats,
} from './Hero.style';

interface Props {
  onSearch:       (keyword: string) => void;
  onDetectLocation: () => void;
}

export default function Hero({ onSearch, onDetectLocation }: Props) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <HeroWrapper>
      <HeroInner>
        <HeroTitle>
          내 주변 복지,<br />
          <span>한눈에</span> 찾아보세요
        </HeroTitle>
        <HeroSubtitle>
          지역과 상황에 맞는 복지 서비스를<br />
          쉽고 빠르게 확인하세요
        </HeroSubtitle>

        <HeroSearchBar>
          <input
            type="text"
            placeholder="복지 서비스명을 검색하세요 (예: 청년, 노인 건강검진)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch}>검색</button>
        </HeroSearchBar>

        <HeroCTA onClick={onDetectLocation}>
          📍 지금 내 위치로 복지 찾기
        </HeroCTA>

        <HeroStats>
          <div className="stat_item">
            <span className="stat_number">12,000+</span>
            <span className="stat_label">전국 복지 서비스</span>
          </div>
          <div className="stat_item">
            <span className="stat_number">250+</span>
            <span className="stat_label">지원 지역</span>
          </div>
          <div className="stat_item">
            <span className="stat_number">6가지</span>
            <span className="stat_label">생애주기 맞춤</span>
          </div>
        </HeroStats>
      </HeroInner>
    </HeroWrapper>
  );
}