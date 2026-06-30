'use client';

import { Database, ExternalLink, Mail, Radar } from 'lucide-react';
import {
  FooterWrapper,
  FooterInner,
  FooterTop,
  FooterBrand,
  FooterLinks,
  FooterBottom,
} from './Footer.style';

const agencyLinks = [
  { label: '복지로', href: 'https://www.bokjiro.go.kr' },
  { label: '정부24', href: 'https://www.gov.kr' },
  { label: '공공데이터포털', href: 'https://www.data.go.kr' },
];

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterInner>
        <FooterTop>
          <FooterBrand>
            <div className="brand-mark">
              <Radar size={22} />
              <span>WelfareMap</span>
            </div>
            <p>
              지역, 생애주기, 상황 조건을 함께 읽어 사용자가 놓치기 쉬운 복지 지원을 빠르게 찾도록 돕는
              AI 기반 지역생활 복지 레이더입니다.
            </p>
            <div className="source-chip">
              <Database size={15} />
              공공데이터 기반
            </div>
          </FooterBrand>

          <FooterLinks>
            <h4>공식 정보</h4>
            <ul>
              {agencyLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                    <ExternalLink size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </FooterLinks>

          <FooterLinks>
            <h4>서비스</h4>
            <ul>
              <li><a href="#welfare-section">복지 탐색</a></li>
              <li><a href="mailto:korgoddd@gmail.com"><Mail size={13} />문의하기</a></li>
            </ul>
          </FooterLinks>
        </FooterTop>

        <FooterBottom>
          <p>© 2026 WelfareMap. 정보는 각 제공 기관의 원문을 기준으로 확인해야 합니다.</p>
          <div>
            <a href="https://www.data.go.kr" target="_blank" rel="noopener noreferrer">데이터 출처</a>
            <a href="#welfare-section">맞춤 복지 찾기</a>
          </div>
        </FooterBottom>
      </FooterInner>
    </FooterWrapper>
  );
}
