'use client';

import styled from 'styled-components';

export const StatWrapper = styled.section`
  width: 100%;
  background: #F7F4EF;
  padding: 6rem 2rem;
  border-bottom: 1px solid #EDE8E0;
`;

export const StatInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  h2 {
    font-size: clamp(2.2rem, 3vw, 3rem);
    font-weight: 800;
    color: #1B2D38;
    margin-bottom: 0.8rem;
  }

  p { font-size: 1.6rem; color: #8A7F72; }
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.6rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 2.4rem;
  border: 1px solid #EDE8E0;
  text-align: center;

  .stat_icon { font-size: 2.8rem; margin-bottom: 1rem; }

  .stat_number {
    font-size: 3.2rem;
    font-weight: 800;
    color: #2E9E7A;
    margin-bottom: 0.4rem;
  }

  .stat_label {
    font-size: 1.4rem;
    color: #8A7F72;
    font-weight: 500;
  }
`;

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const CategoryBar = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.8rem;
  border: 1px solid #EDE8E0;

  .cat_label {
    font-size: 1.4rem;
    font-weight: 700;
    color: #1B2D38;
    margin-bottom: 1rem;
  }

  .cat_bar_wrap {
    background: #EDE8E0;
    border-radius: 4px;
    height: 8px;
    overflow: hidden;
    margin-bottom: 0.6rem;
  }

  .cat_bar_fill {
    height: 100%;
    background: #2E9E7A;
    border-radius: 4px;
    transition: width 0.8s ease;
  }

  .cat_count {
    font-size: 1.3rem;
    color: #8A7F72;
  }
`;