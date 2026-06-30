'use client';

import { CalendarDays, FileCheck2, Megaphone } from 'lucide-react';
import { BannerWrapper, BannerInner, BannerCard } from './NoticeBanner.style';
import { WelfareInsights } from '@/utils/welfareInsights';

interface Props {
  insights: WelfareInsights;
  isLoading: boolean;
}

export default function NoticeBanner({ insights, isLoading }: Props) {
  const urgent = insights.urgentItems[0];
  const recent = insights.newItems[0];
  const notices = [
    {
      type: 'urgent' as const,
      icon: CalendarDays,
      badge: urgent?.dday !== null && urgent?.dday !== undefined ? `D-${urgent.dday}` : '마감 관리',
      title: urgent?.title ?? '신청 기한이 가까운 지원을 먼저 확인하세요',
      desc: isLoading
        ? '마감 임박 지원을 조회하고 있습니다.'
        : `${insights.urgentCount}건의 마감 후보를 현재 조건 기준으로 정렬했습니다.`,
    },
    {
      type: 'new' as const,
      icon: Megaphone,
      badge: '새 소식',
      title: recent?.title ?? '우리 동네 신규 복지와 지역 정보를 함께 모읍니다',
      desc: isLoading
        ? '최근 갱신된 정책을 조회하고 있습니다.'
        : `${insights.newCount}건의 최근 갱신 정책이 조회됐습니다.`,
    },
    {
      type: 'guide' as const,
      icon: FileCheck2,
      badge: '신청 준비',
      title: `${insights.categoryCount || 0}개 분야 복지를 한 번에 비교합니다`,
      desc: '다음 단계에서 AI 요약과 준비서류 체크리스트를 연결할 예정입니다.',
    },
  ];

  return (
    <BannerWrapper>
      <BannerInner>
        {notices.map(({ icon: Icon, ...notice }) => (
          <BannerCard key={notice.title} $type={notice.type}>
            <span className="banner_icon"><Icon size={22} /></span>
            <div className="banner_content">
              <span className="banner_badge">{notice.badge}</span>
              <p className="banner_title">{notice.title}</p>
              <p className="banner_desc">{notice.desc}</p>
            </div>
          </BannerCard>
        ))}
      </BannerInner>
    </BannerWrapper>
  );
}
