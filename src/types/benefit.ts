import type { WelfareItem } from '@/types/welfare';

export type BenefitSourceId =
  | 'bokjiro-local'
  | 'bokjiro-national'
  | 'gov24-benefits'
  | 'seoul-open-data'
  | 'youth-policy'
  | 'employment24'
  | 'mohw-health'
  | 'housing-support'
  | 'smes-support'
  | 'ai-web-search';

export type BenefitSourceStatus = 'active' | 'planned' | 'disabled';

export type BenefitSourceCategory =
  | 'welfare'
  | 'government'
  | 'local'
  | 'youth'
  | 'employment'
  | 'health'
  | 'housing'
  | 'business'
  | 'web';

export interface BenefitSourceDescriptor {
  id: BenefitSourceId;
  label: string;
  category: BenefitSourceCategory;
  status: BenefitSourceStatus;
  description: string;
  /** 활성화에 필요한 env 변수명 (있으면 사용자에게 안내). */
  envKey?: string;
  /** 공식 문서/신청 페이지 링크. UI에 안내 링크로 표시. */
  docsUrl?: string;
}

export interface BenefitSearchRequest {
  query: string;
  apiKeyword?: string;
  ageGroup?: string;
  situation?: string;
  sidoCd?: string;
  sidoName?: string;
  sigunguName?: string;
  numOfRows?: number;
}

export interface BenefitEvidence {
  sourceId: BenefitSourceId;
  sourceLabel: string;
  url: string;
  fetchedAt: string;
}

export interface NormalizedBenefit {
  id: string;
  sourceId: BenefitSourceId;
  sourceLabel: string;
  sourceCategory: BenefitSourceDescriptor['category'];
  title: string;
  summary: string;
  category: string;
  target: string;
  region: string;
  period: string;
  applyUrl: string;
  eligibilityText: string;
  evidence: BenefitEvidence;
  confidence: number;
  raw?: WelfareItem;
}

export interface BenefitSourceResult {
  source: BenefitSourceDescriptor;
  items: NormalizedBenefit[];
  error?: string;
}

/** AI intent parser 가 자연어 쿼리에서 뽑아낸 검색 조건. */
export interface BenefitIntent {
  rawQuery: string;
  keywords: string[];
  lifeStage?: 'child' | 'youth' | 'middle' | 'senior' | 'newlywed' | 'pregnant' | 'disability' | 'lowincome';
  interests: string[];        // '주거', '일자리', '의료', '교육', '돌봄', '생활', '가족'
  region?: {
    sido?: string;
    sigungu?: string;
  };
  urgency: 'urgent' | 'normal';
  source: 'ai' | 'fallback';  // 어떤 파이프라인이 파싱했는지
  confidence: number;         // 0..1
}

export interface BenefitSearchResponse {
  items: NormalizedBenefit[];
  sourceResults: BenefitSourceResult[];
  activeSources: BenefitSourceDescriptor[];
  plannedSources: BenefitSourceDescriptor[];
  totalCount: number;
  query: string;
  apiKeyword: string;
  intent?: BenefitIntent;
}
