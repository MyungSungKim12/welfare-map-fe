'use client';

import styled from 'styled-components';

export const MapWrapper = styled.div`
  width: 100%;
  height: 480px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #EDE8E0;
  position: relative;
  background: #E8EEF0;

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
  gap: 0.6rem;
  z-index: 10;
`;

export const MapControlBtn = styled.button`
  width: 40px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #EDE8E0;
  border-radius: 8px;
  font-size: 1.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s;

  &:hover {
    background: #F7F4EF;
    border-color: #2E9E7A;
  }
`;

export const MyLocationBtn = styled.button`
  position: absolute;
  bottom: 1.6rem;
  right: 1.2rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 1.6rem;
  background: #2E9E7A;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(46,158,122,0.35);
  transition: all 0.2s;

  &:hover { background: #247A5E; }
  &:disabled { background: #9CA3AF; cursor: not-allowed; box-shadow: none; }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: #E8EEF0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  z-index: 5;

  .loading_text {
    font-size: 1.5rem;
    color: #8A7F72;
  }

  .loading_spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #EDE8E0;
    border-top-color: #2E9E7A;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const MarkerInfoBox = styled.div`
  position: absolute;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: #ffffff;
  border: 1px solid #EDE8E0;
  border-radius: 12px;
  padding: 1.4rem 2rem;
  min-width: 240px;
  max-width: 320px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);

  .info_category {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2E9E7A;
    margin-bottom: 0.4rem;
  }

  .info_name {
    font-size: 1.6rem;
    font-weight: 700;
    color: #1B2D38;
    margin-bottom: 0.4rem;
  }

  .info_address {
    font-size: 1.3rem;
    color: #8A7F72;
  }

  .info_close {
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
    background: none;
    border: none;
    font-size: 1.6rem;
    color: #8A7F72;
    cursor: pointer;
    line-height: 1;
  }
`;