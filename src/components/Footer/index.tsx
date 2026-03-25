'use client';

import {
  FooterWrapper, FooterInner, FooterTop,
  FooterLogo, FooterLinks, FooterBottom,
} from './Footer.style';

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterInner>
        <FooterTop>
          <FooterLogo>
            <div className="logo_wrap">
              <span className="logo_icon">🗺️</span>
              <span className="logo_text">복지맵</span>
            </div>
            <p className="logo_desc">
              고령화 사회를 위한 지역 기반 복지 정보 통합 서비스.
              내 주변 복지를 쉽고 빠르게 찾을 수 있도록 돕습니다.
            </p>
          </FooterLogo>

          <FooterLinks>
            <h4>관련 기관</h4>
            <ul>
              <li><a href="https://www.bokjiro.go.kr" target="_blank" rel="noopener noreferrer">복지로</a></li>
              <li><a href="https://www.gov.kr" target="_blank" rel="noopener noreferrer">정부24</a></li>
              <li><a href="https://www.data.go.kr" target="_blank" rel="noopener noreferrer">공공데이터포털</a></li>
            </ul>
          </FooterLinks>

          <FooterLinks>
            <h4>서비스</h4>
            <ul>
              <li><a href="#">서비스 소개</a></li>
              <li><a href="#">이용 가이드</a></li>
              <li><a href="mailto:korgoddd@gmail.com">문의하기</a></li>
            </ul>
          </FooterLinks>
        </FooterTop>

        <FooterBottom>
          <p className="copyright">© 2026 WelfareMap. All rights reserved.</p>
          <div className="legal_links">
            <a href="#">개인정보처리방침</a>
            <a href="#">이용약관</a>
          </div>
        </FooterBottom>
      </FooterInner>
    </FooterWrapper>
  );
}