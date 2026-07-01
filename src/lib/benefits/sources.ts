import type { BenefitSourceDescriptor } from '@/types/benefit';

export const BENEFIT_SOURCES: BenefitSourceDescriptor[] = [
  {
    id: 'bokjiro-local',
    label: '복지로 지자체 복지',
    category: 'welfare',
    status: 'active',
    description: '현재 위치와 지자체 조건을 기준으로 지역 복지 서비스를 조회합니다.',
  },
  {
    id: 'bokjiro-national',
    label: '복지로 중앙부처 복지',
    category: 'welfare',
    status: 'active',
    description: '전국 공통 복지 서비스를 조회합니다.',
  },
  {
    id: 'gov24-benefits',
    label: '정부24/보조금 혜택',
    category: 'government',
    status: 'planned',
    description: '정부24 혜택/보조금 계열 데이터를 통합할 예정입니다.',
  },
  {
    id: 'seoul-open-data',
    label: '지자체 오픈데이터',
    category: 'local',
    status: 'planned',
    description: '서울/경기/인천 등 지자체별 청년, 주거, 출산, 돌봄 데이터를 확장합니다.',
  },
  {
    id: 'ai-web-search',
    label: 'AI 웹/RAG 검색',
    category: 'web',
    status: 'planned',
    description: '공식 API에 없는 공지, PDF, 신규 사업을 출처 기반으로 보완합니다.',
  },
];

export function getActiveBenefitSources() {
  return BENEFIT_SOURCES.filter((source) => source.status === 'active');
}

export function getPlannedBenefitSources() {
  return BENEFIT_SOURCES.filter((source) => source.status === 'planned');
}
