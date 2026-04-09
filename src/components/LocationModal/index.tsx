'use client';

import { useState, useMemo } from 'react';
import { SIDO_LIST, SIGUNGU_MAP } from '@/constants/region';
import { LocationInfo } from '@/hooks/useLocation';
import styled from 'styled-components';

// ── 스타일 ─────────────────────────────────────────────
const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  padding: 2rem;
`;

const Modal = styled.div`
  background: #ffffff;
  border-radius: 20px;
  width: 100%; max-width: 560px; max-height: 85vh;
  overflow: hidden;
  display: flex; flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
`;

const ModalHeader = styled.div`
  padding: 2.4rem 2.4rem 0;
  display: flex; align-items: center; justify-content: space-between;
  h3 { font-size: 2rem; font-weight: 800; color: #1B2D38; }
  button {
    background: none; border: none;
    font-size: 2.4rem; color: #8A7F72;
    cursor: pointer; line-height: 1; padding: 0.4rem;
  }
`;

const GPSButton = styled.button<{ $loading: boolean }>`
  margin: 1.6rem 2.4rem;
  width: calc(100% - 4.8rem);
  padding: 1.4rem;
  background: ${({ $loading }) => $loading ? '#9CA3AF' : '#2E9E7A'};
  border: none; border-radius: 12px;
  color: #ffffff; font-size: 1.6rem; font-weight: 700;
  cursor: ${({ $loading }) => $loading ? 'not-allowed' : 'pointer'};
  display: flex; align-items: center; justify-content: center; gap: 0.8rem;
  transition: background 0.2s;
  &:hover:not(:disabled) { background: #247A5E; }
`;

const Divider = styled.div`
  margin: 0 2.4rem;
  border-top: 1px solid #EDE8E0;
  position: relative; text-align: center;
  span {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: #fff; padding: 0 1rem;
    font-size: 1.3rem; color: #8A7F72;
  }
`;

const SearchBox = styled.div`
  margin: 1.4rem 2.4rem 0.8rem;
  position: relative;
  input {
    width: 100%; padding: 1rem 1.4rem 1rem 3.6rem;
    border: 1.5px solid #EDE8E0; border-radius: 10px;
    font-size: 1.4rem; color: #1B2D38;
    outline: none; box-sizing: border-box;
    &:focus { border-color: #2E9E7A; }
    &::placeholder { color: #C0B8B0; }
  }
  .search_icon {
    position: absolute; left: 1.2rem; top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem; pointer-events: none;
  }
  .clear_btn {
    position: absolute; right: 1rem; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    font-size: 1.4rem; color: #8A7F72;
    cursor: pointer; padding: 0.2rem;
  }
`;

const SelectArea = styled.div`
  display: flex; flex: 1; overflow: hidden;
  margin-top: 0.4rem;
`;

const SidoList = styled.div`
  width: 42%;
  border-right: 1px solid #EDE8E0;
  overflow-y: auto; padding: 0.8rem 0;
`;

const SigunguList = styled.div`
  flex: 1; overflow-y: auto; padding: 0.8rem 0;
`;

const RegionItem = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 1.1rem 1.6rem;
  text-align: left;
  background: ${({ $active }) => $active ? '#E8F4F0' : 'transparent'};
  border: none;
  font-size: 1.4rem;
  font-weight: ${({ $active }) => $active ? '700' : '400'};
  color: ${({ $active }) => $active ? '#2E9E7A' : '#1B2D38'};
  cursor: pointer; transition: background 0.15s;
  &:hover { background: #F7F4EF; }
`;

const SearchResultList = styled.div`
  flex: 1; overflow-y: auto; padding: 0.8rem 0;
`;

const SearchResultItem = styled.button`
  width: 100%;
  padding: 1.1rem 1.6rem;
  text-align: left;
  background: transparent; border: none;
  font-size: 1.4rem; color: #1B2D38;
  cursor: pointer; transition: background 0.15s;
  display: flex; flex-direction: column; gap: 0.2rem;
  &:hover { background: #F7F4EF; }
  .result_name { font-weight: 600; }
  .result_region { font-size: 1.2rem; color: #8A7F72; }
`;

const EmptySearch = styled.div`
  padding: 3rem 2rem;
  text-align: center;
  font-size: 1.4rem; color: #8A7F72;
`;

// ── 타입 ─────────────────────────────────────────────
interface Props {
  current:    LocationInfo;
  isLocating: boolean;
  onDetect:   () => void;
  onSelect:   (info: LocationInfo) => void;
  onClose:    () => void;
}

interface SearchResult {
  sidoCode:    string;
  sidoName:    string;
  sigunguCode: string;
  sigunguName: string;
  isAll:       boolean; // 시도 전체 여부
}

// ── 컴포넌트 ─────────────────────────────────────────
export default function LocationModal({ current, isLocating, onDetect, onSelect, onClose }: Props) {
  const [selectedSido, setSelectedSido] = useState(
    SIDO_LIST.find((s) => s.code === current.sidoCd) ?? SIDO_LIST[0]
  );
  const [searchQuery, setSearchQuery] = useState('');

  const sidoShortName = (name: string) =>
    name
      .replace('특별자치시', '').replace('특별자치도', '')
      .replace('특별시', '').replace('광역시', '').replace('도', '');

  // ── 검색 결과 계산 ────────────────────────────────
  const searchResults = useMemo<SearchResult[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResult[] = [];

    SIDO_LIST.forEach((sido) => {
      // 시도 이름 매칭 → 시도 전체 항목 추가
      if (sido.name.includes(q) || sidoShortName(sido.name).toLowerCase().includes(q)) {
        results.push({
          sidoCode: sido.code, sidoName: sido.name,
          sigunguCode: sido.code, sigunguName: '전체',
          isAll: true,
        });
      }

      // 시군구 이름 매칭
      const sigunguList = SIGUNGU_MAP[sido.code] ?? [];
      sigunguList.forEach((sg) => {
        if (sg.name.toLowerCase().includes(q)) {
          results.push({
            sidoCode: sido.code, sidoName: sido.name,
            sigunguCode: sg.code, sigunguName: sg.name,
            isAll: false,
          });
        }
      });
    });

    return results.slice(0, 20); // 최대 20개
  }, [searchQuery]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // ── 좌표 조회 후 선택 ─────────────────────────────
  const selectWithCoords = async (
    sidoCode: string, sidoName: string,
    sigunguCode: string, sigunguName: string
  ) => {
    let lat: number | undefined;
    let lng: number | undefined;

    try {
      const keyword = sigunguName === '전체' ? sidoName : `${sidoName} ${sigunguName}`;
      const res  = await fetch(`/api/kakao/keyword?query=${encodeURIComponent(keyword)}`);
      const data = await res.json();
      if (data.lat && data.lng) { lat = data.lat; lng = data.lng; }
    } catch {}

    onSelect({ sidoCd: sidoCode, sigunguCd: sigunguCode, sidoName, sigunguName, lat, lng });
    onClose();
  };

  // ── 시군구 선택 ───────────────────────────────────
  const handleSigunguSelect = (sigungu: { code: string; name: string }) => {
    selectWithCoords(selectedSido.code, selectedSido.name, sigungu.code, sigungu.name);
  };

  // ── 시도 전체 선택 ────────────────────────────────
  const handleSidoAllSelect = (sido: typeof SIDO_LIST[number]) => {
    selectWithCoords(sido.code, sido.name, sido.code, '전체');
  };

  const sigunguList = SIGUNGU_MAP[selectedSido.code] ?? [];
  const isSearching = searchQuery.trim().length > 0;

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal>
        <ModalHeader>
          <h3>📍 위치 선택</h3>
          <button onClick={onClose}>✕</button>
        </ModalHeader>

        <GPSButton $loading={isLocating} onClick={onDetect} disabled={isLocating}>
          {isLocating ? '⏳ 위치 찾는 중...' : '🎯 현재 위치 자동 감지'}
        </GPSButton>

        <Divider><span>또는 직접 선택</span></Divider>

        {/* 검색창 */}
        <SearchBox>
          <span className="search_icon">🔍</span>
          <input
            type="text"
            placeholder="지역명 검색 (예: 미추홀, 강남, 부산)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button className="clear_btn" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </SearchBox>

        {/* 검색 결과 or 시도/시군구 선택 */}
        {isSearching ? (
          <SearchResultList>
            {searchResults.length === 0 ? (
              <EmptySearch>'{searchQuery}' 검색 결과가 없습니다</EmptySearch>
            ) : (
              searchResults.map((r, i) => (
                <SearchResultItem
                  key={i}
                  onClick={() => selectWithCoords(r.sidoCode, r.sidoName, r.sigunguCode, r.sigunguName)}
                >
                  <span className="result_name">
                    {r.isAll ? `${sidoShortName(r.sidoName)} 전체` : r.sigunguName}
                  </span>
                  <span className="result_region">
                    {r.isAll ? r.sidoName : `${r.sidoName}`}
                  </span>
                </SearchResultItem>
              ))
            )}
          </SearchResultList>
        ) : (
          <SelectArea>
            {/* 시도 목록 */}
            <SidoList>
              {SIDO_LIST.map((sido) => (
                <RegionItem
                  key={sido.code}
                  $active={selectedSido.code === sido.code}
                  onClick={() => setSelectedSido(sido)}
                >
                  {sidoShortName(sido.name)}
                </RegionItem>
              ))}
            </SidoList>

            {/* 시군구 목록 */}
            <SigunguList>
              {/* 전체 항목 */}
              <RegionItem
                $active={current.sidoCd === selectedSido.code && current.sigunguName === '전체'}
                onClick={() => handleSidoAllSelect(selectedSido)}
                style={{ borderBottom: '1px solid #EDE8E0', fontWeight: 700, color: '#1B3A4B' }}
              >
                🌏 {sidoShortName(selectedSido.name)} 전체
              </RegionItem>

              {sigunguList.length === 0 ? (
                <p style={{ padding: '2rem', fontSize: '1.4rem', color: '#8A7F72' }}>
                  준비 중입니다
                </p>
              ) : (
                sigunguList.map((sigungu) => (
                  <RegionItem
                    key={sigungu.code}
                    $active={current.sigunguCd === sigungu.code && current.sidoCd === selectedSido.code}
                    onClick={() => handleSigunguSelect(sigungu)}
                  >
                    {sigungu.name}
                  </RegionItem>
                ))
              )}
            </SigunguList>
          </SelectArea>
        )}
      </Modal>
    </Overlay>
  );
}