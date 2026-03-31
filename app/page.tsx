import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import LifeStage from '@/components/LifeStage';
import NoticeBanner from '@/components/NoticeBanner';
import PopularList from '@/components/PopularList';
import Map from '@/components/Map';
import Filter from '@/components/Filter';
import WelfareList from '@/components/WelfareList';
import Statistics from '@/components/Statistics';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <LifeStage />
      <NoticeBanner />
      <PopularList />

      {/* 지도 섹션 */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 0' }}>
        <Map />
      </section>

      {/* 필터 + 리스트 섹션 */}
      <section style={{
        display: 'flex',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 2rem 4rem',
        gap: '2.8rem',
      }}>
        <aside style={{ width: '280px', flexShrink: 0 }}>
          <Filter />
        </aside>
        <div style={{ flex: 1, minWidth: 0 }}>
          <WelfareList />
        </div>
      </section>

      <Statistics />
      <Footer />
    </main>
  );
}