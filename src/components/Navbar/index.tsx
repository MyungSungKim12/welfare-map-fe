'use client';

import { NavbarWrapper, Logo, LocationBadge, NavRight, LoginButton } from './Navbar.style';

export default function Navbar() {
  return (
    <NavbarWrapper>
      <Logo>
        <span className="logo_icon">🗺️</span>
        <span className="logo_text">복지맵</span>
      </Logo>

      <LocationBadge>
        <span className="location_icon">📍</span>
        인천 미추홀구
      </LocationBadge>

      <NavRight>
        <LoginButton>로그인</LoginButton>
      </NavRight>
    </NavbarWrapper>
  );
}