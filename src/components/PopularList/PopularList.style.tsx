'use client';

import styled from 'styled-components';

export const PopularWrapper = styled.section`
  width: 100%;
  background: #ffffff;
  padding: 6rem 2rem;
  border-bottom: 1px solid #EDE8E0;
`;

export const PopularInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.4rem;
  flex-wrap: wrap;
  gap: 1.2rem;

  h2 {
    font-size: clamp(2rem, 3vw, 2.6rem);
    font-weight: 800;
    color: #1B2D38;
  }
`;

export const TabGroup = styled.div`
  display: flex;
  gap: 0.8rem;
`;

export const TabBtn = styled.button<{ $active: boolean }>`
  padding: 0.8rem 1.6rem;
  border-radius: 8px;
  border: 1.5px solid ${({ $active }) => $active ? '#2E9E7A' : '#D5CEC4'};
  background: ${({ $active }) => $active ? '#2E9E7A' : '#fff'};
  color: ${({ $active }) => $active ? '#fff' : '#6B6058'};
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

export const CardScroll = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.4rem;
  overflow-x: auto;
  padding-bottom: 0.4rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, minmax(240px, 1fr));
  }
`;

export const PopularCard = styled.div`
  background: #F7F4EF;
  border-radius: 14px;
  padding: 2rem;
  border: 1px solid #EDE8E0;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: #2E9E7A;
    background: #E8F4F0;
  }

  .card_rank {
    font-size: 1.3rem;
    font-weight: 800;
    color: #2E9E7A;
    margin-bottom: 0.8rem;
  }

  .card_title {
    font-size: 1.6rem;
    font-weight: 700;
    color: #1B2D38;
    line-height: 1.4;
    margin-bottom: 0.8rem;
  }

  .card_target {
    font-size: 1.3rem;
    color: #8A7F72;
  }
`;

export const UrgentBadge = styled.span`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: #FDECEA;
  color: #E74C3C;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.2rem 0.8rem;
  border-radius: 4px;
`;

export const NewBadge = styled.span`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: #E8F4F0;
  color: #2E9E7A;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.2rem 0.8rem;
  border-radius: 4px;
`;