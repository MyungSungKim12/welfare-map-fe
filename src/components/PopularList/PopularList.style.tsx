'use client';

import styled from 'styled-components';

export const PopularWrapper = styled.section`
  width: 100%;
  padding: 0 clamp(1.6rem, 4vw, 4rem) 5rem;
`;

export const PopularInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid var(--color-line);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: var(--shadow-sm);
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.6rem;
  margin-bottom: 1.6rem;

  span {
    color: var(--color-teal-dark);
    font-size: 1.3rem;
    font-weight: 800;
  }

  h2 {
    margin-top: 0.4rem;
    color: var(--color-ink);
    font-size: clamp(2.1rem, 3vw, 2.8rem);
    font-weight: 800;
  }

  @media (max-width: 760px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const TabGroup = styled.div`
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
`;

export const TabBtn = styled.button<{ $active: boolean }>`
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0 1.3rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-teal)' : 'var(--color-line)')};
  background: ${({ $active }) => ($active ? 'var(--color-teal)' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : 'var(--color-muted)')};
  font-size: 1.35rem;
  font-weight: 800;
  cursor: pointer;
`;

export const CardScroll = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(190px, 1fr));
  gap: 1.2rem;
  overflow-x: auto;
  padding-bottom: 0.4rem;

  @media (max-width: 1060px) {
    grid-template-columns: repeat(5, minmax(230px, 1fr));
  }
`;

export const PopularCard = styled.article`
  min-height: 210px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.7rem;
  background: #ffffff;
  border: 1px solid var(--color-line);
  border-radius: 18px;
  color: inherit;
  text-decoration: none;
  transition: transform 0.2s, border-color 0.2s;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(20, 134, 109, 0.38);
  }

  .card_rank {
    margin-top: 1.6rem;
    color: var(--color-teal-dark);
    font-size: 1.25rem;
    font-weight: 800;
  }

  .card_title {
    margin-top: 0.6rem;
    color: var(--color-ink);
    font-size: 1.65rem;
    font-weight: 800;
    line-height: 1.45;
  }

  .card_target {
    margin-top: 0.7rem;
    color: var(--color-muted);
    font-size: 1.35rem;
  }

  .card_link {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-navy);
    font-size: 1.35rem;
    font-weight: 800;
  }
`;

export const StatusBadge = styled.span<{ $tone: 'urgent' | 'new' | 'default' }>`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 0.9rem;
  border-radius: 999px;
  background: ${({ $tone }) =>
    $tone === 'urgent' ? 'var(--color-red-soft)' :
    $tone === 'new' ? 'var(--color-teal-soft)' : 'var(--color-surface-soft)'};
  color: ${({ $tone }) =>
    $tone === 'urgent' ? 'var(--color-red)' :
    $tone === 'new' ? 'var(--color-teal-dark)' : 'var(--color-navy)'};
  font-size: 1.15rem;
  font-weight: 800;
`;
