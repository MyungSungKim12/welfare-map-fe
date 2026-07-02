import type { BenefitSourceDescriptor } from '@/types/benefit';

/**
 * 통합 검색이 참조하는 데이터 소스 레지스트리.
 * status:
 *  - active: 현재 검색 라우터가 실제로 호출
 *  - planned: descriptor 만 있고 아직 어댑터 미구현 — UI 에 "예정" 으로 표시
 *  - disabled: 명시적으로 꺼짐
 * envKey 가 있고 값이 없으면 UI 에 "환경변수 필요" 안내.
 */
export const BENEFIT_SOURCES: BenefitSourceDescriptor[] = [
  {
    id: 'bokjiro-local',
    label: '복지로 지자체 복지',
    category: 'welfare',
    status: 'active',
    envKey: 'WELFARE_API_KEY',
    docsUrl: 'https://www.data.go.kr',
    description: '현재 위치와 지자체 조건을 기준으로 지역 복지 서비스를 조회합니다.',
  },
  {
    id: 'bokjiro-national',
    label: '복지로 중앙부처 복지',
    category: 'welfare',
    status: 'active',
    envKey: 'WELFARE_API_KEY',
    docsUrl: 'https://www.data.go.kr',
    description: '전국 공통 복지 서비스를 조회합니다.',
  },
  {
    id: 'gov24-benefits',
    label: '정부24 혜택알리미',
    category: 'government',
    status: 'planned',
    envKey: 'GOV24_API_KEY',
    docsUrl: 'https://www.gov.kr/portal/main',
    description: '"나의 혜택 / 발견 / 간편찾기" 계열 정부24 통합 혜택 데이터.',
  },
  {
    id: 'seoul-open-data',
    label: '서울 열린데이터광장',
    category: 'local',
    status: 'active',
    envKey: 'SEOUL_OPEN_DATA_KEY',
    docsUrl: 'https://data.seoul.go.kr',
    description: '서울시 1인가구, 취약계층, FAQ, 시설/예약성 데이터를 공통 OpenAPI 클라이언트로 조회합니다.',
  },
  {
    id: 'youth-policy',
    label: '온라인청년센터',
    category: 'youth',
    status: 'planned',
    envKey: 'YOUTH_POLICY_API_KEY',
    docsUrl: 'https://www.youthcenter.go.kr',
    description: '청년정책, 청년 일자리, 청년 교육훈련 통합 검색.',
  },
  {
    id: 'employment24',
    label: '고용24',
    category: 'employment',
    status: 'planned',
    envKey: 'EMPLOYMENT24_API_KEY',
    docsUrl: 'https://www.work24.go.kr',
    description: '일자리, 직업훈련, 취업지원 데이터.',
  },
  {
    id: 'mohw-health',
    label: '보건복지 서비스',
    category: 'health',
    status: 'planned',
    envKey: 'MOHW_HEALTH_API_KEY',
    docsUrl: 'https://www.data.go.kr',
    description: '보건소, 건강검진, 의료비 지원 등 보건복지 통합 검색.',
  },
  {
    id: 'housing-support',
    label: 'LH/SH 주거 지원',
    category: 'housing',
    status: 'planned',
    envKey: 'WELFARE_API_KEY',
    docsUrl: 'https://www.lh.or.kr',
    description: 'LH/SH/지자체 임대주택, 월세지원, 청년/신혼 주거 프로그램.',
  },
  {
    id: 'smes-support',
    label: '소상공인/중기부 지원',
    category: 'business',
    status: 'planned',
    envKey: 'WELFARE_API_KEY',
    docsUrl: 'https://www.sbiz.or.kr',
    description: '소상공인시장진흥공단, 중기부 창업/성장/폐업 지원사업.',
  },
  {
    id: 'ai-web-search',
    label: 'AI 웹/RAG 검색',
    category: 'web',
    status: 'planned',
    envKey: 'GEMINI_API_KEY',
    docsUrl: 'https://aistudio.google.com',
    description: '공식 API 에 없는 공지, PDF, 신규 사업을 출처 기반으로 보완.',
  },
];

function isEnvKeySatisfied(descriptor: BenefitSourceDescriptor): boolean {
  if (!descriptor.envKey) return true;
  return Boolean(process.env[descriptor.envKey]);
}

export function getActiveBenefitSources(): BenefitSourceDescriptor[] {
  return BENEFIT_SOURCES.filter((source) => source.status === 'active' && isEnvKeySatisfied(source));
}

export function getPlannedBenefitSources(): BenefitSourceDescriptor[] {
  return BENEFIT_SOURCES.filter((source) => source.status === 'planned' || (source.status === 'active' && !isEnvKeySatisfied(source)));
}

export function findBenefitSource(id: string): BenefitSourceDescriptor | undefined {
  return BENEFIT_SOURCES.find((source) => source.id === id);
}
