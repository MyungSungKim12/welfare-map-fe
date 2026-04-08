'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import LifeStage from '@/components/LifeStage';
import NoticeBanner from '@/components/NoticeBanner';
import PopularList from '@/components/PopularList';
import WelfareSection from '@/components/WelfareSection';
import Statistics from '@/components/Statistics';
import Footer from '@/components/Footer';
import { useLocation } from '@/hooks/useLocation';

export default function Home() {
  const { location, isLocating, detectLocation, setLocation } = useLocation();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (kw: string) => {
    setKeyword(kw);
    document.getElementById('welfare-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      <Navbar location={location} isLocating={isLocating} detectLocation={detectLocation} />
      <Hero onSearch={handleSearch} onDetectLocation={detectLocation} />
      <LifeStage />
      <NoticeBanner />
      <PopularList />

      {/* 검색어 활성 배너 */}
      {keyword && (
        <div style={{
          background: '#E8F4F0', borderTop: '1px solid #2E9E7A',
          padding: '1rem 2rem', textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
        }}>
          <span style={{ fontSize: '1.5rem', color: '#1B3A4B' }}>
            🔍 <strong>"{keyword}"</strong> 검색 결과 — {location.sidoName.slice(0,2)} {location.sigunguName} 기준
          </span>
          <button
            onClick={() => setKeyword('')}
            style={{
              padding: '0.4rem 1.2rem', background: '#2E9E7A', color: '#fff',
              border: 'none', borderRadius: '6px', fontSize: '1.3rem', cursor: 'pointer',
            }}
          >
            ✕ 검색 초기화
          </button>
        </div>
      )}

      <div id="welfare-section">
        <WelfareSection
          location={location}
          isLocating={isLocating}
          detectLocation={detectLocation}
          setLocation={setLocation}
          keyword={keyword}
        />
      </div>
      <Statistics />
      <Footer />
    </main>
  );
}