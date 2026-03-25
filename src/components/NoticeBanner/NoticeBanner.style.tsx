'use client';

import styled from 'styled-components';

export const BannerWrapper = styled.section`
  width: 100%;
  background: #F7F4EF;
  padding: 3rem 2rem;
  border-bottom: 1px solid #EDE8E0;
`;

export const BannerInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.6rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const BannerCard = styled.div<{ $type: 'new' | 'urgent' | 'guide' }>`
  display: flex;
  align-items: center;
  gap: 1.4rem;
  padding: 1.8rem 2rem;
  background: #ffffff;
  border-radius: 12px;
  border-left: 4px solid ${({ $type }) =>
    $type === 'new' ? '#2E9E7A' :
    $type === 'urgent' ? '#E74C3C' : '#F39C12'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

  .banner_icon { font-size: 2.4rem; flex-shrink: 0; }

  .banner_content {
    .banner_badge {
      display: inline-block;
      font-size: 1.1rem;
      font-weight: 700;
      padding: 0.2rem 0.8rem;
      border-radius: 4px;
      margin-bottom: 0.4rem;
      background: ${({ $type }) =>
        $type === 'new' ? '#E8F4F0' :
        $type === 'urgent' ? '#FDECEA' : '#FEF3E8'};
      color: ${({ $type }) =>
        $type === 'new' ? '#2E9E7A' :
        $type === 'urgent' ? '#E74C3C' : '#F39C12'};
    }

    .banner_title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1B2D38;
      line-height: 1.4;
    }

    .banner_desc {
      font-size: 1.3rem;
      color: #8A7F72;
      margin-top: 0.2rem;
    }
  }
`;