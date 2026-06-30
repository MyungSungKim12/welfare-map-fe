'use client';

import { Baby, BriefcaseBusiness, HeartHandshake, Home, School, UserRoundCheck } from 'lucide-react';
import { LifeStageWrapper, LifeStageInner, SectionHeader, CardGrid, StageCard } from './LifeStage.style';

const STAGES = [
  { icon: Baby, label: '영유아', desc: '보육, 의료, 양육 지원' },
  { icon: School, label: '청년', desc: '취업, 주거, 교육 지원' },
  { icon: HeartHandshake, label: '신혼부부', desc: '주거, 결혼, 출산 지원' },
  { icon: BriefcaseBusiness, label: '중장년', desc: '일자리, 건강, 생활 안정' },
  { icon: UserRoundCheck, label: '노년', desc: '돌봄, 의료, 복지관 정보' },
  { icon: Home, label: '저소득층', desc: '생계, 주거, 의료 지원' },
];

export default function LifeStage() {
  return (
    <LifeStageWrapper>
      <LifeStageInner>
        <SectionHeader>
          <span>빠른 진입</span>
          <h2>내 상황에 가까운 항목부터 시작하세요</h2>
          <p>나이와 생활 상황을 기준으로 복지 후보를 빠르게 좁힐 수 있습니다.</p>
        </SectionHeader>

        <CardGrid>
          {STAGES.map(({ icon: Icon, label, desc }) => (
            <StageCard key={label} type="button">
              <span className="stage_icon"><Icon size={24} /></span>
              <span className="stage_label">{label}</span>
              <span className="stage_desc">{desc}</span>
            </StageCard>
          ))}
        </CardGrid>
      </LifeStageInner>
    </LifeStageWrapper>
  );
}
