'use client';

import styled from 'styled-components';

export const SavedWrapper = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  padding: 3.2rem 2.4rem 0;

  @media (max-width: 768px) {
    padding: 2.4rem 1.6rem 0;
  }
`;

export const SavedHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 1.6rem;

  .header_left {
    display: flex;
    align-items: center;
    gap: 0.8rem;

    h2 {
      color: var(--color-ink);
      font-size: 2.2rem;
      font-weight: 800;
    }

    span.count {
      display: inline-flex;
      align-items: center;
      min-height: 26px;
      padding: 0 0.8rem;
      border-radius: 999px;
      background: var(--color-teal-soft);
      color: var(--color-teal-dark);
      font-size: 1.2rem;
      font-weight: 800;
    }
  }

  button.clear_btn {
    appearance: none;
    border: 1px solid var(--color-line);
    background: #ffffff;
    color: var(--color-muted);
    border-radius: 999px;
    padding: 0.5rem 1.2rem;
    font-size: 1.25rem;
    font-weight: 700;
    cursor: pointer;

    &:hover {
      color: var(--color-red);
      border-color: var(--color-red);
    }
  }
`;

export const SavedStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;
