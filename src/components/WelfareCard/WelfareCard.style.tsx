'use client';

import styled from 'styled-components';

export const CardWrapper = styled.article<{ $expired: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.6rem;
  align-items: stretch;
  padding: 1.8rem;
  border: 1px solid var(--color-line);
  border-radius: 18px;
  background: #ffffff;
  opacity: ${({ $expired }) => ($expired ? 0.62 : 1)};
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(20, 134, 109, 0.38);
    box-shadow: var(--shadow-sm);
  }

  .card_top {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const CardLeft = styled.div`
  min-width: 0;
`;

export const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 0.9rem;
  border-radius: 999px;
  background: var(--color-surface-soft);
  color: var(--color-navy);
  font-size: 1.2rem;
  font-weight: 800;
`;

export const StatusBadge = styled.span<{ $tone: 'urgent' | 'new' | 'expired' }>`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 0.9rem;
  border-radius: 999px;
  background: ${({ $tone }) =>
    $tone === 'urgent' ? 'var(--color-red-soft)' :
    $tone === 'new' ? 'var(--color-teal-soft)' : '#f0f2f1'};
  color: ${({ $tone }) =>
    $tone === 'urgent' ? 'var(--color-red)' :
    $tone === 'new' ? 'var(--color-teal-dark)' : '#7b8580'};
  font-size: 1.16rem;
  font-weight: 800;
`;

export const CardTitle = styled.h3`
  color: var(--color-ink);
  font-size: 1.9rem;
  font-weight: 800;
  line-height: 1.45;
  margin-bottom: 0.7rem;
`;

export const CardDesc = styled.p`
  color: var(--color-muted);
  font-size: 1.42rem;
  line-height: 1.65;
  margin-bottom: 1.3rem;
`;

export const BadgeRow = styled.div`
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
`;

export const Badge = styled.span<{ $type: 'region' | 'target' | 'period' }>`
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.9rem;
  border-radius: 10px;
  color: ${({ $type }) =>
    $type === 'region' ? 'var(--color-teal-dark)' :
    $type === 'target' ? 'var(--color-amber)' : 'var(--color-navy)'};
  background: ${({ $type }) =>
    $type === 'region' ? 'var(--color-teal-soft)' :
    $type === 'target' ? 'var(--color-amber-soft)' : 'var(--color-surface-soft)'};
  font-size: 1.25rem;
  font-weight: 800;
`;

export const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 700px) {
    flex-direction: row;
    justify-content: flex-start;
  }
`;

export const SaveBtn = styled.button<{ $saved: boolean }>`
  width: 46px;
  height: 46px;
  border-radius: 14px;
  border: 1px solid ${({ $saved }) => ($saved ? 'var(--color-teal)' : 'var(--color-line)')};
  background: ${({ $saved }) => ($saved ? 'var(--color-teal-soft)' : '#ffffff')};
  color: ${({ $saved }) => ($saved ? 'var(--color-teal-dark)' : 'var(--color-muted)')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const DetailBtn = styled.a`
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0 1.2rem;
  border-radius: 14px;
  background: var(--color-navy);
  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 800;
`;
