// 나이대 필터 옵션
export const AGE_GROUP_OPTIONS = [
  { value: 'all',    label: '전체' },
  { value: 'child',  label: '영유아' },
  { value: 'youth',  label: '청년' },
  { value: 'middle', label: '장년' },
  { value: 'senior', label: '노년' },
] as const;

// 상황 필터 옵션
export const SITUATION_OPTIONS = [
  { value: 'all',        label: '전체' },
  { value: 'newlywed',   label: '신혼부부' },
  { value: 'pregnant',   label: '임산부' },
  { value: 'job',        label: '취업준비' },
  { value: 'disability', label: '장애인' },
  { value: 'lowincome',  label: '저소득층' },
] as const;

// 기본 필터 값
export const DEFAULT_FILTER = {
  ageGroup: 'all',
  situation: 'all',
  region: '인천광역시 미추홀구',
} as const;

// 지도 기본 중심 좌표 (인천 미추홀구)
export const DEFAULT_CENTER = {
  lat: 37.4563,
  lng: 126.7052,
};