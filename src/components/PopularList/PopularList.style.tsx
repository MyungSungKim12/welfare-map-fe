'use client';

import styled from 'styled-components';

export const PopularWrapper = styled.section`
  width: 100%;
  padding: 0 clamp(1.4rem, 3.2vw, 3.2rem) 2.8rem;
`;

export const PopularInner = styled.div`
  width: min(1320px, 100%);
  margin: 0 auto;
  padding: 1.4rem;
  border: 1px solid var(--color-line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.74);
  box-shadow: var(--shadow-sm);
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 1.2rem;

  span {
    color: var(--color-subtle);
    font-size: 1.2rem;
    font-weight: 800;
  }

  h2 {
    margin-top: 0.3rem;
    color: var(--color-ink);
    font-size: clamp(1.9rem, 2.4vw, 2.5rem);
    font-weight: 800;
  }

  @media (max-width: 760px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const TabGroup = styled.div`
  display: inline-flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  padding: 0.35rem;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  background: var(--color-surface-muted);
`;

export const TabBtn = styled.button<{ $active: boolean }>`
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-line-strong)' : 'transparent')};
  background: ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-muted)')};
  font-size: 1.25rem;
  font-weight: 800;
  cursor: pointer;
`;

export const CardScroll = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(180px, 1fr));
  gap: 0.8rem;
  overflow-x: auto;
  padding-bottom: 0.2rem;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(5, minmax(230px, 1fr));
  }
`;

export const PopularCard = styled.article`
  min-height: 158px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.25rem;
  background: var(--color-surface-subtle);
  border: 1px solid var(--color-line);
  border-radius: 14px;
  color: inherit;
  text-decoration: none;
  transition: border-color 0.18s, background 0.18s;

  &:hover {
    border-color: rgba(36, 91, 79, 0.38);
    background: #ffffff;
  }

  .card_rank {
    margin-top: 1rem;
    color: var(--color-primary);
    font-size: 1.12rem;
    font-weight: 800;
  }

  .card_title {
    margin-top: 0.45rem;
    color: var(--color-ink);
    font-size: 1.42rem;
    font-weight: 800;
    line-height: 1.45;
  }

  .card_target {
    margin-top: 0.5rem;
    color: var(--color-muted);
    font-size: 1.22rem;
    line-height: 1.45;
  }

  .card_link {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--color-secondary);
    font-size: 1.22rem;
    font-weight: 800;
  }
`;

export const StatusBadge = styled.span<{ $tone: 'urgent' | 'new' | 'default' }>`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 0.7rem;
  border-radius: 999px;
  background: ${({ $tone }) =>
    $tone === 'urgent' ? 'var(--color-danger-soft)' :
    $tone === 'new' ? 'var(--color-info-soft)' : 'var(--color-surface-muted)'};
  color: ${({ $tone }) =>
    $tone === 'urgent' ? 'var(--color-danger)' :
    $tone === 'new' ? 'var(--color-primary)' : 'var(--color-secondary)'};
  font-size: 1.05rem;
  font-weight: 800;
`;
