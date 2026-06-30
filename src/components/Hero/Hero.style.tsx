'use client';

import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const HeroWrapper = styled.section`
  width: 100%;
  padding: clamp(4rem, 7vw, 7rem) clamp(1.6rem, 4vw, 4rem) 4.4rem;
`;

export const HeroInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.72fr);
  gap: clamp(2.4rem, 5vw, 5.6rem);
  align-items: center;
  animation: ${fadeInUp} 0.55s ease both;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroCopy = styled.div`
  min-width: 0;
`;

export const HeroEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 1rem;
  border: 1px solid rgba(20, 134, 109, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  color: var(--color-teal-dark);
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 2rem;
`;

export const HeroTitle = styled.h1`
  max-width: 760px;
  color: var(--color-ink);
  font-size: clamp(3.4rem, 5.2vw, 6.6rem);
  font-weight: 800;
  line-height: 1.08;
  margin-bottom: 2rem;
`;

export const HeroSubtitle = styled.p`
  max-width: 650px;
  color: var(--color-muted);
  font-size: clamp(1.65rem, 2vw, 2rem);
  font-weight: 500;
  line-height: 1.75;
  margin-bottom: 2.8rem;
`;

export const HeroActions = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: stretch;
  flex-wrap: wrap;
  margin-bottom: 2.6rem;
`;

export const HeroSearchBar = styled.div`
  flex: 1 1 420px;
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 0.7rem 0.7rem 1.6rem;
  background: #ffffff;
  border: 1px solid var(--color-line);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  color: var(--color-muted);

  input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--color-ink);
    font-size: 1.6rem;
    font-weight: 600;

    &::placeholder {
      color: #8b9893;
      font-weight: 500;
    }
  }

  button {
    min-height: 44px;
    border: 0;
    border-radius: 12px;
    padding: 0 1.8rem;
    background: var(--color-navy);
    color: #ffffff;
    font-size: 1.45rem;
    font-weight: 800;
    cursor: pointer;
  }

  @media (max-width: 520px) {
    flex: 1 1 100%;
    flex-wrap: wrap;
    align-items: stretch;
    padding: 1rem;

    input {
      flex: 1 1 100%;
      min-height: 38px;
    }

    button {
      width: 100%;
    }
  }
`;

export const HeroCTA = styled.button`
  min-height: 58px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 0 1.8rem;
  border: 1px solid rgba(20, 134, 109, 0.28);
  border-radius: 16px;
  background: var(--color-teal);
  color: #ffffff;
  font-size: 1.55rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 16px 30px rgba(20, 134, 109, 0.2);

  @media (max-width: 520px) {
    width: 100%;
  }
`;

export const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  max-width: 720px;

  div {
    padding: 1.4rem 1.6rem;
    border: 1px solid rgba(220, 231, 225, 0.9);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.68);
  }

  strong {
    display: block;
    font-size: 1.8rem;
    color: var(--color-navy);
    margin-bottom: 0.35rem;
  }

  span {
    font-size: 1.32rem;
    color: var(--color-muted);
    font-weight: 600;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroPanel = styled.aside`
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(220, 231, 225, 0.95);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: var(--shadow-md);

  .panel_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.2rem;
    margin-bottom: 1.4rem;

    span {
      color: var(--color-muted);
      font-size: 1.35rem;
      font-weight: 800;
    }

    strong {
      color: var(--color-navy);
      font-size: 1.7rem;
      font-weight: 800;
    }
  }

  .panel_link {
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;
    margin-top: 1.4rem;
    border-radius: 14px;
    background: var(--color-navy);
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: 800;
  }
`;

export const InsightCard = styled.div<{ $tone: 'urgent' | 'new' }>`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.2rem;
  padding: 1.5rem;
  border-radius: 18px;
  background: ${({ $tone }) => ($tone === 'urgent' ? 'var(--color-red-soft)' : 'var(--color-teal-soft)')};
  border: 1px solid ${({ $tone }) => ($tone === 'urgent' ? 'rgba(194, 65, 53, 0.18)' : 'rgba(20, 134, 109, 0.18)')};

  & + & {
    margin-top: 1rem;
  }

  svg {
    color: ${({ $tone }) => ($tone === 'urgent' ? 'var(--color-red)' : 'var(--color-teal-dark)')};
    margin-top: 0.2rem;
  }

  span {
    display: block;
    color: ${({ $tone }) => ($tone === 'urgent' ? 'var(--color-red)' : 'var(--color-teal-dark)')};
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 0.35rem;
  }

  strong {
    display: block;
    color: var(--color-ink);
    font-size: 1.55rem;
    line-height: 1.45;
    margin-bottom: 0.45rem;
  }

  p {
    color: var(--color-muted);
    font-size: 1.32rem;
    line-height: 1.55;
  }
`;
