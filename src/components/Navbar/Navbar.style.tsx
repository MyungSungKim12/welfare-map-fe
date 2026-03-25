'use client';

import styled from 'styled-components';

export const NavbarWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  padding: 0 2.4rem;
  justify-content: space-between;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;

  .logo_icon {
    font-size: 2.4rem;
  }

  .logo_text {
    font-size: 2rem;
    font-weight: 700;
    color: #2B5CE6;
    letter-spacing: -0.02em;
  }
`;

export const LocationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.4rem;
  background: #F0F4FF;
  border: 1px solid #D0DCFF;
  border-radius: 999px;
  font-size: 1.4rem;
  color: #2B5CE6;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #E0EAFF;
  }

  .location_icon {
    font-size: 1.6rem;
  }
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

export const LoginButton = styled.button`
  padding: 0.8rem 2rem;
  border: 1px solid #2B5CE6;
  border-radius: 8px;
  background: transparent;
  color: #2B5CE6;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2B5CE6;
    color: #ffffff;
  }
`;