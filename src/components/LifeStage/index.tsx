'use client';

import { LifeStageWrapper, LifeStageInner, SectionHeader, CardGrid, StageCard } from './LifeStage.style';

const STAGES = [
  { icon: '👶', label: '영유아', desc: '0~6세\n보육 지원' },
  { icon: '🎓', label: '청년', desc: '19~34세\n취업·주거' },
  { icon: '💑', label: '신혼부부', desc: '혼인 7년 이내\n주거·결혼' },
  { icon: '👔', label: '중장년', desc: '35~64세\n재취업·건강' },
  { icon: '🧓', label: '노년', desc: '65세 이상\n돌봄·의료' },
  { icon: '♿', label: '장애인', desc: '장애 유형별\n맞춤 지원' },
];

export default function LifeStage() {
  return (
    <LifeStageWrapper>
      <LifeStageInner>
        <SectionHeader>
          <h2>생애주기별 빠른 찾기</h2>
          <p>해당하는 유형을 선택하면 맞춤 복지를 바로 확인할 수 있어요</p>
        </SectionHeader>

        <CardGrid>
          {STAGES.map((s) => (
            <StageCard key={s.label}>
              <span className="stage_icon">{s.icon}</span>
              <span className="stage_label">{s.label}</span>
              <span className="stage_desc">{s.desc}</span>
            </StageCard>
          ))}
        </CardGrid>
      </LifeStageInner>
    </LifeStageWrapper>
  );
}