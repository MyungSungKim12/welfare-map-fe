'use client';

import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const HeroWrapper = styled.section`
  width: 100%;
  background: #1B3A4B;
  padding: 7rem 2rem;
`;

export const HeroInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: ${fadeInUp} 0.7s ease forwards;
`;

export const HeroTitle = styled.h1`
  font-size: clamp(2.8rem, 4vw, 4.4rem);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.3;
  margin-bottom: 1.6rem;
  letter-spacing: -0.03em;

  span { color: #4DD9AC; }
`;

export const HeroSubtitle = styled.p`
  font-size: clamp(1.6rem, 2vw, 1.9rem);
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.7;
  margin-bottom: 4rem;
  max-width: 600px;
`;

export const HeroSearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);

  input {
    flex: 1;
    border: none;
    outline: none;
    padding: 1.6rem 2rem;
    font-size: 1.7rem;
    color: #1B2D38;
    background: transparent;

    &::placeholder { color: #aaa; }
  }

  button {
    padding: 1.6rem 2.4rem;
    background: #2E9E7A;
    border: none;
    color: #fff;
    font-size: 1.6rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;

    &:hover { background: #247A5E; }
  }
`;

export const HeroCTA = styled.button`
  padding: 1.4rem 3.2rem;
  background: transparent;
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 10px;
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 5rem;

  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: #ffffff;
  }
`;

export const HeroStats = styled.div`
  display: flex;
  gap: 5rem;
  flex-wrap: wrap;
  justify-content: center;
  border-top: 1px solid rgba(255,255,255,0.15);
  padding-top: 3.2rem;

  .stat_item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;

    .stat_number {
      font-size: 3rem;
      font-weight: 800;
      color: #4DD9AC;
    }

    .stat_label {
      font-size: 1.4rem;
      color: rgba(255,255,255,0.55);
    }
  }
`;