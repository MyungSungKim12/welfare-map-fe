import type { UserProfile } from '@/hooks/useUserProfile';

const interestLabels: Record<string, string> = {
  housing: '주거',
  living: '생활비',
  job: '일자리',
  education: '교육',
  medical: '의료',
  care: '돌봄',
};

const stageLabels: Record<string, string> = {
  youth: '청년',
  newlywed: '신혼부부',
  pregnancy: '임신/출산',
  senior: '고령자',
  disabled: '장애인',
  lowIncome: '저소득',
};

function getAge(birthDate: string) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age > 0 ? age : null;
}

function compactRegion(region: string) {
  if (!region.trim()) return '내 지역';
  const parts = region.trim().split(/\s+/);
  return parts.at(-1) ?? region.trim();
}

export function buildPromptSuggestions(profile: UserProfile | null) {
  if (!profile?.updatedAt) {
    return [
      '강남구 사는 29살 청년인데, 나한테 맞는 혜택 찾아줘',
      '월세 지원이나 생활비 지원 받을 수 있는지 확인해줘',
      '현재 위치 근처에서 바로 상담 가능한 기관 알려줘',
    ];
  }

  const age = getAge(profile.birthDate);
  const region = compactRegion(profile.region);
  const stage = profile.lifeStages.map((item) => stageLabels[item]).filter(Boolean)[0];
  const interest = profile.interests.map((item) => interestLabels[item]).filter(Boolean)[0];
  const family = profile.childrenStatus === 'hasChildren' ? '자녀가 있는' : '';
  const marital = profile.maritalStatus === 'married' ? '기혼' : '미혼';
  const profileText = [region, age ? `${age}살` : '', stage, family, marital]
    .filter(Boolean)
    .join(' ');

  return [
    `${profileText} 조건으로 받을 수 있는 복지 혜택 찾아줘`,
    `${region}에서 ${interest ?? '생활'} 지원 신청 가능한 정책 알려줘`,
    `내 조건과 비슷한 사람이 많이 보는 혜택을 추천해줘`,
  ];
}
