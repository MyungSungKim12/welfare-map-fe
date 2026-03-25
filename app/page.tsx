import Navbar from '@/components/Navbar';
import Filter from '@/components/Filter';
import WelfareList from '@/components/WelfareList';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Filter />
      <WelfareList />
    </main>
  );
}