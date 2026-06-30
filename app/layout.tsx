import type { Metadata } from 'next';
import './globals.css';
import StyledComponentsRegistry from './lib/registry';

export const metadata: Metadata = {
  title: 'WelfareMap | AI 지역생활 복지 레이더',
  description: '내 위치와 상황에 맞는 복지 정책, 마감 임박 지원, 주변 생활 정보를 한눈에 확인하는 서비스',
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
