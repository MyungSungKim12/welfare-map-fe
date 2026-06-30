'use client';

import { useState } from 'react';
import { ListChecks, MapPinned } from 'lucide-react';
import Filter from '@/components/Filter';
import WelfareList from '@/components/WelfareList';
import Map from '@/components/Map';
import LocationModal from '@/components/LocationModal';
import { FilterType } from '@/types/welfare';
import { LocationInfo } from '@/hooks/useLocation';
import { UseWelfareDataReturn } from '@/hooks/useWelfareData';

interface Props {
  location: LocationInfo;
  isLocating: boolean;
  detectLocation: () => void;
  setLocation: (info: LocationInfo) => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  welfareData: UseWelfareDataReturn;
}

export default function WelfareSection({
  location,
  isLocating,
  detectLocation,
  setLocation,
  filter,
  onFilterChange,
  welfareData,
}: Props) {
  const [showModal, setShowModal] = useState(false);

  const handleDetect = async () => {
    await detectLocation();
    setShowModal(false);
  };

  return (
    <>
      <section className="welfare-workspace">
        <div className="workspace-header">
          <div>
            <span>지역 복지 탐색</span>
            <h2>지도와 리스트를 함께 보며 지원 후보를 좁혀보세요</h2>
            <p>현재 위치와 선택 조건을 기준으로 지역 복지와 전국 공통 복지를 함께 조회합니다.</p>
          </div>
          <div className="workspace-summary">
            <strong>{welfareData.isLoading ? '-' : welfareData.allItems.length}</strong>
            <span>조회된 지원 후보</span>
          </div>
        </div>

        <div className="workspace-grid">
          <aside className="workspace-filter">
            <Filter
              filter={filter}
              onFilterChange={onFilterChange}
              location={location}
              onLocationClick={() => setShowModal(true)}
            />
          </aside>

          <div className="workspace-main">
            <div className="map-panel">
              <div className="panel-title">
                <MapPinned size={18} />
                내 주변 지도
              </div>
              <Map location={location} items={welfareData.allItems} />
            </div>

            <div className="list-panel">
              <div className="panel-title">
                <ListChecks size={18} />
                지원 후보 목록
              </div>
              <WelfareList data={welfareData} />
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <LocationModal
          current={location}
          isLocating={isLocating}
          onDetect={handleDetect}
          onSelect={(info) => { setLocation(info); setShowModal(false); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
