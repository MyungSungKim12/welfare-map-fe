'use client';

import { useState } from 'react';
import { AGE_GROUP_OPTIONS, SITUATION_OPTIONS, DEFAULT_FILTER } from '@/constants/data';
import {
  FilterWrapper, FilterTitle, FilterGroup,
  FilterRow, FilterChip, ResetButton,
} from './Filter.style';

export default function Filter() {
  const [ageGroup, setAgeGroup] = useState(DEFAULT_FILTER.ageGroup);
  const [situation, setSituation] = useState(DEFAULT_FILTER.situation);

  const handleReset = () => {
    setAgeGroup('all');
    setSituation('all');
  };

  return (
    <FilterWrapper>
      <FilterTitle>맞춤 복지 찾기</FilterTitle>
      <FilterGroup>
        <FilterRow>
          <span className="row_label">나이</span>
          {AGE_GROUP_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              $active={ageGroup === opt.value}
              onClick={() => setAgeGroup(opt.value)}
            >
              {opt.label}
            </FilterChip>
          ))}
        </FilterRow>

        <FilterRow>
          <span className="row_label">상황</span>
          {SITUATION_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              $active={situation === opt.value}
              onClick={() => setSituation(opt.value)}
            >
              {opt.label}
            </FilterChip>
          ))}
          <ResetButton onClick={handleReset}>초기화</ResetButton>
        </FilterRow>
      </FilterGroup>
    </FilterWrapper>
  );
}