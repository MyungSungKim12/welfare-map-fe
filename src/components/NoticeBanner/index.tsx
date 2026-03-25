'use client';

import { BannerWrapper, BannerInner, BannerCard } from './NoticeBanner.style';

const NOTICES = [
  {
    type: 'new' as const,
    icon: '🆕',
    badge: '신규',
    title: '2026년 상반기 신규 복지 서비스 안내',
    desc: '이번 달 새로 등록된 복지 서비스를 확인하세요',
  },
  {
    type: 'urgent' as const,
    icon: '⏰',
    badge: '마감임박',
    title: '이번 달 신청 마감 복지 서비스',
    desc: '30일 이내 마감 예정 서비스를 놓치지 마세요',
  },
  {
    type: 'guide' as const,
    icon: '📖',
    badge: '이용가이드',
    title: '복지 서비스 신청 방법 안내',
    desc: '처음이신가요? 단계별 신청 방법을 알려드려요',
  },
];

export default function NoticeBanner() {
  return (
    <BannerWrapper>
      <BannerInner>
        {NOTICES.map((n) => (
          <BannerCard key={n.title} $type={n.type}>
            <span className="banner_icon">{n.icon}</span>
            <div className="banner_content">
              <span className="banner_badge">{n.badge}</span>
              <p className="banner_title">{n.title}</p>
              <p className="banner_desc">{n.desc}</p>
            </div>
          </BannerCard>
        ))}
      </BannerInner>
    </BannerWrapper>
  );
}