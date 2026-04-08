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
    // 검색 시 WelfareSection으로 스크롤
    document.getElementById('welfare-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      <Navbar location={location} isLocating={isLocating} detectLocation={detectLocation} />
      <Hero onSearch={handleSearch} onDetectLocation={detectLocation} />
      <LifeStage />
      <NoticeBanner />
      <PopularList />
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