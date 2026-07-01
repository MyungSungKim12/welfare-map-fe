import type { WelfareItem } from '@/types/welfare';

export type BenefitSourceId =
  | 'bokjiro-local'
  | 'bokjiro-national'
  | 'gov24-benefits'
  | 'seoul-open-data'
  | 'ai-web-search';

export type BenefitSourceStatus = 'active' | 'planned' | 'disabled';

export interface BenefitSourceDescriptor {
  id: BenefitSourceId;
  label: string;
  category: 'welfare' | 'government' | 'local' | 'web';
  status: BenefitSourceStatus;
  description: string;
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

export interface BenefitSearchResponse {
  items: NormalizedBenefit[];
  sourceResults: BenefitSourceResult[];
  activeSources: BenefitSourceDescriptor[];
  plannedSources: BenefitSourceDescriptor[];
  totalCount: number;
  query: string;
  apiKeyword: string;
}
