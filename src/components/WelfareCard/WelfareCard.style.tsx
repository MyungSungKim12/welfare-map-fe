'use client';

import styled from 'styled-components';

export const CardWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #E8EEF8;
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2B5CE6;
    box-shadow: 0 4px 16px rgba(43, 92, 230, 0.1);
    transform: translateY(-2px);
  }
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const CardTitle = styled.h3`
  font-size: 1.7rem;
  font-weight: 700;
  color: #1A1A2E;
  line-height: 1.4;
  flex: 1;
`;

export const SaveButton = styled.button<{ $saved: boolean }>`
  flex-shrink: 0;
  background: none;
  border: none;
  font-size: 2.2rem;
  cursor: pointer;
  margin-left: 1rem;
  transition: transform 0.2s ease;

  &:hover { transform: scale(1.2); }
`;

export const CardDesc = styled.p`
  font-size: 1.4rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.4rem;
`;

export const BadgeRow = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

export const Badge = styled.span<{ $type: 'region' | 'target' | 'category' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 1rem;
  border-radius: 999px;
  font-size: 1.2rem;
  font-weight: 500;

  background: ${({ $type }) =>
    $type === 'region' ? '#F0F4FF' :
    $type === 'target' ? '#FFF4E8' : '#F0FFF4'};

  color: ${({ $type }) =>
    $type === 'region' ? '#2B5CE6' :
    $type === 'target' ? '#E67E22' : '#27AE60'};
`;