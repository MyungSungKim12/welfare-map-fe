'use client';

import styled from 'styled-components';

export const StatWrapper = styled.section`
  width: 100%;
  padding: 5rem clamp(1.6rem, 4vw, 4rem);
  background: var(--color-navy);
`;

export const StatInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

export const SectionHeader = styled.div`
  max-width: 720px;
  margin-bottom: 2.6rem;

  span {
    color: #7ee0c7;
    font-size: 1.3rem;
    font-weight: 800;
  }

  h2 {
    margin-top: 0.5rem;
    color: #ffffff;
    font-size: clamp(2.2rem, 3.2vw, 3.2rem);
    font-weight: 800;
  }

  p {
    margin-top: 0.9rem;
    color: rgba(255, 255, 255, 0.68);
    font-size: 1.55rem;
    line-height: 1.7;
  }
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
  margin-bottom: 1.2rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatCard = styled.article`
  min-height: 160px;
  padding: 1.8rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.07);

  .stat_icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    background: rgba(126, 224, 199, 0.14);
    color: #7ee0c7;
  }

  .stat_number {
    color: #ffffff;
    font-size: 3rem;
    font-weight: 800;
  }

  .stat_label {
    margin-top: 0.45rem;
    color: rgba(255, 255, 255, 0.66);
    font-size: 1.35rem;
    font-weight: 700;
  }
`;

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.2rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const CategoryBar = styled.article`
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);

  .cat_label {
    color: #ffffff;
    font-size: 1.35rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }

  .cat_bar_wrap {
    height: 8px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    margin-bottom: 0.8rem;
  }

  .cat_bar_fill {
    height: 100%;
    border-radius: 999px;
    background: #7ee0c7;
  }

  .cat_count {
    color: rgba(255, 255, 255, 0.62);
    font-size: 1.25rem;
    font-weight: 700;
  }
`;
