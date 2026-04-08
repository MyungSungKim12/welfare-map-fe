'use client';

import { useState, useEffect } from 'react';
import { SIDO_LIST, SIGUNGU_MAP } from '@/constants/region';
import { LocationInfo } from '@/hooks/useLocation';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Modal = styled.div`
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 560px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
`;

const ModalHeader = styled.div`
  padding: 2.4rem 2.4rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-size: 2rem;
    font-weight: 800;
    color: #1B2D38;
  }

  button {
    background: none;
    border: none;
    font-size: 2.4rem;
    color: #8A7F72;
    cursor: pointer;
    line-height: 1;
    padding: 0.4rem;
  }
`;

const GPSButton = styled.button<{ $loading: boolean }>`
  margin: 1.6rem 2.4rem;
  width: calc(100% - 4.8rem);
  padding: 1.4rem;
  background: ${({ $loading }) => $loading ? '#9CA3AF' : '#2E9E7A'};
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 700;
  cursor: ${({ $loading }) => $loading ? 'not-allowed' : 'pointer'};
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;

  &:hover:not(:disabled) { background: #247A5E; }
`;

const Divider = styled.div`
  margin: 0 2.4rem;
  border-top: 1px solid #EDE8E0;
  position: relative;
  text-align: center;

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    padding: 0 1rem;
    font-size: 1.3rem;
    color: #8A7F72;
  }
`;

const SelectArea = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  margin-top: 1.6rem;
`;

const SidoList = styled.div`
  width: 45%;
  border-right: 1px solid #EDE8E0;
  overflow-y: auto;
  padding: 0.8rem 0;
`;

const SigunguList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.8rem 0;
`;

const RegionItem = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 1.2rem 1.8rem;
  text-align: left;
  background: ${({ $active }) => $active ? '#E8F4F0' : 'transparent'};
  border: none;
  font-size: 1.5rem;
  font-weight: ${({ $active }) => $active ? '700' : '400'};
  color: ${({ $active }) => $active ? '#2E9E7A' : '#1B2D38'};
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #F7F4EF; }
`;

interface Props {
  current: LocationInfo;
  isLocating: boolean;
  onDetect: () => void;
  onSelect: (info: LocationInfo) => void;
  onClose: () => void;
}

export default function LocationModal({ current, isLocating, onDetect, onSelect, onClose }: Props) {
  const [selectedSido, setSelectedSido] = useState(
    SIDO_LIST.find((s) => s.code === current.sidoCd) ?? SIDO_LIST[0]
  );

  const sigunguList = SIGUNGU_MAP[selectedSido.code] ?? [];

  // 바깥 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSigunguSelect = async (sigungu: { code: string; name: string }) => {
    let lat: number | undefined;
    let lng: number | undefined;

    try {
      // 클라이언트 직접 호출 → 서버 API 프록시로 변경
      const keyword = `${selectedSido.name} ${sigungu.name}`;
      const res = await fetch(
        `/api/kakao/keyword?query=${encodeURIComponent(keyword)}`
      );
      const data = await res.json();
      if (data.lat && data.lng) {
        lat = data.lat;
        lng = data.lng;
      }
    } catch {
      // 좌표 없어도 지역 선택은 정상 동작
    }

    onSelect({
      sidoCd:      selectedSido.code,
      sigunguCd:   sigungu.code,
      sidoName:    selectedSido.name,
      sigunguName: sigungu.name,
      lat,
      lng,
    });
    onClose();
  };

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

        <SelectArea>
          <SidoList>
            {SIDO_LIST.map((sido) => (
              <RegionItem
                key={sido.code}
                $active={selectedSido.code === sido.code}
                onClick={() => setSelectedSido(sido)}
              >
                {sido.name.replace('특별시','').replace('광역시','').replace('특별자치시','').replace('특별자치도','').replace('도','')}
              </RegionItem>
            ))}
          </SidoList>

          <SigunguList>
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
      </Modal>
    </Overlay>
  );
}