'use client';

import styled from 'styled-components';

export const MapWrapper = styled.div`
  width: 100%;
  height: 440px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--color-line);
  position: relative;
  background: var(--color-surface-soft);

  @media (max-width: 768px) {
    height: 320px;
  }
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const MapControls = styled.div`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  z-index: 10;
`;

export const MapControlBtn = styled.button`
  width: 42px;
  height: 42px;
  border: 1px solid var(--color-line);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--color-navy);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
`;

export const MyLocationBtn = styled.button`
  position: absolute;
  bottom: 1.4rem;
  right: 1.2rem;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 44px;
  padding: 0 1.4rem;
  border: 0;
  border-radius: 999px;
  background: var(--color-teal);
  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(20, 134, 109, 0.24);

  &:disabled {
    opacity: 0.72;
    cursor: wait;
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: var(--color-surface-soft);

  .loading_text {
    color: var(--color-muted);
    font-size: 1.45rem;
    font-weight: 700;
  }

  .loading_spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #d7e5de;
    border-top-color: var(--color-teal);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const MarkerInfoBox = styled.div`
  position: absolute;
  left: 50%;
  bottom: 5.2rem;
  z-index: 10;
  width: min(340px, calc(100% - 2.4rem));
  transform: translateX(-50%);
  padding: 1.6rem;
  border: 1px solid var(--color-line);
  border-radius: 18px;
  background: #ffffff;
  box-shadow: var(--shadow-md);

  .info_category {
    color: var(--color-teal-dark);
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    padding-right: 2.6rem;
  }

  .info_name {
    color: var(--color-ink);
    font-size: 1.65rem;
    font-weight: 800;
    line-height: 1.4;
    margin-bottom: 0.5rem;
    padding-right: 2.6rem;
  }

  .info_address {
    color: var(--color-muted);
    font-size: 1.32rem;
    font-weight: 700;
  }

  .info_close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 34px;
    height: 34px;
    min-height: 34px;
    border: 0;
    border-radius: 999px;
    background: var(--color-surface-soft);
    color: var(--color-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .info_phone {
    margin-top: 0.5rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-muted);
    font-size: 1.3rem;
    font-weight: 700;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 1rem;
    color: var(--color-teal-dark);
    font-size: 1.35rem;
    font-weight: 800;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

export const FacilityBadge = styled.div`
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
  z-index: 10;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid var(--color-line);
  color: var(--color-navy);
  font-size: 1.25rem;
  font-weight: 800;
  box-shadow: var(--shadow-sm);
`;
