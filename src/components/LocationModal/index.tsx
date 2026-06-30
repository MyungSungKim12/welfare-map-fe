'use client';

import { useMemo, useState, type MouseEvent } from 'react';
import { LocateFixed, MapPin, Search, X } from 'lucide-react';
import styled from 'styled-components';
import { LocationInfo } from '@/hooks/useLocation';

interface Props {
  current: LocationInfo;
  isLocating: boolean;
  onDetect: () => void;
  onSelect: (info: LocationInfo) => void;
  onClose: () => void;
}

interface RegionOption {
  code: string;
  name: string;
  lat?: number;
  lng?: number;
}

interface RegionGroup extends RegionOption {
  shortName: string;
  districts: RegionOption[];
}

interface SearchResult {
  sido: RegionGroup;
  district?: RegionOption;
}

const REGION_GROUPS: RegionGroup[] = [
  {
    code: '11',
    name: '서울특별시',
    shortName: '서울',
    lat: 37.5665,
    lng: 126.978,
    districts: [
      { code: '11680', name: '강남구', lat: 37.5172, lng: 127.0473 },
      { code: '11110', name: '종로구', lat: 37.5735, lng: 126.9788 },
      { code: '11440', name: '마포구', lat: 37.5663, lng: 126.9019 },
      { code: '11590', name: '동작구', lat: 37.5124, lng: 126.9393 },
    ],
  },
  {
    code: '28',
    name: '인천광역시',
    shortName: '인천',
    lat: 37.4563,
    lng: 126.7052,
    districts: [
      { code: '28177', name: '미추홀구', lat: 37.4636, lng: 126.6503 },
      { code: '28185', name: '연수구', lat: 37.4101, lng: 126.6784 },
      { code: '28237', name: '부평구', lat: 37.507, lng: 126.7219 },
      { code: '28245', name: '계양구', lat: 37.5373, lng: 126.7377 },
      { code: '28260', name: '서구', lat: 37.5455, lng: 126.6759 },
    ],
  },
  {
    code: '41',
    name: '경기도',
    shortName: '경기',
    lat: 37.4138,
    lng: 127.5183,
    districts: [
      { code: '41110', name: '수원시', lat: 37.2636, lng: 127.0286 },
      { code: '41130', name: '성남시', lat: 37.42, lng: 127.1265 },
      { code: '41280', name: '고양시', lat: 37.6584, lng: 126.832 },
      { code: '41190', name: '부천시', lat: 37.5034, lng: 126.766 },
      { code: '41460', name: '용인시', lat: 37.2411, lng: 127.1776 },
    ],
  },
  {
    code: '26',
    name: '부산광역시',
    shortName: '부산',
    lat: 35.1796,
    lng: 129.0756,
    districts: [
      { code: '26350', name: '해운대구', lat: 35.1631, lng: 129.1635 },
      { code: '26500', name: '수영구', lat: 35.1456, lng: 129.1131 },
      { code: '26230', name: '부산진구', lat: 35.1629, lng: 129.0532 },
    ],
  },
  {
    code: '27',
    name: '대구광역시',
    shortName: '대구',
    lat: 35.8714,
    lng: 128.6014,
    districts: [
      { code: '27260', name: '수성구', lat: 35.8584, lng: 128.6306 },
      { code: '27110', name: '중구', lat: 35.8694, lng: 128.6062 },
      { code: '27290', name: '달서구', lat: 35.8299, lng: 128.5327 },
    ],
  },
  {
    code: '30',
    name: '대전광역시',
    shortName: '대전',
    lat: 36.3504,
    lng: 127.3845,
    districts: [
      { code: '30170', name: '서구', lat: 36.3554, lng: 127.3838 },
      { code: '30200', name: '유성구', lat: 36.3623, lng: 127.3562 },
      { code: '30110', name: '동구', lat: 36.312, lng: 127.4548 },
    ],
  },
  {
    code: '29',
    name: '광주광역시',
    shortName: '광주',
    lat: 35.1595,
    lng: 126.8526,
    districts: [
      { code: '29170', name: '북구', lat: 35.174, lng: 126.9119 },
      { code: '29200', name: '광산구', lat: 35.1395, lng: 126.7937 },
      { code: '29140', name: '서구', lat: 35.152, lng: 126.8895 },
    ],
  },
  {
    code: '31',
    name: '울산광역시',
    shortName: '울산',
    lat: 35.5384,
    lng: 129.3114,
    districts: [
      { code: '31140', name: '남구', lat: 35.5438, lng: 129.3301 },
      { code: '31170', name: '동구', lat: 35.5048, lng: 129.4167 },
      { code: '31200', name: '북구', lat: 35.5827, lng: 129.3612 },
    ],
  },
  {
    code: '36',
    name: '세종특별자치시',
    shortName: '세종',
    lat: 36.4801,
    lng: 127.289,
    districts: [],
  },
  {
    code: '50',
    name: '제주특별자치도',
    shortName: '제주',
    lat: 33.4996,
    lng: 126.5312,
    districts: [
      { code: '50110', name: '제주시', lat: 33.4996, lng: 126.5312 },
      { code: '50130', name: '서귀포시', lat: 33.2541, lng: 126.56 },
    ],
  },
];

