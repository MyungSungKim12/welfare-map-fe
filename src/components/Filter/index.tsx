'use client';

import { AGE_GROUP_OPTIONS, SITUATION_OPTIONS, DEFAULT_FILTER } from '@/constants/data';
import { FilterType } from '@/types/welfare';
import { LocationInfo } from '@/hooks/useLocation';
import {
  FilterWrapper, LocationCard, FilterCard, FilterCardTitle,
  FilterSection, ChipGrid, Chip, ResetButton,
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
        <p className="loc_label">현재 위치</p>
        <p className="loc_value">{location.sigunguName}</p>
        <span className="loc_change" onClick={onLocationClick}>
          위치 변경하기 →
        </span>
      </LocationCard>

      <FilterCard>
        <FilterCardTitle>맞춤 복지 찾기</FilterCardTitle>

        <FilterSection>
          <p className="filter_label">👤 나이대</p>
          <ChipGrid>
            {AGE_GROUP_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                $active={filter.ageGroup === opt.value}
                onClick={() => onFilterChange({ ...filter, ageGroup: opt.value })}
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
                $active={filter.situation === opt.value}
                onClick={() => onFilterChange({ ...filter, situation: opt.value })}
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