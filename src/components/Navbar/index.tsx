'use client';

import { useEffect, useState } from 'react';
import { NavbarWrapper, Logo, LocationBadge, NavRight, LoginButton } from './Navbar.style';
import { LocationInfo } from '@/hooks/useLocation';

interface Props {
  location: LocationInfo;
  isLocating: boolean;
  detectLocation: () => void;
}

const STORAGE_KEY = 'welfare_location';

export default function Navbar({ location, isLocating, detectLocation }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 위치 변경 시 localStorage 저장
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    } catch {}
  }, [location, mounted]);

  const displayName = `${location.sidoName.slice(0, 2)} ${location.sigunguName}`;

  return (
    <NavbarWrapper>
      <Logo>
        <span className="logo_icon">🗺️</span>
        <span className="logo_text">복지맵</span>
      </Logo>

      <LocationBadge
        onClick={detectLocation}
        style={{ cursor: 'pointer' }}
        title="클릭하면 현재 위치로 자동 감지"
      >
        <span className="location_icon">📍</span>
        {isLocating ? '위치 감지 중...' : displayName}
      </LocationBadge>

      <NavRight>
        <LoginButton>로그인</LoginButton>
      </NavRight>
    </NavbarWrapper>
  );
}