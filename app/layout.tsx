import type { Metadata } from 'next';
import './globals.css';
import StyledComponentsRegistry from './lib/registry';

export const metadata: Metadata = {
  title: 'WelfareMap | AI 지역생활 복지 레이더',
  description: '내 위치 기준 복지 정책, 마감 지원, 주변 기관, 저장한 항목을 한 화면에서 확인하는 지역생활 복지 대시보드',
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
