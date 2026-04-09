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
  id:       string;
  title:    string;
  category: string;
  target:   string;
  period:   string;
  region:   string;
  summary:  string;
  link:     string;
  // 위치 기반 클라이언트 필터링용 (local API 응답)
  ctpvNm?:  string;   // 시도명 (예: 인천광역시)
  sggNm?:   string;   // 시군구명 (예: 미추홀구)
}

export interface WelfareMarker {
  id:       string;
  name:     string;
  lat:      number;
  lng:      number;
  category: string;
  address:  string;
}