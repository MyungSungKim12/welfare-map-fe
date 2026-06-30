'use client';

import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  width: 100%;
  padding: 5.2rem 2rem 3.2rem;
  background:
    radial-gradient(circle at 15% 0, rgba(20, 134, 109, 0.22), transparent 34rem),
    #122a38;
`;

export const FooterInner = styled.div`
  width: min(1280px, 100%);
  margin: 0 auto;
`;

export const FooterTop = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) 1fr 1fr;
  gap: 4rem;
  padding-bottom: 3.6rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

export const FooterBrand = styled.div`
  .brand-mark {
    display: inline-flex;
    align-items: center;
    gap: 0.9rem;
    margin-bottom: 1.4rem;
    color: #ffffff;
    font-size: 2rem;
    font-weight: 800;
  }

  .brand-mark svg {
    color: #7be0c7;
  }

  p {
    max-width: 480px;
    color: rgba(255, 255, 255, 0.66);
    font-size: 1.42rem;
    font-weight: 500;
    line-height: 1.8;
  }

  .source-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    min-height: 34px;
    margin-top: 1.6rem;
    padding: 0 1rem;
    border: 1px solid rgba(123, 224, 199, 0.24);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: #d7fff5;
    font-size: 1.22rem;
    font-weight: 800;
  }
`;

export const FooterLinks = styled.nav`
  h4 {
    margin-bottom: 1.4rem;
    color: #ffffff;
    font-size: 1.45rem;
    font-weight: 800;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    list-style: none;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: rgba(255, 255, 255, 0.62);
    font-size: 1.35rem;
    font-weight: 700;
    transition: color 0.2s ease;

    &:hover {
      color: #7be0c7;
    }
  }
`;

export const FooterBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding-top: 2.2rem;

  p,
  a {
    color: rgba(255, 255, 255, 0.42);
    font-size: 1.22rem;
    font-weight: 700;
  }

  div {
    display: flex;
    gap: 1.6rem;
  }

  a:hover {
    color: rgba(255, 255, 255, 0.78);
  }

  @media (max-width: 720px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;
