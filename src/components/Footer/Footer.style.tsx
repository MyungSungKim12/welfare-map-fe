'use client';

import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  width: 100%;
  background: #1B3A4B;
  padding: 5rem 2rem 3rem;
`;

export const FooterInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

export const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FooterLogo = styled.div`
  .logo_wrap {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 1.4rem;

    .logo_icon { font-size: 2.4rem; }
    .logo_text {
      font-size: 2.2rem;
      font-weight: 800;
      color: #ffffff;
    }
  }

  .logo_desc {
    font-size: 1.4rem;
    color: rgba(255,255,255,0.55);
    line-height: 1.7;
    max-width: 300px;
  }
`;

export const FooterLinks = styled.div`
  h4 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 1.6rem;
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    li a {
      font-size: 1.4rem;
      color: rgba(255,255,255,0.55);
      transition: color 0.2s;

      &:hover { color: #4DD9AC; }
    }
  }
`;

export const FooterBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  .copyright {
    font-size: 1.3rem;
    color: rgba(255,255,255,0.35);
  }

  .legal_links {
    display: flex;
    gap: 2rem;

    a {
      font-size: 1.3rem;
      color: rgba(255,255,255,0.35);
      transition: color 0.2s;

      &:hover { color: rgba(255,255,255,0.7); }
    }
  }
`;