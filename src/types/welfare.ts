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

export interface Facility {
  id:          string;
  name:        string;
  category:    string;       // 표준화된 분류 라벨 (복지관 / 주민센터 / 보건소 등)
  rawCategory: string;       // Kakao 원본 category_name
  lat:         number;
  lng:         number;
  address:     string;       // 도로명 우선, 없으면 지번
  phone:       string;
  placeUrl:    string;
  distance:    number;       // 미터, 없으면 0
}