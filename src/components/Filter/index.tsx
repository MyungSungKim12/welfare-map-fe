'use client';

import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { AGE_GROUP_OPTIONS, SITUATION_OPTIONS, DEFAULT_FILTER } from '@/constants/data';
import { FilterType } from '@/types/welfare';
import { LocationInfo } from '@/hooks/useLocation';
import {
  FilterWrapper,
  LocationCard,
  FilterCard,
  FilterCardTitle,
  FilterSection,
  ChipGrid,
  Chip,
  ResetButton,
} from './Filter.style';

interface Props {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  location: LocationInfo;
  onLocationClick: () => void;
}

export default function Filter({ filter, onFilterChange, location, onLocationClick }: Props) {
  const handleReset = () => onFilterChange({ ...DEFAULT_FILTER });

  return (
    <FilterWrapper>
      <LocationCard>
        <p className="loc_label">현재 기준 위치</p>
        <p className="loc_value">{location.sidoName} {location.sigunguName}</p>
        <button type="button" className="loc_change" onClick={onLocationClick}>
          위치 변경
        </button>
      </LocationCard>

      <FilterCard>
        <FilterCardTitle>
          <SlidersHorizontal size={17} />
          맞춤 조건
        </FilterCardTitle>

        <FilterSection>
          <p className="filter_label">생애주기</p>
          <ChipGrid>
            {AGE_GROUP_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                $active={filter.ageGroup === opt.value}
                onClick={() => onFilterChange({ ...filter, ageGroup: opt.value })}
                type="button"
              >
                {opt.label}
              </Chip>
            ))}
          </ChipGrid>
        </FilterSection>

        <FilterSection>
          <p className="filter_label">생활 상황</p>
          <ChipGrid>
            {SITUATION_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                $active={filter.situation === opt.value}
                onClick={() => onFilterChange({ ...filter, situation: opt.value })}
                type="button"
              >
                {opt.label}
              </Chip>
            ))}
          </ChipGrid>
        </FilterSection>

        <ResetButton onClick={handleReset} type="button">
          <RotateCcw size={15} />
          조건 초기화
        </ResetButton>
      </FilterCard>
    </FilterWrapper>
  );
}
