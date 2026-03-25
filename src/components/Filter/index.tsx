'use client';

import { useState } from 'react';
import { AGE_GROUP_OPTIONS, SITUATION_OPTIONS, DEFAULT_FILTER } from '@/constants/data';
import {
  FilterWrapper, LocationCard, FilterCard, FilterCardTitle,
  FilterSection, ChipGrid, Chip, ResetButton,
} from './Filter.style';

export default function Filter() {
  const [ageGroup, setAgeGroup] = useState<string>(DEFAULT_FILTER.ageGroup);
  const [situation, setSituation] = useState<string>(DEFAULT_FILTER.situation);

  const handleReset = () => {
    setAgeGroup('all');
    setSituation('all');
  };

  return (
    <FilterWrapper>
      <LocationCard>
        <p className="loc_label">현재 위치</p>
        <p className="loc_value">인천 미추홀구</p>
        <span className="loc_change">위치 변경하기 →</span>
      </LocationCard>

      <FilterCard>
        <FilterCardTitle>맞춤 복지 찾기</FilterCardTitle>

        <FilterSection>
          <p className="filter_label">👤 나이대</p>
          <ChipGrid>
            {AGE_GROUP_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                $active={ageGroup === opt.value}
                onClick={() => setAgeGroup(opt.value)}
              >
                {opt.label}
              </Chip>
            ))}
          </ChipGrid>
        </FilterSection>

        <FilterSection>
          <p className="filter_label">💡 상황</p>
          <ChipGrid>
            {SITUATION_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                $active={situation === opt.value}
                onClick={() => setSituation(opt.value)}
              >
                {opt.label}
              </Chip>
            ))}
          </ChipGrid>
        </FilterSection>

        <ResetButton onClick={handleReset}>필터 초기화</ResetButton>
      </FilterCard>
    </FilterWrapper>
  );
}