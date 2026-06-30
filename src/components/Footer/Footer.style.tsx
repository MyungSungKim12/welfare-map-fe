'use client';

import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  width: 100%;
  padding: 3.2rem 2rem 2.6rem;
  border-top: 1px solid var(--color-line);
  background: var(--color-surface-subtle);
`;

export const FooterInner = styled.div`
  width: min(1240px, 100%);
  margin: 0 auto;
`;

export const FooterTop = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) 1fr 1fr;
  gap: 3rem;
  padding-bottom: 2.4rem;
  border-bottom: 1px solid var(--color-line);

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const FooterBrand = styled.div`
  .brand-mark {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 1.1rem;
    color: var(--color-ink);
    font-size: 1.9rem;
    font-weight: 800;
  }

  .brand-mark svg {
    color: var(--color-primary);
  }

  p {
    max-width: 520px;
    color: var(--color-muted);
    font-size: 1.35rem;
    font-weight: 500;
    line-height: 1.75;
  }

  .source-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    min-height: 32px;
    margin-top: 1.3rem;
    padding: 0 0.9rem;
    border: 1px solid var(--color-line);
    border-radius: 999px;
    background: #ffffff;
    color: var(--color-primary);
    font-size: 1.15rem;
    font-weight: 800;
  }
`;

export const FooterLinks = styled.nav`
  h4 {
    margin-bottom: 1rem;
    color: var(--color-ink);
    font-size: 1.35rem;
    font-weight: 800;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    list-style: none;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--color-muted);
    font-size: 1.25rem;
    font-weight: 700;
    transition: color 0.18s ease;

    &:hover {
      color: var(--color-primary);
    }
  }
`;

export const FooterBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.4rem;
  padding-top: 1.8rem;

  p,
  a {
    color: var(--color-subtle);
    font-size: 1.15rem;
    font-weight: 700;
  }

  div {
    display: flex;
    gap: 1.4rem;
  }

  a:hover {
    color: var(--color-primary);
  }

  @media (max-width: 720px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;
