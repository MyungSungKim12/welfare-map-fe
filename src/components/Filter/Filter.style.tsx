'use client';

import styled from 'styled-components';

export const FilterWrapper = styled.section`
  width: 100%;
  background: #ffffff;
  padding: 2rem 2.4rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

export const FilterTitle = styled.p`
  font-size: 1.3rem;
  font-weight: 500;
  color: #888;
  margin-bottom: 1.2rem;
  letter-spacing: 0.05em;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;

  .row_label {
    font-size: 1.3rem;
    color: #555;
    min-width: 40px;
    font-weight: 500;
  }
`;

export const FilterChip = styled.button<{ $active: boolean }>`
  padding: 0.7rem 1.4rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => $active ? '#2B5CE6' : '#E0E0E0'};
  background: ${({ $active }) => $active ? '#2B5CE6' : '#ffffff'};
  color: ${({ $active }) => $active ? '#ffffff' : '#555'};
  font-size: 1.4rem;
  font-weight: ${({ $active }) => $active ? '500' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2B5CE6;
    color: ${({ $active }) => $active ? '#ffffff' : '#2B5CE6'};
  }
`;

export const ResetButton = styled.button`
  margin-left: auto;
  padding: 0.6rem 1.2rem;
  border: none;
  background: none;
  color: #999;
  font-size: 1.3rem;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #555;
  }
`;