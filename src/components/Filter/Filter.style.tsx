'use client';

import styled from 'styled-components';

export const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

export const LocationCard = styled.div`
  padding: 1.35rem;
  border-bottom: 1px solid var(--color-line);
  background: var(--color-secondary);
  color: #ffffff;

  .loc_label {
    color: rgba(255, 255, 255, 0.62);
    font-size: 1.12rem;
    font-weight: 800;
    margin-bottom: 0.45rem;
  }

  .loc_value {
    color: #ffffff;
    font-size: 1.55rem;
    font-weight: 800;
    line-height: 1.35;
    margin-bottom: 1rem;
  }

  .loc_change {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    padding: 0 1rem;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: var(--radius-sm);
    background: rgba(255, 255, 255, 0.08);
    color: #d8eee7;
    font-size: 1.22rem;
    font-weight: 800;
    cursor: pointer;
  }
`;

export const FilterCard = styled.div`
  padding: 1.35rem;
  border-bottom: 1px solid var(--color-line);
  background: var(--color-surface);

  &:last-child {
    border-bottom: 0;
  }
`;

export const FilterCardTitle = styled.p`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--color-ink);
  font-size: 1.45rem;
  font-weight: 800;
  margin-bottom: 1.25rem;
`;

export const FilterSection = styled.div`
  margin-bottom: 1.4rem;

  .filter_label {
    color: var(--color-muted);
    font-size: 1.15rem;
    font-weight: 800;
    margin-bottom: 0.7rem;
  }
`;

export const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`;

export const Chip = styled.button<{ $active: boolean }>`
  min-height: 36px;
  padding: 0 0.95rem;
  border-radius: var(--radius-sm);
  border: 1px solid ${({ $active }) => ($active ? 'rgba(36, 91, 79, 0.5)' : 'var(--color-line)')};
  background: ${({ $active }) => ($active ? 'var(--color-info-soft)' : '#ffffff')};
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-muted)')};
  font-size: 1.22rem;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    border-color: rgba(36, 91, 79, 0.42);
  }
`;

export const ResetButton = styled.button`
  width: 100%;
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-sm);
  background: var(--color-surface-subtle);
  color: var(--color-secondary);
  font-size: 1.25rem;
  font-weight: 800;
  cursor: pointer;
`;
