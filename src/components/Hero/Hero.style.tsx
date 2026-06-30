'use client';

import styled from 'styled-components';

export const HeroWrapper = styled.section`
  width: 100%;
  padding: 3.4rem clamp(1.4rem, 3.2vw, 3.2rem) 2.4rem;
`;

export const HeroInner = styled.div`
  width: min(1240px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(340px, 0.72fr);
  gap: 1.4rem;
  align-items: stretch;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroCopy = styled.div`
  min-width: 0;
  padding: clamp(2.2rem, 4vw, 3.4rem);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
`;

export const HeroEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 32px;
  padding: 0 0.8rem;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  background: var(--color-surface-muted);
  color: var(--color-primary);
  font-size: 1.22rem;
  font-weight: 800;
  margin-bottom: 1.4rem;
`;

export const HeroTitle = styled.h1`
  max-width: 760px;
  color: var(--color-ink);
  font-size: clamp(2.8rem, 4.2vw, 4.6rem);
  font-weight: 800;
  line-height: 1.16;
  margin-bottom: 1.2rem;
`;

export const HeroSubtitle = styled.p`
  max-width: 720px;
  color: var(--color-muted);
  font-size: clamp(1.45rem, 1.7vw, 1.72rem);
  font-weight: 600;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

export const HeroActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: stretch;
  flex-wrap: wrap;
  margin-bottom: 1.6rem;
`;

export const HeroSearchBar = styled.div`
  flex: 1 1 420px;
  min-height: 54px;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.6rem 0.6rem 0.6rem 1.3rem;
  background: var(--color-surface-subtle);
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-md);
  color: var(--color-muted);

  input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--color-ink);
    font-size: 1.48rem;
    font-weight: 700;

    &::placeholder {
      color: var(--color-subtle);
      font-weight: 600;
    }
  }

  button {
    min-height: 42px;
    border: 0;
    border-radius: var(--radius-sm);
    padding: 0 1.5rem;
    background: var(--color-secondary);
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
  min-height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0 1.5rem;
  border: 1px solid var(--color-line-strong);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-primary);
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
  max-width: 760px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface-subtle);

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
    color: var(--color-secondary);
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
  padding: 1.6rem;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-lg);
  background: var(--color-surface-subtle);

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
    background: var(--color-primary);
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
