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
import { LocationInfo } from '@/hooks/useLocation';

export default function Home() {
  const { location, isLocating, detectLocation, setLocation } = useLocation();

  return (
    <main>
      <Navbar location={location} isLocating={isLocating} detectLocation={detectLocation} />
      <Hero />
      <LifeStage />
      <NoticeBanner />
      <PopularList />
      <WelfareSection location={location} isLocating={isLocating} detectLocation={detectLocation} setLocation={setLocation} />
      <Statistics />
      <Footer />
    </main>
  );
}