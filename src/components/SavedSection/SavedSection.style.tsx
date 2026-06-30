'use client';

import styled from 'styled-components';

export const SavedWrapper = styled.section`
  width: min(1240px, calc(100% - 4rem));
  margin: 0 auto;
  padding: 0 0 2.4rem;

  @media (max-width: 768px) {
    width: min(100% - 2.4rem, 1240px);
  }
`;

export const SavedHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  padding: 1.2rem 1.4rem;
  border: 1px solid var(--color-line);
  border-bottom: 0;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  background: var(--color-surface-subtle);

  .header_left {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    h2 {
      color: var(--color-ink);
      font-size: 1.8rem;
      font-weight: 800;
    }

    span.count {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      padding: 0 0.7rem;
      border-radius: 999px;
      background: var(--color-info-soft);
      color: var(--color-primary);
      font-size: 1.12rem;
      font-weight: 800;
    }
  }

  button.clear_btn {
    appearance: none;
    border: 1px solid var(--color-line);
    background: #ffffff;
    color: var(--color-muted);
    border-radius: var(--radius-sm);
    padding: 0.45rem 1rem;
    font-size: 1.18rem;
    font-weight: 800;
    cursor: pointer;

    &:hover {
      color: var(--color-danger);
      border-color: rgba(184, 74, 58, 0.5);
    }
  }
`;

export const SavedStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem;
  border: 1px solid var(--color-line);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  background: var(--color-surface);
`;
