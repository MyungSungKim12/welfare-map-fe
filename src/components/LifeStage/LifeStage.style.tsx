'use client';

import styled from 'styled-components';

export const LifeStageWrapper = styled.section`
  width: 100%;
  background: #ffffff;
  padding: 6rem 2rem;
  border-bottom: 1px solid #EDE8E0;
`;

export const LifeStageInner = styled.div`
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

  p {
    font-size: 1.6rem;
    color: #8A7F72;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.6rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const StageCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  padding: 2.8rem 1rem;
  background: #F7F4EF;
  border: 2px solid transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  .stage_icon { font-size: 3.6rem; }

  .stage_label {
    font-size: 1.6rem;
    font-weight: 700;
    color: #1B2D38;
  }

  .stage_desc {
    font-size: 1.3rem;
    color: #8A7F72;
    text-align: center;
    line-height: 1.5;
  }

  &:hover {
    background: #E8F4F0;
    border-color: #2E9E7A;

    .stage_label { color: #2E9E7A; }
  }
`;