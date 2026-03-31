export type AgeGroup = 'all' | 'child' | 'youth' | 'middle' | 'senior';

export type Situation =
  | 'all'
  | 'newlywed'
  | 'pregnant'
  | 'job'
  | 'disability'
  | 'lowincome';

export interface FilterType {
  ageGroup: AgeGroup;
  situation: Situation;
  region: string;
}

export interface WelfareItem {
  id: string;
  title: string;
  category: string;
  target: string;
  period: string;
  region: string;
  summary: string;
  link: string;
}

export interface WelfareMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  address: string;
}