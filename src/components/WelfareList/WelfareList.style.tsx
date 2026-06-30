'use client';

import styled from 'styled-components';

export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .list-stack {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .skeleton-card {
    min-height: 132px;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    padding: 1.4rem;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-md);
    background: var(--color-surface);
  }

  .skeleton-card span {
    height: 14px;
    border-radius: 999px;
    background: linear-gradient(90deg, #edf1ee 25%, #dfe5e0 50%, #edf1ee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }

  .skeleton-card span:nth-child(1) { width: 78%; }
  .skeleton-card span:nth-child(2) { width: 56%; }
  .skeleton-card span:nth-child(3) { width: 40%; }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding-top: 0.4rem;
    flex-wrap: wrap;
  }

  .pagination button {
    min-height: 36px;
    min-width: 36px;
    padding: 0 0.85rem;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-sm);
    background: #ffffff;
    color: var(--color-muted);
    font-size: 1.22rem;
    font-weight: 800;
    cursor: pointer;
  }

  .pagination button.active {
    background: var(--color-secondary);
    color: #ffffff;
    border-color: var(--color-secondary);
  }

  .pagination button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const ListHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;

  .eyebrow {
    color: var(--color-primary);
    font-size: 1.12rem;
    font-weight: 800;
    margin-bottom: 0.25rem;
  }

  .result_count {
    color: var(--color-muted);
    font-size: 1.32rem;
    font-weight: 700;

    span {
      color: var(--color-primary);
      font-size: 1.62rem;
      font-weight: 800;
    }
  }

  button {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1rem;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-sm);
    background: #ffffff;
    color: var(--color-secondary);
    font-size: 1.22rem;
    font-weight: 800;
    cursor: pointer;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-height: 190px;
  gap: 0.75rem;
  padding: 1.8rem;
  background: var(--color-surface-subtle);
  border-radius: var(--radius-md);
  border: 1px dashed var(--color-line-strong);

  .empty_title {
    color: var(--color-ink);
    font-size: 1.65rem;
    font-weight: 800;
  }

  .empty_text {
    color: var(--color-muted);
    font-size: 1.35rem;
    line-height: 1.6;
  }

  button {
    margin-top: 0.5rem;
    min-height: 42px;
    padding: 0 1.25rem;
    border: 0;
    border-radius: var(--radius-sm);
    background: var(--color-primary);
    color: #ffffff;
    font-size: 1.32rem;
    font-weight: 800;
    cursor: pointer;
  }
`;
