'use client';

import styled from 'styled-components';

export const HeroWrapper = styled.section`
  width: 100%;
  padding: 4.4rem clamp(1.4rem, 3.2vw, 3.4rem) 2.6rem;
`;

export const HeroInner = styled.div`
  width: min(1320px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(360px, 0.68fr);
  gap: 1.6rem;
  align-items: stretch;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroCopy = styled.div`
  min-width: 0;
  padding: clamp(3rem, 5vw, 5.2rem);
  border: 1px solid var(--color-line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: var(--shadow-md);

  .prompt-suggestions {
    max-width: 820px;
    margin: 0 0 1.8rem;
    padding: 1.2rem;
    border: 1px solid var(--color-line);
    border-radius: 16px;
    background: rgba(251, 250, 247, 0.82);
  }

  .prompt-head {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    color: var(--color-subtle);
    font-size: 1.16rem;
    font-weight: 850;
    margin-bottom: 0.9rem;
  }

  .prompt-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .prompt-list button {
    min-height: 3.8rem;
    padding: 0 1.2rem;
    border: 1px solid #e2ddd3;
    border-radius: 999px;
    background: #ffffff;
    color: #303741;
    font-size: 1.22rem;
    font-weight: 780;
    cursor: pointer;
    transition:
      border-color 160ms ease,
      background 160ms ease,
      transform 160ms ease;
  }

  .prompt-list button:hover {
    border-color: #111315;
    background: #f6f4ef;
    transform: translateY(-1px);
  }
`;

export const HeroEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 32px;
  padding: 0 0.8rem;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  background: #f0eee8;
  color: #4f5661;
  font-size: 1.22rem;
  font-weight: 800;
  margin-bottom: 1.4rem;
`;

export const HeroTitle = styled.h1`
  max-width: 760px;
  color: var(--color-ink);
  font-size: clamp(4rem, 5.8vw, 7.2rem);
  font-weight: 850;
  line-height: 1.04;
  margin-bottom: 1.2rem;
`;

export const HeroSubtitle = styled.p`
  max-width: 760px;
  color: var(--color-muted);
  font-size: clamp(1.45rem, 1.7vw, 1.72rem);
  font-weight: 600;
  line-height: 1.7;
  margin-bottom: 2.4rem;
`;

export const HeroActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: stretch;
  flex-wrap: wrap;
  margin-bottom: 1.4rem;
`;

export const HeroSearchBar = styled.div`
  flex: 1 1 420px;
  min-height: 64px;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.7rem 0.7rem 0.7rem 1.6rem;
  background: #ffffff;
  border: 1px solid #dcd6ca;
  border-radius: 18px;
  color: var(--color-muted);

  input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--color-ink);
    font-size: 1.55rem;
    font-weight: 700;

    &::placeholder {
      color: var(--color-subtle);
      font-weight: 600;
    }
  }

  button {
    min-height: 48px;
    border: 0;
    border-radius: 14px;
    padding: 0 1.5rem;
    background: #111315;
    color: #ffffff;
    font-size: 1.35rem;
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
  min-height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0 1.5rem;
  border: 1px solid var(--color-line-strong);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  color: var(--color-ink);
  font-size: 1.42rem;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    border-color: rgba(36, 91, 79, 0.42);
    background: var(--color-surface-subtle);
  }

  @media (max-width: 520px) {
    width: 100%;
  }
`;

export const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  max-width: 820px;
  border: 1px solid var(--color-line);
  border-radius: 16px;
  overflow: hidden;
  background: #fbfaf7;

  div {
    padding: 1.25rem 1.4rem;
    border-right: 1px solid var(--color-line);
  }

  div:last-child {
    border-right: 0;
  }

  strong {
    display: block;
    font-size: 2rem;
    color: var(--color-ink);
    margin-bottom: 0.3rem;
    line-height: 1;
  }

  span {
    font-size: 1.22rem;
    color: var(--color-muted);
    font-weight: 700;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;

    div {
      border-right: 0;
      border-bottom: 1px solid var(--color-line);
    }

    div:last-child {
      border-bottom: 0;
    }
  }
`;

export const HeroPanel = styled.aside`
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 1.8rem;
  border: 1px solid var(--color-line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: var(--shadow-sm);

  .panel_header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.2rem;
    margin-bottom: 1.2rem;

    span {
      color: var(--color-muted);
      font-size: 1.22rem;
      font-weight: 800;
    }

    strong {
      display: block;
      margin-top: 0.25rem;
      color: var(--color-ink);
      font-size: 1.72rem;
      font-weight: 800;
    }
  }

  .panel_link {
    min-height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    margin-top: auto;
    border-radius: var(--radius-md);
    background: #111315;
    color: #ffffff;
    font-size: 1.42rem;
    font-weight: 800;
  }
`;

export const InsightCard = styled.div<{ $tone: 'urgent' | 'new' | 'default' }>`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  padding: 1.2rem 0;
  border-top: 1px solid var(--color-line);

  &:last-of-type {
    border-bottom: 1px solid var(--color-line);
    margin-bottom: 1.2rem;
  }

  svg {
    color: ${({ $tone }) =>
      $tone === 'urgent' ? 'var(--color-danger)' :
      $tone === 'new' ? 'var(--color-primary)' : 'var(--color-warn)'};
    margin-top: 0.2rem;
  }

  span {
    display: block;
    color: ${({ $tone }) =>
      $tone === 'urgent' ? 'var(--color-danger)' :
      $tone === 'new' ? 'var(--color-primary)' : 'var(--color-warn)'};
    font-size: 1.16rem;
    font-weight: 800;
    margin-bottom: 0.28rem;
  }

  strong {
    display: block;
    color: var(--color-ink);
    font-size: 1.42rem;
    line-height: 1.45;
    margin-bottom: 0.35rem;
  }

  p {
    color: var(--color-muted);
    font-size: 1.24rem;
    line-height: 1.55;
  }
`;
