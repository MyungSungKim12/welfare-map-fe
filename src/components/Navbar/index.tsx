'use client';

import { Bell, LogIn, MapPin, Radar } from 'lucide-react';
import { NavbarWrapper, Logo, LocationBadge, NavRight, LoginButton, IconButton } from './Navbar.style';
import { LocationInfo } from '@/hooks/useLocation';

interface Props {
  location: LocationInfo;
  isLocating: boolean;
  detectLocation: () => void;
}

export default function Navbar({ location, isLocating, detectLocation }: Props) {
  const displayName = `${location.sidoName.replace('광역시', '').replace('특별시', '')} ${location.sigunguName}`;

  return (
    <NavbarWrapper>
      <Logo aria-label="WelfareMap 홈">
        <span className="logo_mark"><Radar size={20} /></span>
        <span className="logo_text">WelfareMap</span>
        <span className="logo_badge">AI 레이더</span>
      </Logo>

      <LocationBadge
        onClick={detectLocation}
        title="현재 위치로 다시 찾기"
        type="button"
      >
        <MapPin size={17} />
        {isLocating ? '위치 확인 중' : displayName}
      </LocationBadge>

      <NavRight>
        <IconButton type="button" title="알림">
          <Bell size={18} />
        </IconButton>
        <LoginButton type="button">
          <LogIn size={17} />
          로그인
        </LoginButton>
      </NavRight>
    </NavbarWrapper>
  );
}
