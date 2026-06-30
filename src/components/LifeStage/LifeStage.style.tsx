'use client';

import styled from 'styled-components';

export const LifeStageWrapper = styled.section`
  width: 100%;
  padding: 2.4rem clamp(1.6rem, 4vw, 4rem) 4rem;
`;

export const LifeStageInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

export const SectionHeader = styled.div`
  margin-bottom: 1.8rem;

  span {
    color: var(--color-teal-dark);
    font-size: 1.3rem;
    font-weight: 800;
  }

  h2 {
    margin-top: 0.4rem;
    color: var(--color-ink);
    font-size: clamp(2.2rem, 3vw, 3rem);
    font-weight: 800;
  }

  p {
    margin-top: 0.7rem;
    color: var(--color-muted);
    font-size: 1.55rem;
    line-height: 1.6;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1.2rem;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 620px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StageCard = styled.button`
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.8rem;
  background: #ffffff;
  border: 1px solid var(--color-line);
  border-radius: 18px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(16, 32, 39, 0.04);
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;

  .stage_icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--color-teal-soft);
    color: var(--color-teal-dark);
  }

  .stage_label {
    color: var(--color-ink);
    font-size: 1.75rem;
    font-weight: 800;
  }

  .stage_desc {
    color: var(--color-muted);
    font-size: 1.35rem;
    line-height: 1.5;
    text-align: left;
  }

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(20, 134, 109, 0.35);
    box-shadow: var(--shadow-sm);
  }
`;
