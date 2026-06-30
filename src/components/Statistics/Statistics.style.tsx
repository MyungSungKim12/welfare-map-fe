'use client';

import styled from 'styled-components';

export const StatWrapper = styled.section`
  width: 100%;
  padding: 1.8rem clamp(1.4rem, 3.2vw, 3.2rem) 3.2rem;
`;

export const StatInner = styled.div`
  width: min(1240px, 100%);
  margin: 0 auto;
  padding: 1.6rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
`;

export const SectionHeader = styled.div`
  max-width: 760px;
  margin-bottom: 1.4rem;

  span {
    color: var(--color-primary);
    font-size: 1.2rem;
    font-weight: 800;
  }

  h2 {
    margin-top: 0.35rem;
    color: var(--color-ink);
    font-size: clamp(2rem, 2.6vw, 2.7rem);
    font-weight: 800;
  }

  p {
    margin-top: 0.7rem;
    color: var(--color-muted);
    font-size: 1.42rem;
    line-height: 1.65;
  }
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.9rem;
  margin-bottom: 0.9rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatCard = styled.article`
  min-height: 128px;
  padding: 1.35rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  background: var(--color-surface-subtle);

  .stat_icon {
    width: 38px;
    height: 38px;
    border-radius: var(--radius-sm);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    background: var(--color-info-soft);
    color: var(--color-primary);
  }

  .stat_number {
    color: var(--color-ink);
    font-size: 2.6rem;
    font-weight: 800;
  }

  .stat_label {
    margin-top: 0.35rem;
    color: var(--color-muted);
    font-size: 1.24rem;
    font-weight: 700;
  }
`;

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.9rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const CategoryBar = styled.article`
  padding: 1.2rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  background: #ffffff;

  .cat_label {
    color: var(--color-ink);
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 0.8rem;
  }

  .cat_bar_wrap {
    height: 7px;
    overflow: hidden;
    border-radius: 999px;
    background: var(--color-surface-muted);
    margin-bottom: 0.7rem;
  }

  .cat_bar_fill {
    height: 100%;
    border-radius: 999px;
    background: var(--color-primary);
  }

  .cat_count {
    color: var(--color-muted);
    font-size: 1.15rem;
    font-weight: 700;
  }
`;