export default function LocationModal({ current, isLocating, onDetect, onSelect, onClose }: Props) {
  const [selectedSidoCode, setSelectedSidoCode] = useState(
    () => REGION_GROUPS.find((sido) => sido.code === current.sidoCd)?.code ?? REGION_GROUPS[0].code
  );
  const [searchQuery, setSearchQuery] = useState('');

  const selectedSido = REGION_GROUPS.find((sido) => sido.code === selectedSidoCode) ?? REGION_GROUPS[0];

  const searchResults = useMemo<SearchResult[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return REGION_GROUPS.flatMap((sido) => {
      const matched: SearchResult[] = [];
      const sidoMatches = sido.name.toLowerCase().includes(query) || sido.shortName.toLowerCase().includes(query);

      if (sidoMatches) matched.push({ sido });

      sido.districts.forEach((district) => {
        if (district.name.toLowerCase().includes(query)) matched.push({ sido, district });
      });

      return matched;
    }).slice(0, 18);
  }, [searchQuery]);

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const selectRegion = async (sido: RegionGroup, district?: RegionOption) => {
    let lat = district?.lat ?? sido.lat;
    let lng = district?.lng ?? sido.lng;
    const sigunguName = district?.name ?? '전체';
    const sigunguCd = district?.code ?? sido.code;

    try {
      const query = district ? `${sido.name} ${district.name}` : sido.name;
      const response = await fetch(`/api/kakao/keyword?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (typeof data.lat === 'number' && typeof data.lng === 'number') {
        lat = data.lat;
        lng = data.lng;
      }
    } catch {
      // 프리셋 좌표가 있으므로 지도 이동은 계속 가능하다.
    }

    onSelect({
      sidoCd: sido.code,
      sigunguCd,
      sidoName: sido.name,
      sigunguName,
      lat,
      lng,
    });
    onClose();
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal role="dialog" aria-modal="true" aria-labelledby="location-modal-title">
        <ModalHeader>
          <div>
            <span>지역 설정</span>
            <h3 id="location-modal-title">어느 지역 복지를 볼까요?</h3>
          </div>
          <button type="button" onClick={onClose} title="닫기" aria-label="닫기">
            <X size={20} />
          </button>
        </ModalHeader>

        <CurrentRegion>
          <MapPin size={17} />
          현재 설정: {current.sidoName} {current.sigunguName}
        </CurrentRegion>

        <DetectButton type="button" $loading={isLocating} onClick={onDetect} disabled={isLocating}>
          <LocateFixed size={18} />
          {isLocating ? '현재 위치 확인 중' : '현재 위치로 자동 설정'}
        </DetectButton>

        <SearchBox>
          <Search size={17} />
          <input
            type="search"
            placeholder="지역명 검색 예: 미추홀, 강남, 부산"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} aria-label="검색어 지우기">
              <X size={16} />
            </button>
          )}
        </SearchBox>

        {isSearching ? (
          <SearchResultList>
            {searchResults.length === 0 ? (
              <EmptySearch>
                <strong>{searchQuery}</strong>
                <span>검색 결과가 없습니다</span>
              </EmptySearch>
            ) : (
              searchResults.map((result) => (
                <SearchResultItem
                  key={`${result.sido.code}-${result.district?.code ?? 'all'}`}
                  type="button"
                  onClick={() => selectRegion(result.sido, result.district)}
                >
                  <span>{result.district ? result.district.name : `${result.sido.shortName} 전체`}</span>
                  <small>{result.sido.name}</small>
                </SearchResultItem>
              ))
            )}
          </SearchResultList>
        ) : (
          <SelectArea>
            <SidoList>
              {REGION_GROUPS.map((sido) => (
                <RegionButton
                  key={sido.code}
                  type="button"
                  $active={selectedSido.code === sido.code}
                  onClick={() => setSelectedSidoCode(sido.code)}
                >
                  {sido.shortName}
                </RegionButton>
              ))}
            </SidoList>

            <DistrictList>
              <RegionButton
                type="button"
                $active={current.sidoCd === selectedSido.code && current.sigunguName === '전체'}
                onClick={() => selectRegion(selectedSido)}
              >
                {selectedSido.shortName} 전체
              </RegionButton>

              {selectedSido.districts.map((district) => (
                <RegionButton
                  key={district.code}
                  type="button"
                  $active={current.sidoCd === selectedSido.code && current.sigunguCd === district.code}
                  onClick={() => selectRegion(selectedSido, district)}
                >
                  {district.name}
                </RegionButton>
              ))}

              {selectedSido.districts.length === 0 && (
                <EmptyDistrict>세종은 전체 지역으로 조회합니다.</EmptyDistrict>
              )}
            </DistrictList>
          </SelectArea>
        )}
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(23, 32, 28, 0.42);
  backdrop-filter: blur(6px);
`;

const Modal = styled.div`
  width: min(620px, 100%);
  max-height: min(780px, 90vh);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-lg);
  background: #ffffff;
  box-shadow: var(--shadow-md);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.4rem;
  padding: 2.4rem 2.4rem 1.1rem;

  span {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-primary);
    font-size: 1.22rem;
    font-weight: 800;
  }

  h3 {
    color: var(--color-ink);
    font-size: 2.35rem;
    font-weight: 800;
    line-height: 1.25;
  }

  button {
    width: 42px;
    height: 42px;
    min-height: 42px;
    border: 0;
    border-radius: 999px;
    background: var(--color-surface-muted);
    color: var(--color-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;

const CurrentRegion = styled.p`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin: 0 2.4rem 1.4rem;
  padding: 1rem 1.2rem;
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
  color: var(--color-secondary);
  font-size: 1.35rem;
  font-weight: 800;
`;

const DetectButton = styled.button<{ $loading: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  min-height: 50px;
  margin: 0 2.4rem 1.4rem;
  border: 0;
  border-radius: var(--radius-md);
  background: ${({ $loading }) => ($loading ? '#9aa8a3' : 'var(--color-primary)')};
  color: #ffffff;
  font-size: 1.48rem;
  font-weight: 800;
  cursor: ${({ $loading }) => ($loading ? 'wait' : 'pointer')};
  box-shadow: 0 14px 30px rgba(20, 134, 109, 0.2);
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 0 2.4rem 1.2rem;
  padding: 0 1.1rem;
  min-height: 50px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  background: #ffffff;

  svg {
    flex: 0 0 auto;
    color: var(--color-muted);
  }

  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    color: var(--color-ink);
    font-size: 1.45rem;
    font-weight: 700;

    &::placeholder {
      color: #98a7a1;
      font-weight: 600;
    }
  }

  button {
    width: 32px;
    height: 32px;
    min-height: 32px;
    border: 0;
    border-radius: 999px;
    background: var(--color-surface-muted);
    color: var(--color-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;

const SelectArea = styled.div`
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  flex: 1;
  min-height: 360px;
  overflow: hidden;
  border-top: 1px solid var(--color-line);

  @media (max-width: 560px) {
    grid-template-columns: 128px minmax(0, 1fr);
  }
`;

const SidoList = styled.div`
  overflow-y: auto;
  padding: 1rem;
  border-right: 1px solid var(--color-line);
  background: var(--color-surface-subtle);
`;

const DistrictList = styled.div`
  overflow-y: auto;
  padding: 1rem;
  background: #ffffff;
`;

const RegionButton = styled.button<{ $active: boolean }>`
  width: 100%;
  min-height: 44px;
  margin-bottom: 0.6rem;
  padding: 0 1.2rem;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(20, 134, 109, 0.35)' : 'transparent')};
  border-radius: var(--radius-sm);
  background: ${({ $active }) => ($active ? 'var(--color-info-soft)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-ink)')};
  font-size: 1.4rem;
  font-weight: ${({ $active }) => ($active ? 800 : 700)};
  text-align: left;
  cursor: pointer;

  &:hover {
    background: var(--color-surface-muted);
  }
`;

const SearchResultList = styled.div`
  flex: 1;
  min-height: 360px;
  overflow-y: auto;
  padding: 0.8rem 1.4rem 1.4rem;
  border-top: 1px solid var(--color-line);
`;

const SearchResultItem = styled.button`
  width: 100%;
  min-height: 62px;
  margin-top: 0.6rem;
  padding: 1rem 1.2rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  background: #ffffff;
  text-align: left;
  cursor: pointer;

  span {
    display: block;
    color: var(--color-ink);
    font-size: 1.48rem;
    font-weight: 800;
  }

  small {
    display: block;
    margin-top: 0.35rem;
    color: var(--color-muted);
    font-size: 1.22rem;
    font-weight: 700;
  }

  &:hover {
    border-color: rgba(20, 134, 109, 0.34);
    background: var(--color-surface-muted);
  }
`;

const EmptySearch = styled.div`
  display: flex;
  min-height: 220px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  color: var(--color-muted);

  strong {
    color: var(--color-ink);
    font-size: 1.6rem;
  }

  span {
    font-size: 1.35rem;
    font-weight: 700;
  }
`;

const EmptyDistrict = styled.p`
  padding: 1.4rem;
  color: var(--color-muted);
  font-size: 1.35rem;
  font-weight: 700;
`;
