'use client';

import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import LifeStage from '@/components/LifeStage';
import NoticeBanner from '@/components/NoticeBanner';
import PopularList from '@/components/PopularList';
import SavedSection from '@/components/SavedSection';
import WelfareSection from '@/components/WelfareSection';
import Statistics from '@/components/Statistics';
import Footer from '@/components/Footer';
import { useLocation } from '@/hooks/useLocation';
import { useWelfareData } from '@/hooks/useWelfareData';
import { useBookmarks } from '@/hooks/useBookmarks';
import { DEFAULT_FILTER } from '@/constants/data';
import { FilterType } from '@/types/welfare';
import { buildWelfareInsights } from '@/utils/welfareInsights';

export default function Home() {
  const { location, isLocating, detectLocation, setLocation } = useLocation();
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState<FilterType>(DEFAULT_FILTER);
  const welfareData = useWelfareData(filter, location, keyword);
  const bookmarks = useBookmarks();
  const welfareInsights = useMemo(
    () => buildWelfareInsights(welfareData.allItems),
    [welfareData.allItems],
  );

  const handleSearch = (kw: string) => {
    setKeyword(kw);
    document.getElementById('welfare-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearSearch = () => setKeyword('');

  return (
    <main>
      <Navbar
        location={location}
        isLocating={isLocating}
        detectLocation={detectLocation}
        savedCount={bookmarks.count}
      />
      <Hero
        location={location}
        insights={welfareInsights}
        isLoading={welfareData.isLoading}
        onSearch={handleSearch}
        onDetectLocation={detectLocation}
      />
      <LifeStage />
      <NoticeBanner insights={welfareInsights} isLoading={welfareData.isLoading} />
      <PopularList insights={welfareInsights} isLoading={welfareData.isLoading} />

      {keyword && (
        <section className="search-status" aria-live="polite">
          <div>
            <span>검색어</span>
            <strong>{keyword}</strong>
            <p>{location.sidoName} {location.sigunguName} 기준으로 관련 복지를 보여드릴게요.</p>
          </div>
          <button onClick={clearSearch}>검색 초기화</button>
        </section>
      )}

      <SavedSection
        bookmarks={bookmarks.bookmarks}
        onToggle={bookmarks.toggle}
        onClear={bookmarks.clear}
      />

      <div id="welfare-section">
        <WelfareSection
          location={location}
          isLocating={isLocating}
          detectLocation={detectLocation}
          setLocation={setLocation}
          filter={filter}
          onFilterChange={setFilter}
          welfareData={welfareData}
          savedIds={bookmarks.savedIds}
          onToggleSave={bookmarks.toggle}
        />
      </div>
      <Statistics insights={welfareInsights} isLoading={welfareData.isLoading} />
      <Footer />
    </main>
  );
}
