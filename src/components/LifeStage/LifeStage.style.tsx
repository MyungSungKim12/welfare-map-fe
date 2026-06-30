'use client';

import styled from 'styled-components';

export const LifeStageWrapper = styled.section`
  width: 100%;
  padding: 0 clamp(1.4rem, 3.2vw, 3.2rem) 2.4rem;
`;

export const LifeStageInner = styled.div`
  width: min(1240px, 100%);
  margin: 0 auto;
  padding: 1.4rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 1.1rem;

  span {
    color: var(--color-primary);
    font-size: 1.2rem;
    font-weight: 800;
  }

  h2 {
    margin-top: 0.25rem;
    color: var(--color-ink);
    font-size: clamp(1.8rem, 2.2vw, 2.3rem);
    font-weight: 800;
  }

  p {
    max-width: 520px;
    color: var(--color-muted);
    font-size: 1.32rem;
    line-height: 1.55;
    text-align: right;
  }

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;

    p {
      text-align: left;
    }
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.8rem;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 620px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StageCard = styled.button`
  min-height: 86px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 0.9rem;
  padding: 1.1rem;
  background: var(--color-surface-subtle);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s;

  .stage_icon {
    width: 38px;
    height: 38px;
    border-radius: var(--radius-sm);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--color-info-soft);
    color: var(--color-primary);
  }

  .stage_label {
    display: block;
    color: var(--color-ink);
    font-size: 1.45rem;
    font-weight: 800;
    text-align: left;
  }

  .stage_desc {
    display: block;
    margin-top: 0.2rem;
    color: var(--color-muted);
    font-size: 1.18rem;
    line-height: 1.35;
    text-align: left;
  }

  &:hover {
    border-color: rgba(36, 91, 79, 0.38);
    background: #ffffff;
  }
`;
