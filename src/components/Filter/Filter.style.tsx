'use client';

import styled from 'styled-components';

export const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const LocationCard = styled.div`
  padding: 1.7rem;
  border-radius: 18px;
  background: var(--color-navy);
  color: #ffffff;

  .loc_label {
    color: rgba(255, 255, 255, 0.58);
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 0.6rem;
  }

  .loc_value {
    color: #ffffff;
    font-size: 1.75rem;
    font-weight: 800;
    line-height: 1.35;
    margin-bottom: 1.2rem;
  }

  .loc_change {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    padding: 0 1.1rem;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: #7ee0c7;
    font-size: 1.3rem;
    font-weight: 800;
    cursor: pointer;
  }
`;

export const FilterCard = styled.div`
  padding: 1.7rem;
  border: 1px solid var(--color-line);
  border-radius: 18px;
  background: #ffffff;
`;

export const FilterCardTitle = styled.p`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--color-ink);
  font-size: 1.55rem;
  font-weight: 800;
  margin-bottom: 1.6rem;
`;

export const FilterSection = styled.div`
  margin-bottom: 1.7rem;

  .filter_label {
    color: var(--color-muted);
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 0.8rem;
  }
`;

export const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
`;

export const Chip = styled.button<{ $active: boolean }>`
  min-height: 38px;
  padding: 0 1.1rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-teal)' : 'var(--color-line)')};
  background: ${({ $active }) => ($active ? 'var(--color-teal)' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : 'var(--color-muted)')};
  font-size: 1.32rem;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    border-color: var(--color-teal);
  }
`;

export const ResetButton = styled.button`
  width: 100%;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border: 1px solid var(--color-line);
  border-radius: 12px;
  background: var(--color-surface-soft);
  color: var(--color-navy);
  font-size: 1.35rem;
  font-weight: 800;
  cursor: pointer;
`;
