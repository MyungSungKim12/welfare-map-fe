'use client';

import styled from 'styled-components';

export const BannerWrapper = styled.section`
  width: 100%;
  padding: 0 clamp(1.4rem, 3.2vw, 3.2rem) 2.4rem;
`;

export const BannerInner = styled.div`
  width: min(1240px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.9rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const BannerCard = styled.article<{ $type: 'new' | 'urgent' | 'guide' }>`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  min-height: 116px;
  padding: 1.3rem;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-left: 4px solid ${({ $type }) =>
    $type === 'urgent' ? 'var(--color-danger)' :
    $type === 'new' ? 'var(--color-primary)' : 'var(--color-warn)'};
  border-radius: var(--radius-md);

  .banner_icon {
    width: 38px;
    height: 38px;
    border-radius: var(--radius-sm);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${({ $type }) =>
      $type === 'urgent' ? 'var(--color-danger)' :
      $type === 'new' ? 'var(--color-primary)' : 'var(--color-warn)'};
    background: ${({ $type }) =>
      $type === 'urgent' ? 'var(--color-danger-soft)' :
      $type === 'new' ? 'var(--color-info-soft)' : 'var(--color-warn-soft)'};
  }

  .banner_badge {
    display: inline-flex;
    margin-bottom: 0.45rem;
    color: ${({ $type }) =>
      $type === 'urgent' ? 'var(--color-danger)' :
      $type === 'new' ? 'var(--color-primary)' : 'var(--color-warn)'};
    font-size: 1.12rem;
    font-weight: 800;
  }

  .banner_title {
    color: var(--color-ink);
    font-size: 1.42rem;
    font-weight: 800;
    line-height: 1.45;
  }

  .banner_desc {
    margin-top: 0.45rem;
    color: var(--color-muted);
    font-size: 1.24rem;
    line-height: 1.5;
  }
`;
