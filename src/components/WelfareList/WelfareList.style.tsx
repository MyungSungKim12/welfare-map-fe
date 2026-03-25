'use client';

import styled from 'styled-components';

export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

export const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;

  .result_count {
    font-size: 1.5rem;
    color: #6B6058;

    span {
      color: #2E9E7A;
      font-weight: 700;
      font-size: 1.7rem;
    }
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  gap: 0.6rem;
`;

export const ViewBtn = styled.button<{ $active: boolean }>`
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  border: 1.5px solid ${({ $active }) => $active ? '#1B3A4B' : '#D5CEC4'};
  background: ${({ $active }) => $active ? '#1B3A4B' : '#ffffff'};
  color: ${({ $active }) => $active ? '#ffffff' : '#6B6058'};
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem 0;
  gap: 1.6rem;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #EDE8E0;

  .empty_icon { font-size: 4.8rem; }
  .empty_text {
    font-size: 1.6rem;
    color: #8A7F72;
    text-align: center;
    line-height: 1.6;
  }
`;