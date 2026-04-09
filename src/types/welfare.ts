export type AgeGroup = 'all' | 'child' | 'youth' | 'middle' | 'senior';

export type Situation =
  | 'all'
  | 'newlywed'
  | 'pregnant'
  | 'job'
  | 'disability'
  | 'lowincome';

export interface FilterType {
  ageGroup:  AgeGroup;
  situation: Situation;
  region:    string;
}

export interface WelfareItem {
  id:          string;
  title:       string;
  category:    string;
  target:      string;
  period:      string;
  region:      string;
  summary:     string;
  link:        string;
  // 위치 기반 클라이언트 필터링용
  ctpvNm?:     string;  // 시도명
  sggNm?:      string;  // 시군구명
  // 마감임박 / 신규 배지용
  applyEndDd?:  string;  // 신청 마감일 (예: 20260430)
  lastModYmd?:  string;  // 최종 수정일 (신규 판별용)
  isAlways?:    boolean; // 연중 상시 여부
}

export interface WelfareMarker {
  id:       string;
  name:     string;
  lat:      number;
  lng:      number;
  category: string;
  address:  string;
}