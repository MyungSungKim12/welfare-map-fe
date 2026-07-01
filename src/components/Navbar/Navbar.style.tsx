'use client';

import styled from 'styled-components';

export const NavbarWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  min-height: 76px;
  padding: 1.2rem clamp(1.4rem, 3.2vw, 3.4rem);
  border-bottom: 1px solid rgba(229, 225, 216, 0.72);
  background: rgba(247, 247, 245, 0.78);
  backdrop-filter: blur(22px);
  display: grid;
  grid-template-columns: auto minmax(180px, 1fr) auto;
  align-items: center;
  gap: 1.2rem;

  @media (max-width: 760px) {
    grid-template-columns: 1fr auto;
    align-items: start;
  }
`;

export const Logo = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  min-height: 44px;
  border: 0;
  background: transparent;
  color: var(--color-ink);
  cursor: pointer;

  .logo_mark {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #111315;
    color: #ffffff;
  }

  .logo_text {
    font-size: 2rem;
    font-weight: 850;
  }

  .logo_badge {
    padding: 0.32rem 0.68rem;
    border-radius: 999px;
    background: #ede9df;
    color: #5d6470;
    font-size: 1.1rem;
    font-weight: 800;
  }

  @media (max-width: 520px) {
    .logo_badge {
      display: none;
    }
  }
`;

export const LocationBadge = styled.button`
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  max-width: 360px;
  padding: 0 1.2rem;
  border: 1px solid var(--color-line-strong);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.76);
  color: var(--color-ink);
  font-size: 1.35rem;
  font-weight: 800;
  cursor: pointer;
  transition: border-color 0.18s, color 0.18s, background 0.18s;

  &:hover {
    border-color: rgba(36, 91, 79, 0.42);
    color: var(--color-primary);
    background: var(--color-surface-subtle);
  }

  @media (max-width: 760px) {
    grid-column: 1 / -1;
    width: 100%;
    max-width: none;
    justify-content: center;
    order: 3;
  }
`;

export const NavRight = styled.div`
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

export const IconButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  background: rgba(255, 255, 255, 0.76);
  color: var(--color-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.18s, color 0.18s, background 0.18s;

  &:hover {
    border-color: rgba(36, 91, 79, 0.42);
    color: var(--color-primary);
    background: var(--color-surface-subtle);
  }
`;

export const SavedLink = styled.a`
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  background: rgba(255, 255, 255, 0.76);
  color: var(--color-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    border-color: rgba(36, 91, 79, 0.42);
    color: var(--color-primary);
  }

  .saved_badge {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 20px;
    height: 20px;
    padding: 0 0.45rem;
    border-radius: 999px;
    background: var(--color-primary);
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
  gap: 0.65rem;
  padding: 0 1.3rem;
  border: 1px solid var(--color-secondary);
  border-radius: 999px;
  background: #111315;
  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s;

  &:hover {
    border-color: var(--color-primary-dark);
    background: var(--color-primary-dark);
  }

  @media (max-width: 520px) {
    padding: 0 1rem;
  }
`;
