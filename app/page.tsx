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
import WelfareSection from '@/components/WelfareSection';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <LifeStage />
      <NoticeBanner />
      <PopularList />
      <WelfareSection />
      <Statistics />
      <Footer />
    </main>
  );
}