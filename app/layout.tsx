import type { Metadata } from 'next';
import './globals.css';
import StyledComponentsRegistry from './lib/registry';

export const metadata: Metadata = {
  title: '복지맵 | 내 주변 복지 정보 한눈에',
  description: '고령화 사회를 위한 지역 기반 복지 정보 통합 서비스',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}