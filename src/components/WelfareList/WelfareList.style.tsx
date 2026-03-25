'use client';

import styled from 'styled-components';

export const ListWrapper = styled.section`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2.4rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

export const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .result_count {
    font-size: 1.4rem;
    color: #888;

    span {
      color: #2B5CE6;
      font-weight: 700;
    }
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem 0;
  gap: 1.6rem;

  .empty_icon { font-size: 4.8rem; }
  .empty_text {
    font-size: 1.6rem;
    color: #888;
    text-align: center;
  }
`;