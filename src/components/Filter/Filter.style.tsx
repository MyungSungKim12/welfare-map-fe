'use client';

import styled from 'styled-components';

export const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

export const LocationCard = styled.div`
  background: #1B3A4B;
  border-radius: 14px;
  padding: 2rem;
  color: #ffffff;

  .loc_label {
    font-size: 1.3rem;
    color: rgba(255,255,255,0.55);
    margin-bottom: 0.6rem;
  }

  .loc_value {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .loc_change {
    font-size: 1.3rem;
    color: #4DD9AC;
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const FilterCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #EDE8E0;
  padding: 2rem;
`;

export const FilterCardTitle = styled.p`
  font-size: 1.3rem;
  font-weight: 600;
  color: #8A7F72;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1.8rem;
`;

export const FilterSection = styled.div`
  margin-bottom: 1.8rem;

  &:last-child { margin-bottom: 0; }

  .filter_label {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1B2D38;
    margin-bottom: 1rem;
  }
`;

export const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
`;

export const Chip = styled.button<{ $active: boolean }>`
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  border: 1.5px solid ${({ $active }) => $active ? '#1B3A4B' : '#D5CEC4'};
  background: ${({ $active }) => $active ? '#1B3A4B' : '#ffffff'};
  color: ${({ $active }) => $active ? '#ffffff' : '#6B6058'};
  font-size: 1.4rem;
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1B3A4B;
    color: ${({ $active }) => $active ? '#ffffff' : '#1B3A4B'};
  }
`;

export const ResetButton = styled.button`
  width: 100%;
  margin-top: 1.6rem;
  padding: 1.1rem;
  border: 1.5px solid #D5CEC4;
  border-radius: 8px;
  background: #ffffff;
  color: #8A7F72;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #1B3A4B;
    color: #1B3A4B;
  }
`;