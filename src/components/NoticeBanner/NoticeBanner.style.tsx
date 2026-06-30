'use client';

import styled from 'styled-components';

export const BannerWrapper = styled.section`
  width: 100%;
  padding: 0 clamp(1.6rem, 4vw, 4rem) 4.4rem;
`;

export const BannerInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.4rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const BannerCard = styled.article<{ $type: 'new' | 'urgent' | 'guide' }>`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.3rem;
  padding: 1.8rem;
  background: #ffffff;
  border: 1px solid var(--color-line);
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(16, 32, 39, 0.05);

  .banner_icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${({ $type }) =>
      $type === 'urgent' ? 'var(--color-red)' :
      $type === 'new' ? 'var(--color-teal-dark)' : 'var(--color-amber)'};
    background: ${({ $type }) =>
      $type === 'urgent' ? 'var(--color-red-soft)' :
      $type === 'new' ? 'var(--color-teal-soft)' : 'var(--color-amber-soft)'};
  }

  .banner_badge {
    display: inline-flex;
    margin-bottom: 0.6rem;
    color: ${({ $type }) =>
      $type === 'urgent' ? 'var(--color-red)' :
      $type === 'new' ? 'var(--color-teal-dark)' : 'var(--color-amber)'};
    font-size: 1.2rem;
    font-weight: 800;
  }

  .banner_title {
    color: var(--color-ink);
    font-size: 1.6rem;
    font-weight: 800;
    line-height: 1.45;
  }

  .banner_desc {
    margin-top: 0.5rem;
    color: var(--color-muted);
    font-size: 1.35rem;
    line-height: 1.55;
  }
`;
