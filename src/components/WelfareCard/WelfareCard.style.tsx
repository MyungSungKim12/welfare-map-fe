'use client';

import styled from 'styled-components';

export const CardWrapper = styled.article<{ $expired: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.2rem;
  align-items: stretch;
  padding: 1.45rem;
  border: 1px solid var(--color-line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.94);
  opacity: ${({ $expired }) => ($expired ? 0.64 : 1)};
  transition: border-color 0.18s, background 0.18s, box-shadow 0.18s, transform 0.18s;

  &:hover {
    border-color: #cfc8bc;
    background: #ffffff;
    box-shadow: var(--shadow-sm);
    transform: translateY(-1px);
  }

  .card_top {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 0.8rem;
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
  min-height: 24px;
  padding: 0 0.75rem;
  border-radius: 999px;
  background: var(--color-surface-muted);
  color: var(--color-secondary);
  font-size: 1.08rem;
  font-weight: 800;
`;

export const StatusBadge = styled.span<{ $tone: 'urgent' | 'new' | 'expired' }>`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 0.75rem;
  border-radius: 999px;
  background: ${({ $tone }) =>
    $tone === 'urgent' ? 'var(--color-danger-soft)' :
    $tone === 'new' ? 'var(--color-info-soft)' : '#eff1ef'};
  color: ${({ $tone }) =>
    $tone === 'urgent' ? 'var(--color-danger)' :
    $tone === 'new' ? 'var(--color-primary)' : '#767f79'};
  font-size: 1.08rem;
  font-weight: 800;
`;

export const CardTitle = styled.h3`
  color: var(--color-ink);
  font-size: 1.68rem;
  font-weight: 800;
  line-height: 1.45;
  margin-bottom: 0.55rem;
`;

export const CardDesc = styled.p`
  color: var(--color-muted);
  font-size: 1.32rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

export const BadgeRow = styled.div`
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
`;

export const Badge = styled.span<{ $type: 'region' | 'target' | 'period' }>`
  min-height: 30px;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  color: ${({ $type }) =>
    $type === 'region' ? 'var(--color-primary)' :
    $type === 'target' ? 'var(--color-warn)' : 'var(--color-secondary)'};
  background: #ffffff;
  font-size: 1.15rem;
  font-weight: 800;
`;

export const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.8rem;

  @media (max-width: 700px) {
    flex-direction: row;
    justify-content: flex-start;
  }
`;

export const SaveBtn = styled.button<{ $saved: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid ${({ $saved }) => ($saved ? 'rgba(36, 91, 79, 0.5)' : 'var(--color-line)')};
  background: ${({ $saved }) => ($saved ? 'var(--color-info-soft)' : '#ffffff')};
  color: ${({ $saved }) => ($saved ? 'var(--color-primary)' : 'var(--color-muted)')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const DetailBtn = styled.a`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0 1rem;
  border-radius: 999px;
  background: #111315;
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 800;
`;
