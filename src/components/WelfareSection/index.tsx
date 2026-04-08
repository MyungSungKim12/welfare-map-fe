'use client';

import { useState } from 'react';
import Filter from '@/components/Filter';
import WelfareList from '@/components/WelfareList';
import Map from '@/components/Map';
import LocationModal from '@/components/LocationModal';
import { FilterType } from '@/types/welfare';
import { DEFAULT_FILTER } from '@/constants/data';
import { LocationInfo } from '@/hooks/useLocation';

interface Props {
  location: LocationInfo;
  isLocating: boolean;
  detectLocation: () => void;
  setLocation: (info: LocationInfo) => void;
}

export default function WelfareSection({ location, isLocating, detectLocation, setLocation }: Props) {
  const [filter,     setFilter]     = useState<FilterType>(DEFAULT_FILTER);
  const [showModal,  setShowModal]  = useState(false);

  const handleDetect = async () => {
    await detectLocation();
    setShowModal(false);
  };

  return (
    <>
      {/* 지도 — 위치 + items 전달 */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 0' }}>
        <Map location={location} />
      </section>

      {/* 필터 + 리스트 */}
      <section style={{
        display: 'flex',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 2rem 4rem',
        gap: '2.8rem',
      }}>
        <aside style={{ width: '280px', flexShrink: 0 }}>
          <Filter
            filter={filter}
            onFilterChange={setFilter}
            location={location}
            onLocationClick={() => setShowModal(true)}
          />
        </aside>
        <div style={{ flex: 1, minWidth: 0 }}>
          <WelfareList filter={filter} location={location} />
        </div>
      </section>

      {/* 위치 선택 모달 */}
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