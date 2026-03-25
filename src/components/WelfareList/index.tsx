'use client';

import { useState } from 'react';
import WelfareCard from '@/components/WelfareCard';
import { WelfareItem } from '@/types/welfare';
import { ListWrapper, ListHeader, EmptyState } from './WelfareList.style';

// 임시 더미 데이터 (추후 API 연동)
const DUMMY_DATA: WelfareItem[] = [
  {
    id: '1',
    title: '인천시 어르신 무료 건강검진 지원',
    category: '의료',
    target: '만 65세 이상',
    period: '2026.01 ~ 2026.12',
    region: '인천 미추홀구',
    summary: '만 65세 이상 어르신을 대상으로 기본 건강검진 및 치과 검진을 무료로 지원합니다.',
    link: '#',
  },
  {
    id: '2',
    title: '신혼부부 전세자금 대출 이자 지원',
    category: '주거',
    target: '신혼부부',
    period: '2026.03 ~ 2026.12',
    region: '인천 미추홀구',
    summary: '혼인 7년 이내 신혼부부를 대상으로 전세자금 대출 이자의 일부를 지원합니다.',
    link: '#',
  },
  {
    id: '3',
    title: '청년 취업 준비금 지원',
    category: '취업',
    target: '만 19~34세 청년',
    period: '2026.02 ~ 2026.06',
    region: '인천 미추홀구',
    summary: '구직 활동 중인 청년에게 교통비, 자격증 응시료 등 취업 준비에 필요한 비용을 지원합니다.',
    link: '#',
  },
  {
    id: '4',
    title: '임산부 영양제 지원 사업',
    category: '보건',
    target: '임산부',
    period: '연중 상시',
    region: '인천 미추홀구',
    summary: '임신 중인 산모에게 엽산제, 철분제 등 필수 영양제를 무료로 지원합니다.',
    link: '#',
  },
];

export default function WelfareList() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const handleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <ListWrapper>
      <ListHeader>
        <p className="result_count">
          총 <span>{DUMMY_DATA.length}건</span>의 복지 서비스
        </p>
      </ListHeader>

      {DUMMY_DATA.length === 0 ? (
        <EmptyState>
          <span className="empty_icon">🔍</span>
          <p className="empty_text">
            해당하는 복지 서비스가 없습니다.<br />
            필터를 변경해보세요.
          </p>
        </EmptyState>
      ) : (
        DUMMY_DATA.map((item) => (
          <WelfareCard
            key={item.id}
            welfare={item}
            isSaved={savedIds.includes(item.id)}
            onSave={handleSave}
          />
        ))
      )}
    </ListWrapper>
  );
}