'use client';

import styled from 'styled-components';

export const NavbarWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  min-height: 72px;
  background: rgba(255, 255, 255, 0.86);
  border-bottom: 1px solid rgba(220, 231, 225, 0.9);
  backdrop-filter: blur(18px);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1.6rem;
  padding: 1.2rem clamp(1.6rem, 4vw, 4rem);

  @media (max-width: 720px) {
    grid-template-columns: 1fr auto;
    min-height: auto;
  }
`;

export const Logo = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  justify-self: start;
  border: 0;
  background: transparent;
  color: var(--color-ink);
  cursor: pointer;

  .logo_mark {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--color-navy);
    color: #ffffff;
  }

  .logo_text {
    font-size: 2rem;
    font-weight: 800;
  }

  .logo_badge {
    padding: 0.35rem 0.7rem;
    border-radius: 999px;
    background: var(--color-teal-soft);
    color: var(--color-teal-dark);
    font-size: 1.15rem;
    font-weight: 800;
  }

  @media (max-width: 520px) {
    .logo_badge { display: none; }
  }
`;

export const LocationBadge = styled.button`
  justify-self: center;
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 1rem 1.5rem;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  background: #ffffff;
  color: var(--color-navy);
  font-size: 1.45rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.2s, color 0.2s, transform 0.2s;

  &:hover {
    border-color: var(--color-teal);
    color: var(--color-teal-dark);
    transform: translateY(-1px);
  }

  @media (max-width: 720px) {
    grid-column: 1 / -1;
    width: 100%;
    justify-content: center;
    order: 3;
  }
`;

export const NavRight = styled.div`
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

export const IconButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--color-line);
  background: #ffffff;
  color: var(--color-navy);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    border-color: var(--color-teal);
    color: var(--color-teal-dark);
  }
`;

export const SavedLink = styled.a`
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--color-line);
  background: #ffffff;
  color: var(--color-navy);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    border-color: var(--color-teal);
    color: var(--color-teal-dark);
  }

  .saved_badge {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 20px;
    height: 20px;
    padding: 0 0.45rem;
    border-radius: 999px;
    background: var(--color-teal);
    color: #ffffff;
    font-size: 1.05rem;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
`;

export const LoginButton = styled.button`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0 1.5rem;
  border: 0;
  border-radius: 12px;
  background: var(--color-teal);
  color: #ffffff;
  font-size: 1.45rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: var(--color-teal-dark);
    transform: translateY(-1px);
  }
`;
