'use client';

import styled from 'styled-components';

export const CardWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #EDE8E0;
  border-radius: 14px;
  padding: 2.2rem 2.4rem;
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2E9E7A;
    box-shadow: 0 4px 16px rgba(46, 158, 122, 0.1);
    transform: translateY(-2px);
  }
`;

export const CardLeft = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: 600;
  background: #E8EEF6;
  color: #1B3A4B;
  margin-bottom: 1rem;
`;

export const CardTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1B2D38;
  line-height: 1.4;
  margin-bottom: 0.8rem;
`;

export const CardDesc = styled.p`
  font-size: 1.4rem;
  color: #6B6058;
  line-height: 1.65;
  margin-bottom: 1.4rem;
`;

export const BadgeRow = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

export const Badge = styled.span<{ $type: 'region' | 'target' | 'period' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 1.1rem;
  border-radius: 6px;
  font-size: 1.3rem;
  font-weight: 500;

  background: ${({ $type }) =>
    $type === 'region' ? '#E8F4F0' :
    $type === 'target' ? '#FEF3E8' : '#F5F0FF'};

  color: ${({ $type }) =>
    $type === 'region' ? '#1A6B52' :
    $type === 'target' ? '#B05A1A' : '#5B3FB0'};
`;

export const CardRight = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const SaveBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1.5px solid #EDE8E0;
  background: #ffffff;
  font-size: 1.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    border-color: #2E9E7A;
  }
`;

export const DetailBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: none;
  background: #2E9E7A;
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover { background: #247A5E; }
`;