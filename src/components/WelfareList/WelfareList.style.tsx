'use client';

import styled from 'styled-components';

export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  .list-stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .skeleton-card {
    min-height: 150px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    border: 1px solid var(--color-line);
    border-radius: 18px;
    background: #ffffff;
  }

  .skeleton-card span {
    height: 16px;
    border-radius: 999px;
    background: linear-gradient(90deg, #edf2ef 25%, #dfe8e3 50%, #edf2ef 75%);
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
    gap: 0.6rem;
    padding-top: 0.6rem;
    flex-wrap: wrap;
  }

  .pagination button {
    min-height: 38px;
    min-width: 38px;
    padding: 0 1rem;
    border: 1px solid var(--color-line);
    border-radius: 10px;
    background: #ffffff;
    color: var(--color-muted);
    font-size: 1.3rem;
    font-weight: 800;
    cursor: pointer;
  }

  .pagination button.active {
    background: var(--color-navy);
    color: #ffffff;
    border-color: var(--color-navy);
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
    color: var(--color-teal-dark);
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 0.3rem;
  }

  .result_count {
    color: var(--color-muted);
    font-size: 1.45rem;
    font-weight: 700;

    span {
      color: var(--color-teal-dark);
      font-size: 1.75rem;
      font-weight: 800;
    }
  }

  button {
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1.1rem;
    border: 1px solid var(--color-line);
    border-radius: 999px;
    background: #ffffff;
    color: var(--color-navy);
    font-size: 1.3rem;
    font-weight: 800;
    cursor: pointer;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-height: 220px;
  gap: 0.8rem;
  padding: 2.2rem;
  background: #ffffff;
  border-radius: 18px;
  border: 1px dashed var(--color-line);

  .empty_title {
    color: var(--color-ink);
    font-size: 1.8rem;
    font-weight: 800;
  }

  .empty_text {
    color: var(--color-muted);
    font-size: 1.45rem;
    line-height: 1.6;
  }

  button {
    margin-top: 0.6rem;
    min-height: 42px;
    padding: 0 1.4rem;
    border: 0;
    border-radius: 12px;
    background: var(--color-teal);
    color: #ffffff;
    font-size: 1.4rem;
    font-weight: 800;
    cursor: pointer;
  }
`;
